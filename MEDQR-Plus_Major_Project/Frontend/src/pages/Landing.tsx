import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  QrCode,
  Lock,
  Bot,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HeartPulse,
  Scan,
  ShieldCheck,
  Building2,
  Users,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 38,
                height: 38,
                background: 'var(--color-navy)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={20} color="var(--color-teal)" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--color-navy)' }}>
              MedQR<span style={{ color: 'var(--color-teal)' }}>+</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="teal" size="sm" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F0F4F8 0%, #FFFFFF 100%)',
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', marginBottom: '20px' }}>
            <Badge variant="teal" size="md" icon={<ShieldCheck size={14} />}>
              Next-Gen Healthcare Identity & Tiered Access
            </Badge>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 54px)',
              fontWeight: 800,
              color: 'var(--color-navy)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
            }}
          >
            Your Complete Health Records, Secured by an Intelligent QR Pass
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '20px auto 36px',
              lineHeight: 1.6,
            }}
          >
            MedQR+ unites your medical history, prescriptions, and emergency vitals in a single patient-controlled QR code with strict three-tier privacy permissions.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="teal"
              size="lg"
              iconRight={<ArrowRight size={18} />}
              onClick={() => navigate('/register')}
            >
              Create Patient Pass
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<Scan size={18} />}
              onClick={() => navigate('/dashboard/scanner')}
            >
              Test QR Scanner
            </Button>
          </div>

          {/* Quick Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              marginTop: '60px',
              padding: '24px',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
                3 Tiers
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Granular Privacy Access Control
              </div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-teal)', fontFamily: 'var(--font-display)' }}>
                100%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Patient-Owned Medical History
              </div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
                &lt; 2 Sec
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Emergency Vital Retrieval Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Badge variant="navy" size="sm">Core Architecture</Badge>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', marginTop: '12px' }}>
            Engineered for Patient Safety and Clinical Speed
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', maxWidth: '540px', margin: '10px auto 0' }}>
            Built specifically to avoid cumbersome logins while ensuring data is never exposed to unauthorized third parties.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Card 1 */}
          <Card padding="lg" hoverable>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-teal-bg)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <QrCode size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
              3-Tier QR Security Model
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '10px', lineHeight: 1.6 }}>
              Issuing hospitals get verified instant access (Tier 2). External doctors require OTP authorization (Tier 1). First responders view vital emergency blood and allergy info only (Tier 3).
            </p>
          </Card>

          {/* Card 2 */}
          <Card padding="lg" hoverable>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-info-bg)', color: 'var(--color-info)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Bot size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
              AI Health Assistant
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '10px', lineHeight: 1.6 }}>
              Instant plain-language clinical explanations, lab result summaries, personalized lifestyle guidance, and intelligent medicine dosage alerts right inside your dashboard.
            </p>
          </Card>

          {/* Card 3 */}
          <Card padding="lg" hoverable>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)' }}>
              Support Map & Facilities
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '10px', lineHeight: 1.6 }}>
              Locate nearby 24/7 emergency rooms, diagnostic centres, blood banks, verified pharmacies, and on-call ambulance dispatchers with live direct navigation.
            </p>
          </Card>
        </div>
      </section>

      {/* How the 3 Tiers Work Section */}
      <section style={{ background: 'var(--color-bg)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 800, color: 'var(--color-navy)' }}>
              How the 3-Tier Access Flow Works
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              No matter who scans your QR badge, your privacy is safeguarded automatically.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '20px', background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-teal-bg)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>
                1
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>Tier 1: OTP Patient Consent</h4>
                  <Badge variant="teal" size="sm">Full Decrypted Access</Badge>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  When visited by a new doctor or specialist, you receive an instant 4-digit OTP. Once approved, the doctor sees your full prescription history and clinical files.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: '20px', background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E2E8F0', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>
                2
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>Tier 2: Issuing Hospital Recognition</h4>
                  <Badge variant="navy" size="sm">Verified Hospital Account</Badge>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Scanners originating from the hospital that issued your MedQR+ badge automatically verify against our cryptographic registry, providing immediate zero-delay clinical access.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '20px', background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FEE2E2', color: '#991B1B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>
                3
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>Tier 3: Public Emergency Responder</h4>
                  <Badge variant="warning" size="sm">Limited Emergency Vitals</Badge>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Any unknown smartphone scanner displays only life-saving vitals: blood group, critical drug allergies, and emergency phone dials. All sensitive histories remain encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section
        style={{
          background: 'var(--color-navy)',
          color: '#FFFFFF',
          padding: '60px 24px',
          textAlign: 'center',
          marginTop: 'auto',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800 }}>
            Ready to Take Control of Your Health Record Security?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', margin: '14px 0 28px' }}>
            Set up your digital patient pass in 30 seconds. No complex paperwork or role hierarchies.
          </p>
          <Button
            variant="teal"
            size="lg"
            onClick={() => navigate('/register')}
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};
