import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserPatientData,
  MedicalRecord,
  ActivityLogItem,
  HospitalAccessRecord,
  HospitalAccount,
  HospitalRegistrationInput,
  HospitalVerificationStatus,
} from '../types/patient';

interface AuthContextType {
  user: UserPatientData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeScannedPatientId: string | null;
  setActiveScannedPatientId: (id: string | null) => void;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, phone: string, email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  registerHospital: (input: HospitalRegistrationInput) => Promise<{ success: boolean; message?: string; hospitalId?: string }>;
  logout: () => void;
  updateProfile: (updatedFields: Partial<UserPatientData>) => void;
  addRecord: (record: Omit<MedicalRecord, 'id'>) => MedicalRecord;
  deleteRecord: (recordId: string) => void;
  getPatientById: (patientId: string) => UserPatientData | null;
  getAllPatients: () => UserPatientData[];
  getAllHospitalAccounts: () => HospitalAccount[];
  verifyHospitalAccount: (hospitalId: string, verified: boolean, status: HospitalVerificationStatus) => void;
  recordHospitalScan: (patientId: string, tier: 1 | 2 | 3, reason?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'medqr_registered_users';
const HOSPITALS_STORAGE_KEY = 'medqr_registered_hospitals';
const ACTIVE_USER_STORAGE_KEY = 'medqr_active_user_id';
const ACTIVE_USER_TYPE_KEY = 'medqr_active_user_type';

const loadPatientsFromStorage = (): Record<string, UserPatientData> => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Error loading patients from localStorage:', err);
    return {};
  }
};

const loadHospitalsFromStorage = (): Record<string, HospitalAccount> => {
  try {
    const raw = localStorage.getItem(HOSPITALS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Error loading hospitals from localStorage:', err);
    return {};
  }
};

const savePatientsToStorage = (patients: Record<string, UserPatientData>) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(patients));
  } catch (err) {
    console.error('Error saving patients to localStorage:', err);
  }
};

const saveHospitalsToStorage = (hospitals: Record<string, HospitalAccount>) => {
  try {
    localStorage.setItem(HOSPITALS_STORAGE_KEY, JSON.stringify(hospitals));
  } catch (err) {
    console.error('Error saving hospitals to localStorage:', err);
  }
};

// Convert a HospitalAccount to the active UserPatientData session structure
const hospitalToUserPatientData = (h: HospitalAccount): UserPatientData => ({
  id: h.id,
  role: 'hospital',
  name: h.contactPersonName || h.hospitalName,
  email: h.email,
  phone: h.phone,
  password: h.password,
  hospitalId: h.id,
  hospitalName: h.hospitalName,
  licenseNumber: h.licenseNumber,
  contactPersonName: h.contactPersonName,
  address: h.address,
  department: h.department || 'Clinical Department',
  verified: h.verified,
  status: h.status,
  registeredAt: h.registeredAt,
  avatar: null,
  records: [],
  activityLogs: [],
  patientsAccessed: h.patientsAccessed || [],
  scanLogs: h.scanLogs || [],
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeScannedPatientId, setActiveScannedPatientId] = useState<string | null>(null);

  // Restore active user session on app mount
  useEffect(() => {
    const activeId = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    const activeType = localStorage.getItem(ACTIVE_USER_TYPE_KEY);

    if (activeId) {
      if (activeType === 'hospital') {
        const allHospitals = loadHospitalsFromStorage();
        if (allHospitals[activeId]) {
          setUser(hospitalToUserPatientData(allHospitals[activeId]));
        } else {
          localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
          localStorage.removeItem(ACTIVE_USER_TYPE_KEY);
        }
      } else {
        const allPatients = loadPatientsFromStorage();
        if (allPatients[activeId]) {
          setUser(allPatients[activeId]);
        } else {
          localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
          localStorage.removeItem(ACTIVE_USER_TYPE_KEY);
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Register as Patient — completely empty profile except user-entered fields
  const register = async (
    name: string,
    phone: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanName = name.trim();

    const allPatients = loadPatientsFromStorage();

    const existing = Object.values(allPatients).find(
      u => u.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      setIsLoading(false);
      return {
        success: false,
        message: 'A patient account with this email address already exists. Please sign in.',
      };
    }

    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const generatedId = `MQR-${currentYear}-${randomSuffix}`;
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newUser: UserPatientData = {
      id: generatedId,
      role: 'patient',
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: password || '',
      dob: '',
      gender: '',
      blood: '',
      height: '',
      weight: '',
      address: '',
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      issuingHospital: '',
      issuingHospitalName: '',
      emergency: { name: '', relation: '', phone: '' },
      avatar: null,
      records: [],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          type: 'account_created',
          title: 'MedQR+ Pass Initialized',
          subtitle: `Unique patient identifier ${generatedId} encrypted`,
          date: formattedDate,
          color: 'var(--color-teal)',
        },
      ],
      registeredAt: new Date().toISOString().split('T')[0],
    };

    allPatients[newUser.id] = newUser;
    savePatientsToStorage(allPatients);
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, newUser.id);
    localStorage.setItem(ACTIVE_USER_TYPE_KEY, 'patient');
    setUser(newUser);
    setIsLoading(false);

    return { success: true };
  };

  // Register as Hospital — strictly stores only submitted fields
  const registerHospital = async (
    input: HospitalRegistrationInput
  ): Promise<{ success: boolean; message?: string; hospitalId?: string }> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));

    const cleanEmail = input.email.trim().toLowerCase();
    const cleanLicense = input.licenseNumber.trim().toUpperCase();
    const cleanHospitalName = input.hospitalName.trim();
    const cleanContactPerson = input.contactPersonName.trim();
    const cleanAddress = input.address.trim();
    const cleanPhone = input.phone.trim();

    const allHospitals = loadHospitalsFromStorage();

    const existing = Object.values(allHospitals).find(
      h => h.email.toLowerCase() === cleanEmail || h.licenseNumber.toUpperCase() === cleanLicense
    );

    if (existing) {
      setIsLoading(false);
      return {
        success: false,
        message: 'A hospital account with this email address or medical license number already exists.',
      };
    }

    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `HOSP-${currentYear}-${randomSuffix}`;
    const formattedDate = new Date().toISOString().split('T')[0];

    const newHospital: HospitalAccount = {
      id: generatedId,
      role: 'hospital',
      hospitalName: cleanHospitalName,
      licenseNumber: cleanLicense,
      address: cleanAddress,
      contactPersonName: cleanContactPerson,
      email: cleanEmail,
      phone: cleanPhone,
      password: input.password || '',
      verified: false,
      status: 'pending',
      registeredAt: formattedDate,
      patientsAccessed: [],
      scanLogs: [],
    };

    allHospitals[newHospital.id] = newHospital;
    saveHospitalsToStorage(allHospitals);

    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, newHospital.id);
    localStorage.setItem(ACTIVE_USER_TYPE_KEY, 'hospital');

    const sessionUser = hospitalToUserPatientData(newHospital);
    setUser(sessionUser);
    setIsLoading(false);

    return { success: true, hospitalId: generatedId };
  };

  // Unified Login
  const login = async (
    identifier: string,
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPhone = cleanIdentifier.replace(/[\s-+]/g, '');

    // 1. Check hospital collection
    const allHospitals = loadHospitalsFromStorage();
    const matchedHospital = Object.values(allHospitals).find(
      h =>
        h.email.toLowerCase() === cleanIdentifier ||
        h.id.toLowerCase() === cleanIdentifier ||
        h.licenseNumber.toLowerCase() === cleanIdentifier ||
        h.phone.replace(/[\s-+]/g, '') === cleanPhone
    );

    if (matchedHospital) {
      if (matchedHospital.password && password && matchedHospital.password !== password) {
        setIsLoading(false);
        return { success: false, message: 'Incorrect password. Please try again.' };
      }

      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, matchedHospital.id);
      localStorage.setItem(ACTIVE_USER_TYPE_KEY, 'hospital');
      setUser(hospitalToUserPatientData(matchedHospital));
      setIsLoading(false);
      return { success: true };
    }

    // 2. Check patient collection
    const allPatients = loadPatientsFromStorage();
    const matchedPatient = Object.values(allPatients).find(
      u =>
        u.email.toLowerCase() === cleanIdentifier ||
        u.id.toLowerCase() === cleanIdentifier ||
        u.phone.replace(/[\s-+]/g, '') === cleanPhone
    );

    if (matchedPatient) {
      if (matchedPatient.password && password && matchedPatient.password !== password) {
        setIsLoading(false);
        return { success: false, message: 'Incorrect password. Please try again.' };
      }

      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, matchedPatient.id);
      localStorage.setItem(ACTIVE_USER_TYPE_KEY, 'patient');
      setUser(matchedPatient);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      message: 'No registered user or hospital found with these credentials. Please check your details or create an account.',
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_USER_TYPE_KEY);
  };

  const updateProfile = (updatedFields: Partial<UserPatientData>) => {
    if (!user) return;

    if (user.role === 'hospital') {
      const allHospitals = loadHospitalsFromStorage();
      const hospital = allHospitals[user.id];
      if (hospital) {
        const updatedHospital: HospitalAccount = {
          ...hospital,
          hospitalName: updatedFields.hospitalName || hospital.hospitalName,
          contactPersonName: updatedFields.name || hospital.contactPersonName,
          department: updatedFields.department || hospital.department,
          licenseNumber: updatedFields.licenseNumber || hospital.licenseNumber,
          phone: updatedFields.phone || hospital.phone,
          email: updatedFields.email || hospital.email,
          address: updatedFields.address || hospital.address,
        };
        allHospitals[user.id] = updatedHospital;
        saveHospitalsToStorage(allHospitals);
        setUser(hospitalToUserPatientData(updatedHospital));
      }
      return;
    }

    // Patient profile update
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newActivityLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: 'profile_updated',
      title: 'Profile Vitals Updated',
      subtitle: 'Changes synced to 3-tier pass',
      date: formattedDate,
      color: 'var(--color-navy)',
    };

    const updatedUser: UserPatientData = {
      ...user,
      ...updatedFields,
      activityLogs: [newActivityLog, ...(user.activityLogs || [])],
    };

    const allPatients = loadPatientsFromStorage();
    allPatients[updatedUser.id] = updatedUser;
    savePatientsToStorage(allPatients);
    setUser(updatedUser);
  };

  const addRecord = (recordData: Omit<MedicalRecord, 'id'>): MedicalRecord => {
    if (!user) throw new Error('Cannot add record without active user');

    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newRecordId = `REC-${String(user.records.length + 1).padStart(3, '0')}`;
    const newRecord: MedicalRecord = {
      id: newRecordId,
      ...recordData,
    };

    const newActivityLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: 'record_added',
      title: `New ${recordData.type.charAt(0).toUpperCase() + recordData.type.slice(1)} Added: ${recordData.title}`,
      subtitle: `Recorded for ${recordData.doctor || 'Self-Uploaded'}`,
      date: formattedDate,
      color: 'var(--color-info)',
    };

    const updatedUser: UserPatientData = {
      ...user,
      records: [newRecord, ...user.records],
      activityLogs: [newActivityLog, ...user.activityLogs],
    };

    const allPatients = loadPatientsFromStorage();
    allPatients[updatedUser.id] = updatedUser;
    savePatientsToStorage(allPatients);
    setUser(updatedUser);

    return newRecord;
  };

  const deleteRecord = (recordId: string) => {
    if (!user) return;

    const updatedRecords = user.records.filter(r => r.id !== recordId);
    const updatedUser: UserPatientData = {
      ...user,
      records: updatedRecords,
    };

    const allPatients = loadPatientsFromStorage();
    allPatients[updatedUser.id] = updatedUser;
    savePatientsToStorage(allPatients);
    setUser(updatedUser);
  };

  const getPatientById = (patientId: string): UserPatientData | null => {
    const allPatients = loadPatientsFromStorage();
    return allPatients[patientId] || null;
  };

  const getAllPatients = (): UserPatientData[] => {
    const allPatients = loadPatientsFromStorage();
    return Object.values(allPatients);
  };

  const getAllHospitalAccounts = (): HospitalAccount[] => {
    const allHospitals = loadHospitalsFromStorage();
    return Object.values(allHospitals);
  };

  const verifyHospitalAccount = (
    hospitalId: string,
    verified: boolean,
    status: HospitalVerificationStatus
  ) => {
    const allHospitals = loadHospitalsFromStorage();
    const hospital = allHospitals[hospitalId];
    if (!hospital) return;

    const formattedDate = new Date().toISOString().split('T')[0];
    const updatedHospital: HospitalAccount = {
      ...hospital,
      verified,
      status,
      verifiedAt: verified ? formattedDate : undefined,
    };

    allHospitals[hospitalId] = updatedHospital;
    saveHospitalsToStorage(allHospitals);

    if (user?.id === hospitalId) {
      setUser(hospitalToUserPatientData(updatedHospital));
    }
  };

  const recordHospitalScan = (patientId: string, tier: 1 | 2 | 3, reason?: string) => {
    if (!user || user.role !== 'hospital') return;

    const allPatients = loadPatientsFromStorage();
    const patient = allPatients[patientId];
    if (!patient) return;

    setActiveScannedPatientId(patientId);

    const now = new Date();
    const formattedTimestamp = now.toISOString().replace('T', ' ').slice(0, 16);
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const accessRecord: HospitalAccessRecord = {
      id: `acc-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      accessTier: tier,
      timestamp: formattedTimestamp,
      hospitalId: user.hospitalId || user.id,
      hospitalName: user.hospitalName || user.name,
      department: user.department || 'Clinical Evaluation',
      reason: reason || (tier === 2 ? 'Issuing Hospital Direct Decryption' : tier === 1 ? 'OTP-Approved Emergency Access' : 'Third-Party Emergency Triage'),
      notes: tier === 2
        ? 'Direct cryptographic signature match — full clinical records decrypted.'
        : tier === 1
          ? 'Patient one-time authorization code approved — records unlocked.'
          : 'Public safety parameters and emergency contacts evaluated.',
      bloodGroup: patient.blood || 'N/A',
      allergies: patient.allergies || [],
      recordsCount: tier === 3 ? 0 : (patient.records?.length || 0),
    };

    const allHospitals = loadHospitalsFromStorage();
    const hospital = allHospitals[user.id];

    if (hospital) {
      const prevPatientsAccessed = hospital.patientsAccessed || [];
      const filteredPatients = prevPatientsAccessed.filter(p => p.patientId !== patient.id);
      const updatedPatientsAccessed = [accessRecord, ...filteredPatients];

      const prevScanLogs = hospital.scanLogs || [];
      const updatedScanLogs = [accessRecord, ...prevScanLogs];

      const updatedHospital: HospitalAccount = {
        ...hospital,
        patientsAccessed: updatedPatientsAccessed,
        scanLogs: updatedScanLogs,
      };

      allHospitals[hospital.id] = updatedHospital;
      saveHospitalsToStorage(allHospitals);
      setUser(hospitalToUserPatientData(updatedHospital));
    }

    // Also record activity on patient record
    const patientActivityLog: ActivityLogItem = {
      id: `act-scan-${Date.now()}`,
      type: 'tier_scan',
      title: `Tier ${tier} Scanned by ${user.hospitalName || user.name}`,
      subtitle: `${user.department || 'Clinical Staff'} • ${reason || 'Hardware QR Scan'}`,
      date: formattedDate,
      color: tier === 2 ? 'var(--color-teal)' : tier === 1 ? 'var(--color-navy)' : 'var(--color-warning)',
    };

    const updatedPatientUser: UserPatientData = {
      ...patient,
      activityLogs: [patientActivityLog, ...(patient.activityLogs || [])],
    };

    allPatients[updatedPatientUser.id] = updatedPatientUser;
    savePatientsToStorage(allPatients);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        activeScannedPatientId,
        setActiveScannedPatientId,
        login,
        register,
        registerHospital,
        logout,
        updateProfile,
        addRecord,
        deleteRecord,
        getPatientById,
        getAllPatients,
        getAllHospitalAccounts,
        verifyHospitalAccount,
        recordHospitalScan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
