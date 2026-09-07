import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Building2,
  Pill,
  Droplet,
  Truck,
  Microscope,
  Navigation,
  Phone,
  Clock,
  Star,
  ShieldCheck,
  Search,
  ExternalLink,
} from 'lucide-react';
import { MapPin, FacilityType } from '../../data/mockMapPins';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Fix default leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon generator for different healthcare types
const createCustomIcon = (type: FacilityType) => {
  const colorMap: Record<FacilityType, string> = {
    hospital: '#0D1B3E',
    pharmacy: '#2A9D8F',
    blood_bank: '#C0392B',
    ambulance: '#D69E2E',
    diagnostic: '#3182CE',
  };

  const symbolMap: Record<FacilityType, string> = {
    hospital: '🏥',
    pharmacy: '💊',
    blood_bank: '🩸',
    ambulance: '🚑',
    diagnostic: '🔬',
  };

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${colorMap[type]};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <span style="transform: rotate(45deg); font-size: 14px;">${symbolMap[type]}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapViewProps {
  pins: MapPin[];
  selectedType?: string;
}

export const MapView: React.FC<MapViewProps> = ({ pins }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePin, setActivePin] = useState<MapPin | null>(pins[0] || null);

  const categories = [
    { id: 'all', label: 'All Facilities', icon: null },
    { id: 'hospital', label: 'Hospitals', icon: <Building2 size={14} /> },
    { id: 'pharmacy', label: 'Pharmacies', icon: <Pill size={14} /> },
    { id: 'blood_bank', label: 'Blood Banks', icon: <Droplet size={14} /> },
    { id: 'ambulance', label: 'Ambulances', icon: <Truck size={14} /> },
    { id: 'diagnostic', label: 'Diagnostic Labs', icon: <Microscope size={14} /> },
  ];

  const filteredPins = pins.filter(pin => {
    const matchesCategory = selectedCategory === 'all' || pin.type === selectedCategory;
    const matchesSearch =
      pin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleNavigate = (pin: MapPin) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Search & Filter Header */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            flex: '1',
            minWidth: '240px',
          }}
        >
          <Search
            size={16}
            color="var(--color-text-muted)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search hospital, lab, pharmacy, blood bank..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1.5px solid var(--color-teal)' : '1px solid var(--color-border)',
                  background: isSelected ? 'var(--color-teal-bg)' : 'var(--color-surface)',
                  color: isSelected ? 'var(--color-teal-dim)' : 'var(--color-text-secondary)',
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat.icon}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map + Sidebar Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 380px) 1fr',
          gap: '16px',
          height: '620px',
        }}
        className="map-grid-layout"
      >
        {/* Sidebar list */}
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-alt)' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>
              Nearby Facilities ({filteredPins.length})
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Sorted by real-time proximity to your current location
            </div>
          </div>

          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>
            {filteredPins.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                No healthcare facilities found matching your search criteria.
              </div>
            ) : (
              filteredPins.map(pin => {
                const isSelected = activePin?.id === pin.id;
                return (
                  <div
                    key={pin.id}
                    onClick={() => setActivePin(pin)}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '1.5px solid var(--color-teal)' : '1px solid var(--color-border)',
                      background: isSelected ? '#F0F9F8' : 'var(--color-surface)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>
                        {pin.name}
                      </h4>
                      <Badge variant={pin.type === 'hospital' ? 'navy' : pin.type === 'pharmacy' ? 'teal' : 'neutral'} size="sm">
                        {pin.distance}
                      </Badge>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      {pin.address}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D69E2E', fontWeight: 600 }}>
                        <Star size={12} fill="#D69E2E" />
                        {pin.rating}
                      </span>
                      {pin.open24h ? (
                        <span style={{ color: 'var(--color-teal)', fontWeight: 600 }}>Open 24/7</span>
                      ) : (
                        <span>{pin.hours || 'Standard Hours'}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <a
                        href={`tel:${pin.phone}`}
                        onClick={e => e.stopPropagation()}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--color-navy)',
                          textDecoration: 'none',
                        }}
                      >
                        <Phone size={12} /> Call
                      </a>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleNavigate(pin);
                        }}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--color-navy-light)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Navigation size={12} /> Navigate
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Leaflet Map Box */}
        <div
          style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          <MapContainer
            center={[28.6270, 77.2180]}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredPins.map(pin => (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={createCustomIcon(pin.type)}
                eventHandlers={{
                  click: () => setActivePin(pin),
                }}
              >
                <Popup>
                  <div style={{ padding: '4px', minWidth: '180px' }}>
                    <div style={{ fontWeight: 700, color: '#0D1B3E', fontSize: '14px' }}>
                      {pin.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#4A5568', marginTop: '2px' }}>
                      {pin.address}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#2A9D8F', fontWeight: 600 }}>
                      Distance: {pin.distance} • Rating: {pin.rating} ★
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <button
                        onClick={() => handleNavigate(pin)}
                        style={{
                          width: '100%',
                          padding: '6px',
                          background: '#0D1B3E',
                          color: 'white',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        <Navigation size={12} /> Open in Maps
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
