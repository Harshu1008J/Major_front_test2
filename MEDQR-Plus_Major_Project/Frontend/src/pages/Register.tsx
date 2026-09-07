import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  FileBadge,
  MapPin,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'hospital'>('patient');

  // Patient Fields
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPassword, setPatientPassword] = useState('');

  // Hospital Fields
  const [hospitalName, setHospitalName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [hospitalEmail, setHospitalEmail] = useState('');
  const [hospitalPhone, setHospitalPhone] = useState('');
  const [hospitalPassword, setHospitalPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, registerHospital } = useAuth();
  const navigate = useNavigate();

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!patientName.trim() || !patientPhone.trim() || !patientEmail.trim() || !patientPassword.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(patientName, patientPhone, patientEmail, patientPassword);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(result.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      !hospitalName.trim() ||
      !licenseNumber.trim() ||
      !address.trim() ||
      !contactPersonName.trim() ||
      !hospitalEmail.trim() ||
      !hospitalPhone.trim() ||
      !hospitalPassword.trim()
    ) {
      setErrorMessage('Please complete all hospital registration fields.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerHospital({
        hospitalName,
        licenseNumber,
        address,
        contactPersonName,
        email: hospitalEmail,
        phone: hospitalPhone,
        password: hospitalPassword,
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(result.message || 'Hospital registration failed. Please check your details.');
      }
    } catch (err: any) {
      setErrorMessage('An error occurred during hospital registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #162447 0%, #0D1B3E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ maxWidth: '520px', width: '100%' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-lg)',
              background: activeTab === 'hospital' ? 'var(--color-navy-light)' : 'var(--color-teal)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              boxShadow: 'var(--shadow-md)',
              border: activeTab === 'hospital' ? '1.5px solid var(--color-teal-light)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            {activeTab === 'hospital' ? <Building2 size={26} color="#FFFFFF" /> : <Shield size={28} color="#FFFFFF" />}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#FFFFFF' }}>
            MedQR<span style={{ color: 'var(--color-teal-light)' }}>+</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
            {activeTab === 'patient'
              ? 'Instant patient registration • Initialize your encrypted 3-tier pass'
              : 'Medical provider portal onboarding • Register your healthcare facility'}
          </p>
        </div>

        {/* Card */}
        <Card padding="lg" style={{ background: '#FFFFFF', boxShadow: 'var(--shadow-xl)' }}>
          {/* Top Role Selector Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              background: 'var(--color-bg)',
              padding: '4px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '20px',
            }}
          >
            <button
              type="button"
              onClick={() => { setActiveTab('patient'); setErrorMessage(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13.5px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'patient' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'patient' ? 'var(--color-navy)' : 'var(--color-text-muted)',
                boxShadow: activeTab === 'patient' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              <User size={16} color={activeTab === 'patient' ? 'var(--color-teal)' : 'currentColor'} />
              <span>Sign up as Patient</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('hospital'); setErrorMessage(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13.5px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'hospital' ? 'var(--color-navy)' : 'transparent',
                color: activeTab === 'hospital' ? '#FFFFFF' : 'var(--color-text-muted)',
                boxShadow: activeTab === 'hospital' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              <Building2 size={16} color={activeTab === 'hospital' ? 'var(--color-teal-light)' : 'currentColor'} />
              <span>Register as Hospital</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {activeTab === 'patient' ? 'Create Patient Pass' : 'Hospital Registration Application'}
            </span>
            <Badge variant={activeTab === 'hospital' ? 'navy' : 'teal'} size="sm" icon={<ShieldCheck size={12} />}>
              {activeTab === 'patient' ? 'Instant Activation' : 'Verification Required'}
            </Badge>
          </div>

          {errorMessage && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* PATIENT REGISTRATION FORM */}
          {/* ======================================================== */}
          {activeTab === 'patient' ? (
            <form onSubmit={handlePatientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Full Legal Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    placeholder="Enter full legal name"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'var(--color-surface)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Mobile Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'var(--color-surface)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={e => setPatientEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'var(--color-surface)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={patientPassword}
                    onChange={e => setPatientPassword(e.target.value)}
                    placeholder="Create a strong password"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'var(--color-surface)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="teal"
                size="lg"
                fullWidth
                loading={loading}
                iconRight={<ArrowRight size={16} />}
                style={{ marginTop: '8px' }}
              >
                Generate My MedQR+ Pass
              </Button>
            </form>
          ) : (
            /* ======================================================== */
            /* HOSPITAL REGISTRATION FORM */
            /* ======================================================== */
            <form onSubmit={handleHospitalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Hospital / Clinic Name
                </label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={e => setHospitalName(e.target.value)}
                    placeholder="e.g. Metro City Multispecialty Hospital"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'var(--color-surface)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Registration / Medical License Number
                </label>
                <div style={{ position: 'relative' }}>
                  <FileBadge size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={e => setLicenseNumber(e.target.value)}
                    placeholder="e.g. DL-MED-HOSP-2024-9988"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'var(--color-surface)',
                      textTransform: 'uppercase',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Registered Hospital Physical Address
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street, City, State, PIN Code"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                    Contact Person Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      value={contactPersonName}
                      onChange={e => setContactPersonName(e.target.value)}
                      placeholder="Dr. / Director Name"
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'var(--color-surface)',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                    Contact Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      required
                      value={hospitalPhone}
                      onChange={e => setHospitalPhone(e.target.value)}
                      placeholder="+91 11 2000 3000"
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'var(--color-surface)',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Official Contact / Dispatch Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    value={hospitalEmail}
                    onChange={e => setHospitalEmail(e.target.value)}
                    placeholder="clinical.dispatch@hospital.medqr"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'var(--color-surface)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Account Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={hospitalPassword}
                    onChange={e => setHospitalPassword(e.target.value)}
                    placeholder="Create secure hospital portal password"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'var(--color-surface)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Verification Info Box */}
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: '#FEFCE8',
                  border: '1px solid #FEF08A',
                  fontSize: '12px',
                  color: '#854D0E',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  lineHeight: 1.5,
                }}
              >
                <Clock size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Verification Notice:</strong> New hospital registrations start with <code>verified: false</code>. An administrator will review your medical license before issuing cryptographic Tier 2 scanning keys.
                </span>
              </div>

              <Button
                type="submit"
                variant="navy"
                size="lg"
                fullWidth
                loading={loading}
                iconRight={<ArrowRight size={16} />}
                style={{ marginTop: '4px' }}
              >
                Submit Hospital Application
              </Button>
            </form>
          )}

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--color-teal)', fontWeight: 700 }}>
              Sign in here
            </Link>
          </div>
        </Card>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            ← Return to MedQR+ Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
