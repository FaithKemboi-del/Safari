import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { TrailsProvider } from './context/TrailsContext';
import './styles.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <TrailsProvider>
            <App />
          </TrailsProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
