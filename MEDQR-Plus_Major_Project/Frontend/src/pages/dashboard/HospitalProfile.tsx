import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  FileBadge,
  Key,
  Lock,
  Building,
  User,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const HospitalProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [hospitalName, setHospitalName] = useState('');
  const [attendingDoctor, setAttendingDoctor] = useState('');
  const [department, setDepartment] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setHospitalName(user.hospitalName || user.name || '');
      setAttendingDoctor(user.contactPersonName || user.name || '');
      setDepartment(user.department || '');
      setLicenseNumber(user.licenseNumber || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    updateProfile({
      hospitalName,
      name: attendingDoctor,
      department,
      licenseNumber,
      phone,
      email,
      address,
    });

    setTimeout(() => {
      setLoading(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  const isVerified = user?.verified;

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)' }}>
              Hospital Facility Profile
            </h2>
            <Badge variant={isVerified ? 'teal' : 'warning'} size="sm" icon={<Building2 size={12} />}>
              {isVerified ? 'Verified Clinical Provider' : 'Pending Verification'}
            </Badge>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Manage clinical provider metadata, medical licensing credentials, and hardware signature keys.
          </p>
        </div>

        {savedSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-teal-dim)', fontWeight: 600, background: 'var(--color-teal-bg)', padding: '6px 14px', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={16} /> Facility profile updated!
          </div>
        )}
      </div>

      {/* Security Credentials Banner */}
      <Card
        padding="md"
        style={{
          background: 'linear-gradient(135deg, #0D1B3E 0%, #1F3A6E 100%)',
          color: '#FFFFFF',
          border: '1.5px solid var(--color-teal)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-teal)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                Cryptographic Facility ID: {user?.hospitalId || user?.id}
              </div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>
                {isVerified
                  ? 'Authorized for Direct Tier 2 Decryption when scanning patient passes issued by your facility.'
                  : 'Pending administrative verification on state medical registry.'}
              </div>
            </div>
          </div>
          <Badge variant="teal" size="md" icon={<ShieldCheck size={14} />}>
            Hardware HSM 256-Bit Ready
          </Badge>
        </div>
      </Card>

      {/* Form */}
      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Facility Info Card */}
          <Card padding="lg">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} color="var(--color-teal)" /> Facility &amp; Clinical Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                  Hospital / Facility Name
                </label>
                <input
                  type="text"
                  required
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  placeholder="Hospital name"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'var(--color-surface)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                  Attending Clinician / Officer
                </label>
                <input
                  type="text"
                  required
                  value={attendingDoctor}
                  onChange={e => setAttendingDoctor(e.target.value)}
                  placeholder="Doctor / Officer Name"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'var(--color-surface)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                  Clinical Department / Ward
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Emergency & Cardiology"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'var(--color-surface)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                  Medical Operating License
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  placeholder="Medical License No."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'var(--color-surface)',
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Contact & Location */}
          <Card padding="lg">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} color="var(--color-teal)" /> Official Contact &amp; Dispatch Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                  Official Contact Phone / Helpline
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Official phone number"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'var(--color-surface)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                  Clinical Dispatch Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Official email address"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'var(--color-surface)',
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                  Hospital Physical Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Hospital physical location"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'var(--color-surface)',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button
              type="submit"
              variant="teal"
              size="lg"
              loading={loading}
              icon={<Save size={18} />}
            >
              Save Facility Credentials
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
