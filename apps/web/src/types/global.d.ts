declare global {
    interface Window {
      Tally?: {
        loadEmbeds: () => void;
        openPopup?: (id: string, options?: Record<string, unknown>) => void;
      };
    }
  }
  
  export {};
  