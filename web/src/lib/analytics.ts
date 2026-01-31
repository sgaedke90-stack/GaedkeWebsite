/**
 * Client-side analytics helper for fire-and-forget event logging
 * Events are sent to /api/analytics and logged to JSONL without blocking the UI
 */

export interface AnalyticsEventData {
  readonly [key: string]: unknown;
}

export const logAnalytics = (
  event: string,
  data?: AnalyticsEventData,
  session?: string
): void => {
  // Fire-and-forget: don't wait for response, catch errors silently
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data, session }),
  }).catch(() => {
    // Silently ignore analytics failures - never slow down the user experience
  });
};

export const logLeadEvent = (
  eventType: 'submitted_success' | 'submitted_fallback' | 'submitted_failed' | 'started' | 'completed_step',
  data?: AnalyticsEventData
): void => {
  logAnalytics(`lead_${eventType}`, data);
};

export const logChatEvent = (
  eventType: 'message_sent' | 'message_received' | 'file_uploaded' | 'session_started' | 'session_ended',
  data?: AnalyticsEventData
): void => {
  logAnalytics(`chat_${eventType}`, data);
};
