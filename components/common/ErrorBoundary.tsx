
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component to catch rendering errors in child components.
 * Standardizing on React.Component inheritance for robust error catching.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to the console
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    // Render fallback UI if an error was caught
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020202] text-white p-8">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-red-500">System Critical Error</h1>
          <p className="text-gray-400 mb-8 max-w-lg text-center font-mono text-sm">
            {(this.state as any).error?.message || 'Một lỗi không xác định đã xảy ra trong Shard. Vui lòng tải lại hệ thống.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black font-black uppercase rounded-xl hover:bg-gray-200 transition-all text-xs tracking-widest"
          >
            Khởi động lại Terminal
          </button>
        </div>
      );
    }

    // Fix: Explicitly cast this to any to access props properties if TS complains
    return (this as any).props.children || null;
  }
}
