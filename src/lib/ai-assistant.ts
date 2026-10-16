// Global Event Bus & Helper for UniQuesta AI Copilot
type AiEventCallback = (detail: { query?: string; open?: boolean }) => void;

class AiCopilotService {
  private listeners: AiEventCallback[] = [];

  subscribe(callback: AiEventCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  open(query?: string) {
    this.listeners.forEach((cb) => cb({ query, open: true }));
  }

  close() {
    this.listeners.forEach((cb) => cb({ open: false }));
  }
}

export const aiCopilot = new AiCopilotService();

export function openAiCopilot(query?: string) {
  aiCopilot.open(query);
}
