import {VisaIcon} from '../../images/VisaIcon';
import {AmexIcon} from '../../images/AmexIcon';
import {MasterCardIcon} from '../../images/MasterCardIcon';
import {DiscoverIcon} from '../../images/DiscoverIcon';

const imageMap = {
  'Visa': VisaIcon,
  'MasterCard': MasterCardIcon,
  'American Express': AmexIcon,
  'Discover': DiscoverIcon
};

export const getCardImage = brand => {
  return imageMap[brand] || VisaIcon;
};



// WEBPACK FOOTER //
// ./src/main/app/helpers/getCardImage.js