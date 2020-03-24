import glob from 'glob';
import {omit} from 'lodash';
import React from 'react';

import path from 'path';

import {Icon} from './Icon';

const sizeRe = /(\w+)\.(\w+)/;

let iconFiles;
if (process.env.NODE_ENV === 'testing') {
  iconFiles = glob.sync(`${__dirname}/svg/*.svg`, {});
} else {
  // Take the filenames in the svg folder.
  iconFiles = require.context('null-loader!./svg').keys();
}

const iconNames = iconFiles
  .map((filename) => path.basename(filename, '.svg'))
  .filter((name) => !name.match(sizeRe));

if (__DEBUG__) {
  iconNames.forEach((iconName) => {
    // From http://stackoverflow.com/questions/1128305/regular-expression-to-identify-camelcased-words
    if (!iconName.match('([A-Z][a-z0-9]+)+')) {
      throw Error(`${iconName}.svg is not a CamelCased filename.`);
    }
  });
}

const iconToComponent = (iconName) => {
  const displayName = `${iconName}Icon`;
  /* eslint-disable react/forbid-foreign-prop-types */
  class GenericIcon extends React.Component {
    static propTypes = omit(Icon.propTypes, 'iconName');
    static defaultProps = Icon.defaultProps;
    static displayName = displayName;

    render() {
      return <Icon {...this.props} iconName={iconName} />;
    }
  }

  return GenericIcon;
};

export const AlertIcon = iconToComponent('Alert');
export const AppointmentIcon = iconToComponent('Appointment');
export const ArchiveIcon = iconToComponent('Archive');
export const AttachmentIcon = iconToComponent('Attachment');
export const BabyBottleIcon = iconToComponent('BabyBottle');
export const BackIcon = iconToComponent('Back');
export const BackArrowIcon = iconToComponent('BackArrow');
export const BillIcon = iconToComponent('Bill');
export const BrandDrugIcon = iconToComponent('BrandDrug');
export const CalendarIcon = iconToComponent('Calendar');
export const ChatIcon = iconToComponent('Chat');
export const CheckmarkIcon = iconToComponent('Checkmark');
export const CircleCheckmarkIcon = iconToComponent('CircleCheckmark');
export const CirclePlusIcon = iconToComponent('CirclePlus');
export const CloseIcon = iconToComponent('Close');
export const CodeIcon = iconToComponent('Code');
export const CommentIcon = iconToComponent('Comment');
export const CompassIcon = iconToComponent('Compass');
export const CompleteIcon = iconToComponent('Complete');
export const ConditionIcon = iconToComponent('Condition');
export const CostIcon = iconToComponent('Cost');
export const DialpadIcon = iconToComponent('Dialpad');
export const DocumentIcon = iconToComponent('Document');
export const DownloadIcon = iconToComponent('Download');
export const DropdownIcon = iconToComponent('Dropdown');
export const DuplicateIcon = iconToComponent('Duplicate');
export const EditIcon = iconToComponent('Edit');
export const EducationIcon = iconToComponent('Education');
export const ExperienceIcon = iconToComponent('Experience');
export const ExportIcon = iconToComponent('Export');
export const EyeIcon = iconToComponent('Eye');
export const EyeClosedIcon = iconToComponent('EyeClosed');
export const FemaleIcon = iconToComponent('Female');
export const FiltersIcon = iconToComponent('Filters');
export const FirstPageIcon = iconToComponent('FirstPage');
export const ForwardIcon = iconToComponent('Forward');
export const ForwardArrowIcon = iconToComponent('ForwardArrow');
export const GymIcon = iconToComponent('Gym');
export const HeartIcon = iconToComponent('Heart');
export const HelpIcon = iconToComponent('Help');
export const HistoryIcon = iconToComponent('History');
export const HomeIcon = iconToComponent('Home');
export const HospitalIcon = iconToComponent('Hospital');
export const IDCardIcon = iconToComponent('IDCard');
export const ImageIcon = iconToComponent('Image');
export const InactiveIcon = iconToComponent('Inactive');
export const InfoIcon = iconToComponent('Info');
export const LabsIcon = iconToComponent('Labs');
export const LanguageIcon = iconToComponent('Language');
export const LastPageIcon = iconToComponent('LastPage');
export const LikeIcon = iconToComponent('Like');
export const LinkIcon = iconToComponent('Link');
export const ListIcon = iconToComponent('List');
export const LocationIcon = iconToComponent('Location');
export const LockIcon = iconToComponent('Lock');
export const LoginIcon = iconToComponent('Login');
export const MailIcon = iconToComponent('Mail');
export const MaleIcon = iconToComponent('Male');
export const MenuIcon = iconToComponent('Menu');
export const MessageIcon = iconToComponent('Message');
export const MoneyIcon = iconToComponent('Money');
export const MoreIcon = iconToComponent('More');
export const NoAppointmentIcon = iconToComponent('NoAppointment');
export const NotCompleteIcon = iconToComponent('NotComplete');
export const NotesIcon = iconToComponent('Notes');
export const NotificationsIcon = iconToComponent('Notifications');
export const PauseIcon = iconToComponent('Pause');
export const PhoneIcon = iconToComponent('Phone');
export const PhoneDownIcon = iconToComponent('PhoneDown');
export const PillIcon = iconToComponent('Pill');
export const PinIcon = iconToComponent('Pin');
export const PlaceIcon = iconToComponent('Place');
export const PlusIcon = iconToComponent('Plus');
export const PrinterIcon = iconToComponent('Printer');
export const ProfileIcon = iconToComponent('Profile');
export const RefreshIcon = iconToComponent('Refresh');
export const RulerIcon = iconToComponent('Ruler');
export const SearchIcon = iconToComponent('Search');
export const SettingsIcon = iconToComponent('Settings');
export const ShareIcon = iconToComponent('Share');
export const SplitIcon = iconToComponent('Split');
export const StarIcon = iconToComponent('Star');
export const StepsIcon = iconToComponent('Steps');
export const StethoscopeIcon = iconToComponent('Stethoscope');
export const SwapIcon = iconToComponent('Swap');
export const TagIcon = iconToComponent('Tag');
export const TalkWithAGuideIcon = iconToComponent('TalkWithAGuide');
export const ThumbsDownIcon = iconToComponent('ThumbsDown');
export const ThumbsUpIcon = iconToComponent('ThumbsUp');
export const TrashCanIcon = iconToComponent('TrashCan');
export const TreatedForIcon = iconToComponent('TreatedFor');
export const UnlockIcon = iconToComponent('Unlock');
export const UpArrowIcon = iconToComponent('UpArrow');
export const UploadArrowIcon = iconToComponent('UploadArrow');
export const ZoomInIcon = iconToComponent('ZoomIn');
export const ZoomOutIcon = iconToComponent('ZoomOut');
