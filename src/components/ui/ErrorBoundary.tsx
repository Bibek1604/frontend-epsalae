// ============================================
// ERROR BOUNDARY COMPONENT - LIGHTWEIGHT & RESILIENT
// ============================================
// Catches React errors without creating lasting problems
// Auto-resets on navigation, recovers gracefully

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  private resetTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught:', error, errorInfo.componentStack);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Auto-reset after navigation (prevent long-lasting problems)
    this.setupAutoReset();
  }

  componentDidMount() {
    // Listen for route changes to auto-reset
    window.addEventListener('popstate', this.handleNavigation);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleNavigation);
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  handleNavigation = () => {
    // Auto-reset error on browser back/forward
    this.resetError();
  };

  setupAutoReset = () => {
    // Clear any existing timeout
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    // Auto-reset after 30 seconds if not manually reset
    this.resetTimeout = setTimeout(() => {
      if (this.state.hasError) {
        this.resetError();
      }
    }, 30000);
  };

  resetError = () => {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.resetError) || (
          <div style={styles.container}>
            <div style={styles.errorBox}>
              <div style={styles.icon}>⚠️</div>
              <h2 style={styles.title}>Something went wrong</h2>
              <p style={styles.message}>{this.state.error.message}</p>

              <div style={styles.buttonGroup}>
                <button onClick={this.resetError} style={styles.primaryButton}>
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  style={styles.secondaryButton}
                >
                  Go Home
                </button>
              </div>

              <p style={styles.helpText}>
                Error ID: {this.generateErrorId()}
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }

  private generateErrorId(): string {
    return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
  }
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  errorBox: {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    maxWidth: '450px',
    textAlign: 'center',
    border: '1px solid #e0e0e0'
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#333'
  },
  message: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 24px 0',
    lineHeight: '1.5'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  primaryButton: {
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    flex: '0 1 auto'
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    padding: '10px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    flex: '0 1 auto'
  },
  helpText: {
    color: '#999',
    fontSize: '12px',
    margin: '0',
    fontFamily: 'monospace'
  }
};

export default ErrorBoundary;
