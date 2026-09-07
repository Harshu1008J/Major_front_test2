import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  Building2,
  User,
  Activity,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AIMessage } from '../../data/mockAIResponses';
import { ChatBubble } from '../../components/features/ChatBubble';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { UserPatientData } from '../../types/patient';

export const AIAssistant: React.FC = () => {
  const { user, activeScannedPatientId, setActiveScannedPatientId, getPatientById, getAllPatients } = useAuth();
  const isHospital = user?.role === 'hospital';

  // For hospital accounts, find the scoped patient
  const allPatients = getAllPatients();
  const currentPatientId = activeScannedPatientId || (allPatients[0]?.id) || null;
  const scopedPatient: UserPatientData | null = currentPatientId ? getPatientById(currentPatientId) : (allPatients[0] || null);

  // Suggested Prompts based on role and actual record state
  const patientPrompts = [
    { label: '📋 Summarize my records', message: 'Can you summarize my uploaded medical records?' },
    { label: '💊 Check my medications', message: 'What medications do I have listed in my profile?' },
    { label: '🔍 Explain medical terms', message: 'How do you explain my diagnostic reports in simple terms?' },
    { label: '🩺 Health & wellness advice', message: 'Based on my health profile, what general wellness advice do you recommend?' },
  ];

  const hospitalPrompts = [
    { label: '📋 Summarize this patient\'s latest report', message: `Summarize clinical findings from ${scopedPatient?.name || 'this patient'}'s diagnostic reports and prescriptions.` },
    { label: '💊 Check drug interactions', message: `Evaluate drug interactions and allergy contraindications for ${scopedPatient?.name || 'patient'}.` },
    { label: '🫀 Review diagnostic history', message: `Provide an overview of ${scopedPatient?.name || 'patient'}'s medical and diagnostic history.` },
    { label: '📝 Draft consultation note', message: `Draft a structured consultation note for ${scopedPatient?.name || 'this patient'}.` },
  ];

  const suggestedPrompts = isHospital ? hospitalPrompts : patientPrompts;

  // Initial welcome message dynamically reflecting the actual user/patient
  const getInitialMessage = (): AIMessage => {
    if (isHospital) {
      if (scopedPatient) {
        const recordsCount = scopedPatient.records?.length || 0;
        return {
          id: 'msg-hosp-1',
          role: 'assistant',
          content: `**Clinical AI Assistant Activated** • Scoped to Patient: **${scopedPatient.name}** (${scopedPatient.id}).

Active Clinical Context:
- **Blood Group:** ${scopedPatient.blood || 'Not specified'} • **Gender:** ${scopedPatient.gender || 'Not specified'}
- **Chronic Conditions:** ${scopedPatient.chronicConditions?.length ? scopedPatient.chronicConditions.join(', ') : 'None recorded'}
- **Known Allergies:** ${scopedPatient.allergies?.length ? `⚠️ ${scopedPatient.allergies.join(', ')}` : 'None recorded'}
- **Active Prescriptions:** ${scopedPatient.currentMedications?.length ? scopedPatient.currentMedications.join(', ') : 'None listed'}
- **Medical Records on File:** ${recordsCount} record${recordsCount !== 1 ? 's' : ''} uploaded

You can ask me to synthesize diagnostic reports, verify drug interactions, or draft clinical notes based on this patient's records.`,
          timestamp: new Date(),
        };
      } else {
        return {
          id: 'msg-hosp-empty',
          role: 'assistant',
          content: `**Clinical AI Assistant Activated**.

No patient is currently selected. Please scan a patient QR code or select a patient from the dropdown above to analyze their records.`,
          timestamp: new Date(),
        };
      }
    }

    // Patient role
    const userName = user?.name || 'there';
    const userRecordsCount = user?.records?.length || 0;
    const hasVitals = user?.blood || user?.allergies?.length || user?.currentMedications?.length;

    if (userRecordsCount === 0 && !hasVitals) {
      return {
        id: 'msg-1',
        role: 'assistant',
        content: `Hello **${userName}**! 👋 I'm your **MedQR+ AI Health Assistant**.

You haven't uploaded any medical records or entered health vitals yet. 

Once you:
- 📋 Upload prescriptions, lab reports, or scans in **Medical Records**
- 🩸 Complete your blood group and allergies in **My Profile**

I will provide personalized summaries, dosage schedules, and health insights for you. How can I help you today?`,
        timestamp: new Date(),
      };
    }

    return {
      id: 'msg-1',
      role: 'assistant',
      content: `Hello **${userName}**! 👋 I'm your **MedQR+ AI Health Assistant**.

I have secure read access to your ${userRecordsCount} uploaded medical record${userRecordsCount !== 1 ? 's' : ''} and profile vitals. You can ask me to:
- 📋 Summarize your recent lab results & clinical visits
- 💊 Explain medicine dosage schedules & interactions
- 🔍 Translate complex medical terms into plain English
- 🩺 Suggest personalized lifestyle tips based on your health profile

How can I help you today?`,
      timestamp: new Date(),
    };
  };

  const [messages, setMessages] = useState<AIMessage[]>([getInitialMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, [currentPatientId, isHospital, user?.id, user?.records?.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Dynamic response generator reading REAL data
  const generateDynamicResponse = (query: string): string => {
    const target = isHospital ? scopedPatient : user;
    if (!target) {
      return 'No active patient record selected. Please scan or select a patient to analyze their medical data.';
    }

    const records = target.records || [];
    const allergies = target.allergies || [];
    const medications = target.currentMedications || [];
    const conditions = target.chronicConditions || [];
    const lower = query.toLowerCase();

    // 1. Records Summary Query
    if (lower.includes('summarize') || lower.includes('report') || lower.includes('record')) {
      if (records.length === 0) {
        return `There are currently **no medical records uploaded** for ${target.name}.\n\nTo see report summaries here, please upload prescriptions, lab reports, or radiology files in the **Medical Records** section.`;
      }

      const recordSummaries = records.map((r, i) =>
        `**${i + 1}. ${r.title}** (${r.type.toUpperCase()})\n- Date: ${r.date} | Doctor: ${r.doctor || 'Not specified'}\n- Summary: ${r.summary || r.details || 'No notes provided'}`
      ).join('\n\n');

      return `### 📋 Summary of Medical Records for ${target.name} (${records.length} Total):\n\n${recordSummaries}\n\nAll records are securely encrypted in your MedQR+ vault.`;
    }

    // 2. Medication / Drug Interactions Query
    if (lower.includes('medication') || lower.includes('medicine') || lower.includes('drug') || lower.includes('interaction')) {
      if (medications.length === 0 && records.filter(r => r.type === 'prescription').length === 0) {
        return `There are currently **no active medications or prescriptions listed** for ${target.name}.\n\nYou can update current medications under **My Profile** or add a prescription in **Medical Records**.`;
      }

      const medList = medications.length > 0
        ? medications.map(m => `- 💊 **${m}**`).join('\n')
        : records.filter(r => r.type === 'prescription').map(p => `- 💊 **${p.title}** (${p.summary})`).join('\n');

      const allergyWarning = allergies.length > 0
        ? `\n\n⚠️ **Allergy Alert:** Patient has recorded allergies to: **${allergies.join(', ')}**. Ensure new prescriptions do not contain these active allergens.`
        : '';

      return `### 💊 Active Medications for ${target.name}:\n\n${medList}${allergyWarning}\n\n*Note: Always verify medication instructions with your prescribing physician.*`;
    }

    // 3. Clinical Consultation / SOAP note (Hospital role)
    if (isHospital && (lower.includes('soap') || lower.includes('note') || lower.includes('consultation'))) {
      const dateStr = new Date().toISOString().split('T')[0];
      return `### 📝 Structured Consultation Note\n**Patient:** ${target.name} | **MedQR ID:** ${target.id} | **Date:** ${dateStr}\n\n**[S] Subjective:**\nPatient presented for clinical evaluation. Active chronic conditions: ${conditions.length ? conditions.join(', ') : 'None recorded'}.\n\n**[O] Objective:**\n- Blood Group: ${target.blood || 'Unrecorded'}\n- Known Allergies: ${allergies.length ? allergies.join(', ') : 'None documented'}\n- Authenticated Records on File: ${records.length}\n\n**[A] Assessment:**\n${records.length > 0 ? `Review of ${records.length} records indicates documented history of ${records[0].title}.` : 'No prior diagnostic history on file.'}\n\n**[P] Plan:**\n1. Continue prescribed treatment plan.\n2. Follow up as required.`;
    }

    // 4. Default contextual response
    if (records.length === 0 && conditions.length === 0) {
      return `I received your query: *"${query}"*.\n\nSince your profile currently has no uploaded records or conditions, I recommend adding your health history in **My Profile** and **Medical Records** so I can give you personalized clinical insights.\n\nIs there a specific health term you would like me to explain?`;
    }

    return `Based on ${target.name}'s health profile:\n- **Records on File:** ${records.length}\n- **Conditions:** ${conditions.length ? conditions.join(', ') : 'None recorded'}\n- **Allergies:** ${allergies.length ? allergies.join(', ') : 'None recorded'}\n\nRegarding your question *"${query}"* — everything in the health vault is up-to-date. Always consult your healthcare provider for medical diagnoses.`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMessage: AIMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateDynamicResponse(text);
      const assistantMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: isHospital ? 'var(--color-teal-dim)' : 'var(--color-navy)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isHospital ? <Building2 size={22} /> : <Bot size={22} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--color-navy)' }}>
                {isHospital ? 'Clinical AI Assistant' : 'MedQR+ AI Health Assistant'}
              </h2>
              {isHospital && (
                <Badge variant="teal" size="sm">
                  Provider Scoped
                </Badge>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-teal)', display: 'inline-block' }} />
              <span>{isHospital ? `Active Patient: ${scopedPatient?.name || 'No Patient Selected'}` : 'Online • Context-aware of your medical records'}</span>
            </div>
          </div>
        </div>

        {/* Hospital Patient Selector */}
        {isHospital && allPatients.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Patient Context:
            </span>
            <select
              value={currentPatientId || ''}
              onChange={e => setActiveScannedPatientId(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-teal)',
                background: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-navy)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {allPatients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>
        )}

        {!isHospital && (
          <Badge variant="teal" size="sm" icon={<ShieldCheck size={12} />}>
            Private &amp; HIPAA-Safe
          </Badge>
        )}
      </div>

      {/* Main Chat Container */}
      <Card
        padding="none"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Messages Scroll Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            background: 'var(--color-surface-alt)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: isHospital ? 'var(--color-teal-dim)' : 'var(--color-navy)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} />
              </div>
              <div
                style={{
                  padding: '12px 18px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  borderTopLeftRadius: '4px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal)', animation: 'pulse 1s infinite 0ms' }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal)', animation: 'pulse 1s infinite 200ms' }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal)', animation: 'pulse 1s infinite 400ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Chips Bar */}
        <div
          style={{
            padding: '10px 16px',
            background: '#FFFFFF',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {suggestedPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.message)}
              disabled={isTyping}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-navy)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--color-teal-bg)';
                e.currentTarget.style.borderColor = 'var(--color-teal)';
                e.currentTarget.style.color = 'var(--color-teal-dim)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--color-bg)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-navy)';
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Box Bar */}
        <div
          style={{
            padding: '14px 16px',
            background: '#FFFFFF',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder={
              isHospital
                ? `Query clinical history, drug interactions, or diagnostic summaries for ${scopedPatient?.name || 'patient'}...`
                : 'Ask about your medications, test summaries, symptoms...'
            }
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '14px',
              outline: 'none',
              background: 'var(--color-surface)',
            }}
          />

          <Button
            variant="teal"
            size="md"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            icon={<Send size={16} />}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};
