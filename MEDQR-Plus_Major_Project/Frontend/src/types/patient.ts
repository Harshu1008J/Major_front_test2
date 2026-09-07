export type RecordType = 'prescription' | 'lab' | 'imaging' | 'consultation' | 'vaccine';

export type UserRole = 'patient' | 'hospital' | 'admin';

export type HospitalVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface MedicalRecord {
  id: string;
  type: RecordType;
  title: string;
  doctor: string;
  hospital: string;
  date: string;
  summary: string;
  details: string;
  tags: string[];
  fileSize?: string;
  fileName?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface InsuranceDetails {
  provider: string;
  policyNumber: string;
  validUntil: string;
}

export interface ActivityLogItem {
  id: string;
  type: 'tier_scan' | 'record_added' | 'ai_session' | 'profile_updated' | 'account_created';
  title: string;
  subtitle: string;
  date: string;
  color?: string;
}

export interface HospitalAccessRecord {
  id: string;
  patientId: string;
  patientName: string;
  accessTier: 1 | 2 | 3;
  timestamp: string;
  hospitalId: string;
  hospitalName: string;
  department?: string;
  notes?: string;
  reason?: string;
  bloodGroup?: string;
  allergies?: string[];
  recordsCount?: number;
}

export interface HospitalRegistrationInput {
  hospitalName: string;
  licenseNumber: string;
  address: string;
  contactPersonName: string;
  email: string;
  phone: string;
  password?: string;
}

export interface HospitalAccount {
  id: string; // e.g. HOSP-001 or HOSP-2024-XXXXX
  role: 'hospital';
  hospitalName: string;
  licenseNumber: string;
  address: string;
  contactPersonName: string;
  email: string;
  phone: string;
  password?: string;
  verified: boolean;
  status: HospitalVerificationStatus;
  registeredAt: string;
  verifiedAt?: string;
  department?: string;
  patientsAccessed?: HospitalAccessRecord[];
  scanLogs?: HospitalAccessRecord[];
}

export interface UserPatientData {
  id: string; // e.g. MQR-2024-84912 or HOSP-001
  role?: UserRole; // 'patient' (default) | 'hospital' | 'admin'
  name: string;
  email: string;
  phone: string;
  password?: string;
  dob?: string;
  gender?: string;
  blood?: string;
  height?: string;
  weight?: string;
  address?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  issuingHospital?: string;
  issuingHospitalName?: string;
  emergency?: EmergencyContact;
  insurance?: InsuranceDetails;
  avatar: string | null;
  records: MedicalRecord[];
  activityLogs: ActivityLogItem[];
  registeredAt: string;
  nextAppointment?: string;

  // Hospital-specific fields (when loaded into active session)
  hospitalId?: string; // e.g. 'HOSP-001'
  hospitalName?: string; // e.g. 'Apollo Hospitals, New Delhi'
  department?: string; // e.g. 'Emergency & Inpatient Medicine'
  licenseNumber?: string; // e.g. 'MED-LIC-DL-84920'
  contactPersonName?: string;
  verified?: boolean;
  status?: HospitalVerificationStatus;
  patientsAccessed?: HospitalAccessRecord[];
  scanLogs?: HospitalAccessRecord[];
}
