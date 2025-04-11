// Define the electron window API interface
declare global {
  interface Window {
    api: {
      receive: (channel: string, callback: (data: any) => void) => void;
      send: (channel: string, data?: any) => void;
      invoke: (channel: string, data?: any) => Promise<any>;
    };
  }
}

export {};
