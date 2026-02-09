declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.md' {
  const content: string;
  export default content;
}

// Global types for NATT-OS
declare global {
  interface Window {
    NATT_OS: any;
  }
}
