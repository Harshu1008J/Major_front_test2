import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  ClipboardList,
  Search,
  X,
  CheckCircle2,
  Calendar,
  Stethoscope,
  Building2,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MedicalRecord, RecordType } from '../../types/patient';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { RecordCard } from '../../components/features/RecordCard';

// ─── Type/colour maps ──────────────────────────────────────────────────────
const RECORD_TYPES: { value: RecordType; label: string }[] = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'lab', label: 'Lab Report' },
  { value: 'imaging', label: 'Imaging / Radiology' },
  { value: 'consultation', label: 'Consultation Note' },
  { value: 'vaccine', label: 'Vaccination' },
];

const TYPE_BADGE: Record<RecordType, { variant: 'teal' | 'navy' | 'info' | 'warning' | 'brick'; label: string }> = {
  prescription: { variant: 'teal', label: 'Prescription' },
  lab: { variant: 'info', label: 'Lab Report' },
  imaging: { variant: 'navy', label: 'Imaging' },
  consultation: { variant: 'warning', label: 'Consultation' },
  vaccine: { variant: 'brick', label: 'Vaccination' },
};

// ─── Empty State ────────────────────────────────────────────────────────────
const EmptyState: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '72px 24px',
      textAlign: 'center',
      background: 'var(--color-surface-alt)',
      borderRadius: 'var(--radius-xl)',
      border: '2px dashed var(--color-border)',
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: 'var(--color-teal-bg)',
        color: 'var(--color-teal)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
      }}
    >
      <ClipboardList size={34} />
    </div>
    <h3
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '20px',
        fontWeight: 800,
        color: 'var(--color-navy)',
      }}
    >
      No Medical Records Yet
    </h3>
    <p
      style={{
        fontSize: '14px',
        color: 'var(--color-text-secondary)',
        marginTop: '8px',
        lineHeight: 1.6,
        maxWidth: '420px',
      }}
    >
      Your encrypted health vault is empty. Tap{' '}
      <strong>+ Add Record</strong> to upload your first prescription,
      lab result, imaging report, or consultation note.
    </p>
    <div style={{ marginTop: '24px' }}>
      <Button variant="teal" size="lg" icon={<Plus size={18} />} onClick={onAdd}>
        Add Your First Record
      </Button>
    </div>
  </div>
);

// ─── Add Record Form ────────────────────────────────────────────────────────
interface AddRecordFormState {
  type: RecordType;
  title: string;
  date: string;
  doctor: string;
  hospital: string;
  summary: string;
  tags: string;
}

const EMPTY_FORM: AddRecordFormState = {
  type: 'prescription',
  title: '',
  date: '',
  doctor: '',
  hospital: '',
  summary: '',
  tags: '',
};

// ─── Main Component ──────────────────────────────────────────────────────────
export const MedicalRecords: React.FC = () => {
  const { user, addRecord, deleteRecord } = useAuth();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteConfirmId, setIsDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<AddRecordFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<RecordType | ''>('');

  const records = user?.records || [];

  // ── Filter / Search ──────────────────────────────────────────────────────
  const filtered = records.filter(r => {
    const matchesType = !filterType || r.type === filterType;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.doctor.toLowerCase().includes(q) ||
      r.hospital.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setAddSuccess(false);
    setIsAddOpen(true);
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    setFormError(null);
  };

  const handleFieldChange = <K extends keyof AddRecordFormState>(
    key: K,
    val: AddRecordFormState[K]
  ) => setForm(prev => ({ ...prev, [key]: val }));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Record title is required.');
      return;
    }
    if (!form.date) {
      setFormError('Date is required.');
      return;
    }
    setFormError(null);

    const tags = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addRecord({
      type: form.type,
      title: form.title.trim(),
      date: form.date,
      doctor: form.doctor.trim(),
      hospital: form.hospital.trim(),
      summary: form.summary.trim(),
      details: form.summary.trim(),
      tags,
    });

    setAddSuccess(true);
    setTimeout(() => {
      setIsAddOpen(false);
      setAddSuccess(false);
      setForm(EMPTY_FORM);
    }, 900);
  };

  const handleDeleteConfirm = () => {
    if (isDeleteConfirmId) {
      deleteRecord(isDeleteConfirmId);
      setIsDeleteConfirmId(null);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    fontSize: '14px',
    outline: 'none',
    background: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    marginBottom: '6px',
  };

  return (
    <div
      style={{
        padding: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--color-navy)',
            }}
          >
            My Medical Records Vault
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {records.length === 0
              ? 'Your encrypted health vault is empty'
              : `${records.length} record${records.length !== 1 ? 's' : ''} stored in your encrypted vault`}
          </p>
        </div>

        <Button variant="teal" size="md" icon={<Plus size={16} />} onClick={handleOpenAdd}>
          Add Record
        </Button>
      </div>

      {/* ── Search + Filter (only when records exist) ──────────────────── */}
      {records.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search
              size={15}
              color="var(--color-text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, doctor, hospital, tag…"
              style={{
                ...inputStyle,
                paddingLeft: '36px',
                paddingRight: searchQuery ? '36px' : '14px',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as RecordType | '')}
            style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}
          >
            <option value="">All Types</option>
            {RECORD_TYPES.map(rt => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>

          {/* Clear filters */}
          {(searchQuery || filterType) && (
            <button
              onClick={() => { setSearchQuery(''); setFilterType(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--color-brick)', fontWeight: 600, padding: '0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Record Count Summary (when filters active) ──────────────────── */}
      {records.length > 0 && (searchQuery || filterType) && (
        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Showing <strong>{filtered.length}</strong> of <strong>{records.length}</strong> records
          {filterType && <> · Type: <strong>{RECORD_TYPES.find(r => r.value === filterType)?.label}</strong></>}
          {searchQuery && <> · Search: <strong>"{searchQuery}"</strong></>}
        </div>
      )}

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      {records.length === 0 ? (
        <EmptyState onAdd={handleOpenAdd} />
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-xl)',
            border: '2px dashed var(--color-border)',
          }}
        >
          <Search size={28} color="var(--color-text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>No records match your search</div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
            Try different keywords or clear your filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(record => (
            <div key={record.id} style={{ position: 'relative' }}>
              <RecordCard record={record} />
              {/* Delete button overlay */}
              <button
                onClick={() => setIsDeleteConfirmId(record.id)}
                title="Delete record"
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'var(--color-brick-bg)',
                  border: '1px solid #FBCFE8',
                  borderRadius: 'var(--radius-sm)',
                  padding: '5px 8px',
                  cursor: 'pointer',
                  color: 'var(--color-brick)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 150ms ease',
                }}
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Type Summary Pills (bottom stats) ─────────────────────────────── */}
      {records.length > 0 && (
        <Card padding="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>Records by Type</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {RECORD_TYPES.map(rt => {
              const count = records.filter(r => r.type === rt.value).length;
              if (count === 0) return null;
              const { variant } = TYPE_BADGE[rt.value];
              return (
                <Badge key={rt.value} variant={variant} size="sm">
                  {rt.label}: {count}
                </Badge>
              );
            })}
          </div>
        </Card>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          ADD RECORD MODAL
      ════════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={isAddOpen}
        onClose={handleCloseAdd}
        title="Add Medical Record"
        size="md"
      >
        {addSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={48} color="var(--color-teal)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>Record Added Successfully</h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>Your record has been saved to your encrypted vault.</p>
          </div>
        ) : (
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', fontSize: '13px', color: '#991B1B' }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {formError}
              </div>
            )}

            {/* Record Type */}
            <div>
              <label style={labelStyle}>
                Record Type <span style={{ color: 'var(--color-brick)' }}>*</span>
              </label>
              <select
                value={form.type}
                onChange={e => handleFieldChange('type', e.target.value as RecordType)}
                style={inputStyle}
              >
                {RECORD_TYPES.map(rt => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label style={labelStyle}>
                Record Title <span style={{ color: 'var(--color-brick)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <FileText size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. Complete Blood Count, Hypertension Management"
                  style={{ ...inputStyle, paddingLeft: '36px' }}
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label style={labelStyle}>
                Date <span style={{ color: 'var(--color-brick)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={e => handleFieldChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  style={{ ...inputStyle, paddingLeft: '36px' }}
                />
              </div>
            </div>

            {/* Doctor & Hospital */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Doctor / Clinician</label>
                <div style={{ position: 'relative' }}>
                  <Stethoscope size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={form.doctor}
                    onChange={e => handleFieldChange('doctor', e.target.value)}
                    placeholder="e.g. Dr. Rakesh Mehta"
                    style={{ ...inputStyle, paddingLeft: '36px' }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Hospital / Lab</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={form.hospital}
                    onChange={e => handleFieldChange('hospital', e.target.value)}
                    placeholder="e.g. Apollo Hospitals"
                    style={{ ...inputStyle, paddingLeft: '36px' }}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <label style={labelStyle}>Summary / Notes</label>
              <textarea
                value={form.summary}
                onChange={e => handleFieldChange('summary', e.target.value)}
                placeholder="Brief summary of findings, prescriptions, or recommendations…"
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              />
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Tag size={13} /> Tags (comma-separated)
                </span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={e => handleFieldChange('tags', e.target.value)}
                placeholder="e.g. Cardiology, Hypertension, Blood Test"
                style={inputStyle}
              />
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                Tags help you filter and search records quickly.
              </span>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
              <Button variant="ghost" size="md" type="button" onClick={handleCloseAdd}>
                Cancel
              </Button>
              <Button variant="teal" size="md" type="submit" icon={<Plus size={16} />}>
                Save Record
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ════════════════════════════════════════════════════════════════════
          DELETE CONFIRM MODAL
      ════════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={!!isDeleteConfirmId}
        onClose={() => setIsDeleteConfirmId(null)}
        title="Remove Record"
        size="sm"
      >
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-brick-bg)', color: 'var(--color-brick)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Trash2 size={24} />
          </div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>
            Remove this record?
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
            This will permanently delete the record from your health vault. This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '24px' }}>
            <Button variant="ghost" size="md" onClick={() => setIsDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="brick" size="md" icon={<Trash2 size={15} />} onClick={handleDeleteConfirm}>
              Yes, Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};