import { Component, type ErrorInfo, type ReactNode } from 'react';
import { BRAND_NAME } from '../lib/config';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`${BRAND_NAME} render error:`, error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <section className="section">
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '42rem', margin: '4rem auto' }}>
            <span className="eyebrow">Something went wrong</span>
            <h1>We hit an unexpected error</h1>
            <p>Try refreshing the page. If this keeps happening, clear site data for this browser and sign in again.</p>
            <button
              className="primary-button"
              onClick={() => window.location.reload()}
              type="button"
            >
              Refresh page
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
