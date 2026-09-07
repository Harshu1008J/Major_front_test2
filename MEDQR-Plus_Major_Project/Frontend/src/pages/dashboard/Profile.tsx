import React, { useState, useEffect } from 'react';
import {
  User,
  Heart,
  AlertTriangle,
  Phone,
  Building,
  Save,
  CheckCircle2,
  ShieldCheck,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Pill,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { HospitalProfile } from './HospitalProfile';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();

  if (user?.role === 'hospital') {
    return <HospitalProfile />;
  }

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [blood, setBlood] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');
  const [medicationsText, setMedicationsText] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [hospitalName, setHospitalName] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setDob(user.dob || '');
      setGender(user.gender || '');
      setBlood(user.blood || '');
      setHeight(user.height || '');
      setWeight(user.weight || '');
      setAddress(user.address || '');
      setAllergiesText(user.allergies ? user.allergies.join(', ') : '');
      setConditionsText(user.chronicConditions ? user.chronicConditions.join(', ') : '');
      setMedicationsText(user.currentMedications ? user.currentMedications.join(', ') : '');
      setEmergencyName(user.emergency?.name || '');
      setEmergencyRelation(user.emergency?.relation || '');
      setEmergencyPhone(user.emergency?.phone || '');
      setHospitalName(user.issuingHospitalName || '');
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const allergies = allergiesText.split(',').map(s => s.trim()).filter(Boolean);
    const chronicConditions = conditionsText.split(',').map(s => s.trim()).filter(Boolean);
    const currentMedications = medicationsText.split(',').map(s => s.trim()).filter(Boolean);

    updateProfile({
      name,
      dob,
      gender,
      blood,
      height,
      weight,
      address,
      allergies,
      chronicConditions,
      currentMedications,
      issuingHospitalName: hospitalName || 'Self-Managed Pass',
      emergency: {
        name: emergencyName,
        relation: emergencyRelation,
        phone: emergencyPhone,
      },
    });

    setTimeout(() => {
      setLoading(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)' }}>
            Patient Profile & Health Vitals
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Manage the information visible across the MedQR+ 3-tier access system
          </p>
        </div>

        <Badge variant="teal" size="md" icon={<ShieldCheck size={14} />}>
          ID: {user?.id || 'MQR-PASS'}
        </Badge>
      </div>

      {savedSuccess && (
        <div
          style={{
            padding: '14px 18px',
            background: 'var(--color-teal-bg)',
            border: '1px solid var(--color-teal)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-teal-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} /> Profile vitals and emergency contact updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Basic Information */}
        <Card padding="lg">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--color-teal)" /> Basic Patient Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Full Legal Name <span style={{ color: 'var(--color-brick)' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. John Doe"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Patient Identifier (Auto-generated)
              </label>
              <input
                type="text"
                disabled
                value={user?.id || ''}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', background: '#F8FAFC',
                  color: 'var(--color-text-muted)', fontFamily: 'monospace',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Gender
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Mobile Number
              </label>
              <input
                type="tel"
                value={user?.phone || ''}
                disabled
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', background: '#F8FAFC',
                  color: 'var(--color-text-muted)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', background: '#F8FAFC',
                  color: 'var(--color-text-muted)',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. 42, Sector 15, New Delhi - 110001"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
            </div>
          </div>
        </Card>

        {/* Emergency & Vital Clinical Parameters */}
        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={18} color="var(--color-brick)" /> Emergency Vitals (Tier 3 Visible)
            </h3>
            <Badge variant="brick" size="sm">First Responder Tier</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Blood Group
              </label>
              <select
                value={blood}
                onChange={e => setBlood(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)', fontWeight: 700,
                  color: blood ? 'var(--color-brick)' : 'var(--color-text-muted)',
                }}
              >
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Height & Weight
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  placeholder={"e.g. 5'10\""}
                  style={{
                    width: '50%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                    background: 'var(--color-surface)',
                  }}
                />
                <input
                  type="text"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="e.g. 70 kg"
                  style={{
                    width: '50%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                    background: 'var(--color-surface)',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Primary Care / Issuing Hospital
              </label>
              <input
                type="text"
                value={hospitalName}
                onChange={e => setHospitalName(e.target.value)}
                placeholder="e.g. Apollo Hospitals, New Delhi"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Known Allergies (Comma separated)
              </label>
              <input
                type="text"
                value={allergiesText}
                onChange={e => setAllergiesText(e.target.value)}
                placeholder="e.g. Penicillin, Peanuts, Latex, Dust Mites"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                Visible to emergency responders in Tier 3 to prevent adverse drug reactions.
              </span>
            </div>
          </div>
        </Card>

        {/* Chronic Conditions & Current Medications */}
        <Card padding="lg">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--color-info)" /> Chronic Conditions & Active Medications
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Chronic Medical Conditions (Comma separated)
              </label>
              <input
                type="text"
                value={conditionsText}
                onChange={e => setConditionsText(e.target.value)}
                placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Current Daily Medications (Comma separated)
              </label>
              <input
                type="text"
                value={medicationsText}
                onChange={e => setMedicationsText(e.target.value)}
                placeholder="e.g. Metformin 500mg, Amlodipine 5mg"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
            </div>
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card padding="lg">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={18} color="var(--color-teal)" /> Primary Emergency Contact
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Contact Person Name
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={e => setEmergencyName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Relationship to Patient
              </label>
              <input
                type="text"
                value={emergencyRelation}
                onChange={e => setEmergencyRelation(e.target.value)}
                placeholder="e.g. Spouse, Parent, Sibling"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Emergency Phone Number
              </label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
                  background: 'var(--color-surface)',
                }}
              />
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button
            type="submit"
            variant="teal"
            size="lg"
            loading={loading}
            icon={<Save size={18} />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
