"""
This script takes as input a CSV file with the following columns:

    facility_id             Unique value per facility - keep this id stable for the same facility across multiple uploads
    display                 Whether to show this facility in the search tool.(1/true = show, 0/false = hide)
    facility_display_note   Facility metadata, used for display (e.g. "65 and over only")
    facility_name           Name of the facility.
    address                 Address line 1 or lines 1 and 2.
    city                    City.
    state                   State.
    zip                     Zipcode.
    sunday_start            Start of hours of operation on Sunday in HH:MM. Example: 9:00 (Local time to the facility itself)
    sunday_end              End of hours of operation on Sunday in HH:MM. Example: 17:00
    monday_start
    monday_end
    tuesday_start
    tuesday_end
    wednesday_start
    wednesday_end
    thursday_start
    thursday_end
    friday_start
    friday_end
    saturday_start
    saturday_end

The order of the columns within the csv doesn't matter.
Usage:
pip install -r requirements.txt
python <path_to_script>/convert_covid_facilities_file.py <path_to_input_file> <output_file_name> <goole-maps-API-key>
Usage example:
python convert_covid_facilities_file.py testing_sites.csv out.json <goole-maps-API-key>

Requirements (specified in requirements.txt):
Python 3
unicodecsv - pip install unicodecsv
googlemaps - pip install googlemaps

"""

import json
import sys
import traceback

import googlemaps
import unicodecsv


YES_VALUES = {'yes', 'true', '1'}
NO_VALUES = {'no', 'false', '0'}
NULL_VALUES = {'null', ''}


class Geocoder(object):

    def __init__(self, api_key):
        self.gmap_client = googlemaps.Client(key=api_key)

    def get_place_id_lat_lng(self, address, city, state, zip_code):
        address_str = '{address}, {city}, {state} {zip}'.format(
            address=address,
            city=city,
            state=state,
            zip=zip_code)
        lat, lng, place_id = None, None, None
        try:
            geocode_results = self.gmap_client.geocode(address_str)
            geo_result = geocode_results[0]
            lat = geo_result['geometry']['location']['lat']
            lng = geo_result['geometry']['location']['lng']
            place_id = geo_result['place_id']
        except Exception:
            print('Failed geocoding {}'.format(address_str))
            traceback.print_exc(file=sys.stdout)
            print('geocode_results: {}'.format(geocode_results))
        return place_id, lat, lng


def make_row(geocoder, in_row):
    row = {
        'facility_id': None,
        'facility_name': None,
        'phone': None,
        'address': None,
        'city': None,
        'state': None,
        'zip': None,
        'facility_metadata': None
    }

    for field in row.keys():
        if field in in_row:
            row[field] = in_row[field]

    if 'facility_display_note' in in_row:
        row['facility_metadata'] = in_row['facility_display_note']

    visible = (in_row['display'] or '').lower()
    if visible in YES_VALUES:
        row['visible'] = True
    elif visible in NO_VALUES:
        row['visible'] = False
    elif visible in NULL_VALUES:
        row['visible'] = None
    else:
        raise ValueError('unknown display value: {!r}'.format(visible))

    # exclude from output json unless explicitly set to visible
    if row['visible'] is not True:
        return {}

    row['hours_of_operation'] = hours_of_operation = {}
    days = 'sunday monday tuesday wednesday thursday friday saturday sunday'.split()
    for day in days:
        day_abbr = day[:3]
        start = in_row['{}_start'.format(day)]
        end = in_row['{}_end'.format(day)]
        hours_of_operation[day_abbr] = {
            'status': (1 if start or end else 0),
            'start': start or None,
            'end': end or None,
        }

    row['place_id'], row['lat'], row['lng'] = geocoder.get_place_id_lat_lng(
        row['address'],
        row['city'],
        row['state'],
        row['zip']
    )

    return row


def main(input_file, output_file, api_key):
    geocoder = Geocoder(api_key)

    with open(input_file, 'rb') as infile:
        reader = unicodecsv.DictReader(infile)

        out_results = [
            make_row(geocoder, result_row)
            for result_row in reader
        ]

        # remove empty rows
        out_results = [r for r in out_results if r]

    with open(output_file, 'w') as f_out:
        json.dump(out_results, f_out)


if __name__ == '__main__':
    if len(sys.argv) != 4:
        print('Usage:\n\tpython {} input_file output_file api_key'.format(sys.argv[0]))
    main(sys.argv[1], sys.argv[2], sys.argv[3])
