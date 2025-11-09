/**
 * Wedding Details Constants
 * All wedding-related information for the About page
 */

export interface ScheduleItem {
  time: string;
  event: string;
  description?: string;
}

export interface VenueInfo {
  name: string;
  address: string;
  city: string;
  postcode: string;
  description: string;
}

export interface AccommodationInfo {
  name: string;
  address: string;
  distance: string;
  phone?: string;
  website?: string;
}

/**
 * Wedding date and venue information
 */
export const WEDDING_DATE = 'Thursday, July 2nd, 2026';
export const WEDDING_DATE_SHORT = 'July 2, 2026';

/**
 * Venue details
 */
export const VENUE: VenueInfo = {
  name: 'Thorpe Gardens',
  address: 'Thorpe Gardens',
  city: 'Tamworth',
  postcode: 'B79 7XX',
  description: 'A beautiful garden venue perfect for celebrating our special day.',
};

/**
 * Wedding day schedule
 */
export const SCHEDULE: ScheduleItem[] = [
  {
    time: '2:00 PM',
    event: 'Ceremony',
    description: 'Please arrive by 1:45 PM',
  },
  {
    time: '3:00 PM',
    event: 'Reception',
    description: 'Drinks and canapés in the garden',
  },
  {
    time: '5:00 PM',
    event: 'Wedding Breakfast',
    description: 'Seated dinner service',
  },
  {
    time: '7:00 PM',
    event: 'Speeches & Cake Cutting',
  },
  {
    time: '8:00 PM',
    event: 'Evening Reception',
    description: 'Dancing and celebration',
  },
  {
    time: '11:30 PM',
    event: 'Last Orders',
  },
  {
    time: '12:00 AM',
    event: 'Carriages',
  },
];

/**
 * Dress code information
 */
export const DRESS_CODE = {
  title: 'Formal',
  description: 'We kindly request formal attire for our wedding. Suits and ties for gentlemen, and formal dresses or evening gowns for ladies.',
  note: 'Please be mindful that part of the reception will be in the garden, so appropriate footwear is recommended.',
};

/**
 * Nearby accommodations
 */
export const ACCOMMODATIONS: AccommodationInfo[] = [
  {
    name: 'Premier Inn Tamworth Central',
    address: 'Bolebridge Street, Tamworth',
    distance: '1.5 miles from venue',
    phone: '0333 777 4648',
    website: 'https://www.premierinn.com',
  },
  {
    name: 'Holiday Inn Tamworth',
    address: 'Riverdrive, Tamworth',
    distance: '2 miles from venue',
    phone: '0871 942 9084',
    website: 'https://www.ihg.com',
  },
  {
    name: 'The Globe Inn',
    address: 'Lower Gungate, Tamworth',
    distance: '1 mile from venue',
    phone: '01827 60455',
  },
];

/**
 * Additional information for guests
 */
export const ADDITIONAL_INFO = {
  parking: 'Free parking is available at the venue.',
  accessibility: 'The venue is wheelchair accessible. Please contact us if you have any specific requirements.',
  children: 'We love your little ones, but we kindly request an adults-only celebration.',
  gifts: 'Your presence at our wedding is the greatest gift of all. If you wish to give a gift, a contribution to our honeymoon fund would be greatly appreciated.',
};
