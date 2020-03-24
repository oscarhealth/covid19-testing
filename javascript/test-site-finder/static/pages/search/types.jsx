// @flow

export type TimeSlot = {|
  date: string, // MM/DD
  slotEnd: number,
  slotIndex: number,
  slotStart: number,
|};

export type Facility = {|
  address: string,
  address_hash: string,
  city: string,
  distance: number,
  facility_id: string,
  facility_name: string,
  facility_metadata: string,
  geohash: string,
  hours_of_operation: Object[],
  is_federal: boolean,
  lat: number,
  lng: number,
  npi: string,
  phone?: string,
  state: string,
  recommendedVisitTime: TimeSlot,
  wheelchair_accessible?: boolean,
  zip: string,
|};
