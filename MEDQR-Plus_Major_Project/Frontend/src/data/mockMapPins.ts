export type FacilityType = 'hospital' | 'pharmacy' | 'blood_bank' | 'ambulance' | 'diagnostic';

export interface MapPin {
  id: string;
  name: string;
  type: FacilityType;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  distance: string;
  rating: number;
  open24h: boolean;
  hours?: string;
  beds?: number;
  emergencyAvailable?: boolean;
}

// Centered around Connaught Place, New Delhi
export const mockMapPins: MapPin[] = [
  {
    id: 'MAP-001', type: 'hospital', name: 'Apollo Hospitals, Sarita Vihar',
    lat: 28.5353, lng: 77.2796, address: 'Sarita Vihar, New Delhi - 110076',
    phone: '+91-11-7179-1090', distance: '2.1 km', rating: 4.7,
    open24h: true, beds: 710, emergencyAvailable: true,
  },
  {
    id: 'MAP-002', type: 'hospital', name: 'AIIMS New Delhi',
    lat: 28.5672, lng: 77.2100, address: 'Ansari Nagar, New Delhi - 110029',
    phone: '+91-11-2658-8500', distance: '3.8 km', rating: 4.9,
    open24h: true, beds: 2478, emergencyAvailable: true,
  },
  {
    id: 'MAP-003', type: 'hospital', name: 'Safdarjung Hospital',
    lat: 28.5688, lng: 77.2065, address: 'Ansari Nagar West, New Delhi - 110029',
    phone: '+91-11-2673-0000', distance: '4.2 km', rating: 4.1,
    open24h: true, beds: 1531, emergencyAvailable: true,
  },
  {
    id: 'MAP-004', type: 'pharmacy', name: 'MedPlus Pharmacy - CP',
    lat: 28.6340, lng: 77.2195, address: 'Connaught Place, New Delhi - 110001',
    phone: '+91-11-4367-2000', distance: '0.5 km', rating: 4.3,
    open24h: false, hours: '8 AM – 10 PM',
  },
  {
    id: 'MAP-005', type: 'pharmacy', name: 'Apollo Pharmacy - Janpath',
    lat: 28.6270, lng: 77.2180, address: 'Janpath, New Delhi - 110001',
    phone: '+91-80-7177-7555', distance: '0.9 km', rating: 4.5,
    open24h: true,
  },
  {
    id: 'MAP-006', type: 'blood_bank', name: 'IRCS Blood Bank',
    lat: 28.6448, lng: 77.2167, address: 'Red Cross Road, New Delhi - 110001',
    phone: '+91-11-2371-6441', distance: '1.3 km', rating: 4.6,
    open24h: true, emergencyAvailable: true,
  },
  {
    id: 'MAP-007', type: 'blood_bank', name: 'Rotary Blood Bank',
    lat: 28.5985, lng: 77.2194, address: 'Tughlakabad, New Delhi - 110044',
    phone: '+91-11-2647-5505', distance: '5.1 km', rating: 4.4,
    open24h: true,
  },
  {
    id: 'MAP-008', type: 'ambulance', name: '108 Emergency Services',
    lat: 28.6290, lng: 77.2050, address: 'Central Dispatch, New Delhi',
    phone: '108', distance: 'On-Call', rating: 4.5,
    open24h: true, emergencyAvailable: true,
  },
  {
    id: 'MAP-009', type: 'ambulance', name: 'Ziqitza Ambulance (1298)',
    lat: 28.6515, lng: 77.2310, address: 'North Delhi Hub',
    phone: '1298', distance: 'On-Call', rating: 4.2,
    open24h: true, emergencyAvailable: true,
  },
  {
    id: 'MAP-010', type: 'diagnostic', name: 'SRL Diagnostics - CP',
    lat: 28.6360, lng: 77.2250, address: 'Inner Circle, CP, New Delhi - 110001',
    phone: '+91-11-6700-8500', distance: '0.7 km', rating: 4.4,
    open24h: false, hours: '7 AM – 9 PM',
  },
  {
    id: 'MAP-011', type: 'diagnostic', name: 'Dr. Lal PathLabs',
    lat: 28.6230, lng: 77.2090, address: 'Gole Market, New Delhi - 110001',
    phone: '+91-11-3988-8282', distance: '1.6 km', rating: 4.6,
    open24h: false, hours: '7 AM – 8 PM',
  },
  {
    id: 'MAP-012', type: 'hospital', name: 'Ram Manohar Lohia Hospital',
    lat: 28.6246, lng: 77.2010, address: 'Baba Kharak Singh Marg, New Delhi - 110001',
    phone: '+91-11-2336-5525', distance: '1.1 km', rating: 3.9,
    open24h: true, beds: 1532, emergencyAvailable: true,
  },
  {
    id: 'MAP-013', type: 'pharmacy', name: 'Religare Health Pharmacy',
    lat: 28.6180, lng: 77.2180, address: 'Connaught Circus, New Delhi - 110001',
    phone: '+91-80-3940-4040', distance: '1.8 km', rating: 4.1,
    open24h: false, hours: '8 AM – 11 PM',
  },
  {
    id: 'MAP-014', type: 'diagnostic', name: 'Thyrocare Collection Centre',
    lat: 28.6420, lng: 77.2270, address: 'Paharganj, New Delhi - 110055',
    phone: '+91-22-6900-6900', distance: '1.4 km', rating: 4.3,
    open24h: false, hours: '6 AM – 2 PM',
  },
  {
    id: 'MAP-015', type: 'blood_bank', name: 'Delhi Blood Bank Society',
    lat: 28.6380, lng: 77.2310, address: 'Daryaganj, New Delhi - 110002',
    phone: '+91-11-2325-9999', distance: '2.3 km', rating: 4.0,
    open24h: true,
  },
];
