import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Image as ImageIcon,
  Stethoscope,
  Syringe,
  Calendar,
  User,
  Building,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Trash2,
} from 'lucide-react';
import { MedicalRecord, RecordType } from '../../types/patient';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RecordCardProps {
  record: MedicalRecord;
  onViewDetails?: (record: MedicalRecord) => void;
  onDelete?: (recordId: string) => void;
}

const typeConfig: Record<
  RecordType,
  { label: string; icon: React.ReactNode; badgeVariant: 'info' | 'teal' | 'navy' | 'warning' | 'neutral' }
> = {
  prescription: { label: 'Prescription', icon: <FileText size={18} />, badgeVariant: 'teal' },
  lab: { label: 'Lab Report', icon: <Activity size={18} />, badgeVariant: 'info' },
  imaging: { label: 'Diagnostic Imaging', icon: <ImageIcon size={18} />, badgeVariant: 'navy' },
  consultation: { label: 'Consultation Note', icon: <Stethoscope size={18} />, badgeVariant: 'warning' },
  vaccine: { label: 'Vaccination Record', icon: <Syringe size={18} />, badgeVariant: 'neutral' },
};

export const RecordCard: React.FC<RecordCardProps> = ({ record, onViewDetails, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = typeConfig[record.type] || typeConfig.prescription;

  return (
    <Card padding="none" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-navy)',
              }}
            >
              {cfg.icon}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>
                  {record.title}
                </h4>
                <Badge variant={cfg.badgeVariant} size="sm">
                  {cfg.label}
                </Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px', fontSize: '13px', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={14} color="var(--color-text-muted)" />
                  {record.doctor || 'Self-Uploaded'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building size={14} color="var(--color-text-muted)" />
                  {record.hospital || 'Patient Vault'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            <Calendar size={14} />
            <span>{record.date}</span>
          </div>
        </div>

        {/* Summary */}
        {record.summary && (
          <div
            style={{
              marginTop: '14px',
              padding: '10px 14px',
              background: 'var(--color-surface-alt)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--color-teal)',
              fontSize: '13.5px',
              color: 'var(--color-text-primary)',
            }}
          >
            {record.summary}
          </div>
        )}

        {/* Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
          {record.tags && record.tags.length > 0 ? (
            record.tags.map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 500,
                }}
              >
                #{tag}
              </span>
            ))
          ) : null}
          {record.fileSize && (
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
              Size: {record.fileSize}
            </span>
          )}
        </div>

        {/* Expandable Section */}
        {expanded && (
          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-border)',
              animation: 'fadeIn var(--transition-fast)',
            }}
          >
            <h5 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '6px' }}>
              Full Clinical Notes & Observations:
            </h5>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: 1.6, background: '#FAFAFA', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              {record.details || 'No additional detailed notes recorded.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div
        style={{
          padding: '10px 20px',
          background: 'var(--color-surface-alt)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          iconRight={expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        >
          {expanded ? 'Hide Details' : 'View Clinical Notes'}
        </Button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {onViewDetails && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Eye size={14} />}
              onClick={() => onViewDetails(record)}
            >
              Preview
            </Button>
          )}
          <Button
            variant="teal"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => alert(`Downloading verified record: ${record.title}.pdf`)}
          >
            Download PDF
          </Button>
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm(`Delete record "${record.title}"?`)) {
                  onDelete(record.id);
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Delete Record"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
