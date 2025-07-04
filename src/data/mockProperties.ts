import { Property } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3BHK Apartment in Gulshan',
    titleBn: 'গুলশানে আধুনিক ৩ বেডরুমের অ্যাপার্টমেন্ট',
    description: 'Spacious and well-furnished apartment with modern amenities',
    descriptionBn: 'আধুনিক সুবিধা সহ প্রশস্ত এবং সুসজ্জিত অ্যাপার্টমেন্ট',
    price: 45000,
    currency: 'BDT',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    images: [
      {
        id: '1-1',
        src: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        alt: 'Modern apartment living room',
        altBn: 'আধুনিক অ্যাপার্টমেন্টের বসার ঘর',
        priority: true
      }
    ],
    location: {
      address: 'Road 12, Block C, Gulshan-1',
      addressBn: 'রোড ১২, ব্লক সি, গুলশান-১',
      city: 'dhaka',
      area: 'Gulshan',
      areaBn: 'গুলশান',
      coordinates: { lat: 30, lng: 40 },
      nearbyPlaces: ['Gulshan Circle 1', 'Gulshan Lake'],
      nearbyPlacesBn: ['গুলশান সার্কেল ১', 'গুলশান লেক']
    },
    amenities: ['Air Conditioning', 'Parking', 'Security', 'Elevator'],
    amenitiesBn: ['এয়ার কন্ডিশনার', 'পার্কিং', 'নিরাপত্তা', 'লিফট'],
    landlord: {
      id: 'l1',
      name: 'Rahman Ahmed',
      nameBn: 'রহমান আহমেদ',
      phone: '+8801712345678',
      email: 'rahman@example.com',
      rating: 4.5,
      verified: true
    },
    available: true,
    availableFrom: new Date('2024-02-01'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Cozy 2BHK in Dhanmondi',
    titleBn: 'ধানমন্ডিতে আরামদায়ক ২ বেডরুমের ফ্ল্যাট',
    description: 'Perfect for small families with all necessary amenities',
    descriptionBn: 'সব প্রয়োজনীয় সুবিধা সহ ছোট পরিবারের জন্য উপযুক্ত',
    price: 28000,
    currency: 'BDT',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    images: [
      {
        id: '2-1',
        src: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
        alt: 'Cozy apartment bedroom',
        altBn: 'আরামদায়ক অ্যাপার্টমেন্টের শোবার ঘর',
        priority: false
      }
    ],
    location: {
      address: 'Road 5, Dhanmondi',
      addressBn: 'রোড ৫, ধানমন্ডি',
      city: 'dhaka',
      area: 'Dhanmondi',
      areaBn: 'ধানমন্ডি',
      coordinates: { lat: 45, lng: 35 },
      nearbyPlaces: ['Dhanmondi Lake', 'TSC'],
      nearbyPlacesBn: ['ধানমন্ডি লেক', 'টিএসসি']
    },
    amenities: ['Air Conditioning', 'Internet', 'Kitchen'],
    amenitiesBn: ['এয়ার কন্ডিশনার', 'ইন্টারনেট', 'রান্নাঘর'],
    landlord: {
      id: 'l2',
      name: 'Fatima Khatun',
      nameBn: 'ফাতিমা খাতুন',
      phone: '+8801987654321',
      rating: 4.2,
      verified: true
    },
    available: true,
    availableFrom: new Date('2024-02-15'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'Sea View Apartment in Chittagong',
    titleBn: 'চট্টগ্রামে সমুদ্র দৃশ্য সহ অ্যাপার্টমেন্ট',
    description: 'Beautiful apartment with stunning sea views',
    descriptionBn: 'অসাধারণ সমুদ্র দৃশ্য সহ সুন্দর অ্যাপার্টমেন্ট',
    price: 35000,
    currency: 'BDT',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1000,
    images: [
      {
        id: '3-1',
        src: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg',
        alt: 'Sea view apartment',
        altBn: 'সমুদ্র দৃশ্য সহ অ্যাপার্টমেন্ট',
        priority: false
      }
    ],
    location: {
      address: 'CDA Avenue, Chittagong',
      addressBn: 'সিডিএ এভিনিউ, চট্টগ্রাম',
      city: 'chittagong',
      area: 'CDA Avenue',
      areaBn: 'সিডিএ এভিনিউ',
      coordinates: { lat: 65, lng: 70 },
      nearbyPlaces: ['Port City', 'Beach'],
      nearbyPlacesBn: ['বন্দর শহর', 'সৈকত']
    },
    amenities: ['Sea View', 'Balcony', 'Security'],
    amenitiesBn: ['সমুদ্র দৃশ্য', 'বারান্দা', 'নিরাপত্তা'],
    landlord: {
      id: 'l3',
      name: 'Karim Uddin',
      nameBn: 'করিম উদ্দিন',
      phone: '+8801555666777',
      rating: 4.7,
      verified: true
    },
    available: true,
    availableFrom: new Date('2024-01-25'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '4',
    title: 'Student Friendly Room in Uttara',
    titleBn: 'উত্তরায় ছাত্র বান্ধব রুম',
    description: 'Affordable room perfect for students',
    descriptionBn: 'ছাত্রদের জন্য উপযুক্ত সাশ্রয়ী রুম',
    price: 12000,
    currency: 'BDT',
    type: 'room',
    bedrooms: 1,
    bathrooms: 1,
    area: 300,
    images: [
      {
        id: '4-1',
        src: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
        alt: 'Student room',
        altBn: 'ছাত্র রুম',
        priority: false
      }
    ],
    location: {
      address: 'Sector 7, Uttara',
      addressBn: 'সেক্টর ৭, উত্তরা',
      city: 'dhaka',
      area: 'Uttara',
      areaBn: 'উত্তরা',
      coordinates: { lat: 25, lng: 45 },
      nearbyPlaces: ['Uttara University', 'Shopping Mall'],
      nearbyPlacesBn: ['উত্তরা বিশ্ববিদ্যালয়', 'শপিং মল']
    },
    amenities: ['WiFi', 'Study Table', 'Shared Kitchen'],
    amenitiesBn: ['ওয়াইফাই', 'পড়ার টেবিল', 'শেয়ার রান্নাঘর'],
    landlord: {
      id: 'l4',
      name: 'Nasir Hossain',
      nameBn: 'নাসির হোসেন',
      phone: '+8801333444555',
      rating: 4.0,
      verified: false
    },
    available: true,
    availableFrom: new Date('2024-02-10'),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
];