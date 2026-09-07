import React from 'react';
import { MapView } from '../../components/features/MapView';
import { mockMapPins } from '../../data/mockMapPins';
import { ShieldCheck, MapPin, Navigation } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const SupportMap: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)' }}>
            Healthcare Support & Facility Locator
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Find nearby verified hospitals, 24/7 pharmacies, blood banks, diagnostic labs, and emergency dispatchers
          </p>
        </div>

        <Badge variant="teal" size="md" icon={<MapPin size={14} />}>
          GPS Location Synced: New Delhi Central
        </Badge>
      </div>

      {/* Map Component */}
      <MapView pins={mockMapPins} />
    </div>
  );
};
