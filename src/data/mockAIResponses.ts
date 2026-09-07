export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SuggestedPrompt {
  label: string;
  message: string;
}

export const defaultPatientPrompts: SuggestedPrompt[] = [
  { label: '📋 Summarize my records', message: 'Can you summarize my uploaded medical records?' },
  { label: '💊 Check my medications', message: 'What medications do I have listed and are there any instructions?' },
  { label: '🔍 Explain medical terms', message: 'How do you explain my diagnostic reports in simple terms?' },
  { label: '🩺 General wellness tips', message: 'What health and wellness advice do you recommend for me?' },
];
