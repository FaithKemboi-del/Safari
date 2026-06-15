import { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminLoginPage } from './AdminLoginPage';

type AdminProtectedProps = {
  onNavigate: (hash: string) => void;
  children: ReactNode;
};

export function AdminProtected({ onNavigate, children }: AdminProtectedProps) {
  const { isAdmin, loading, user } = useAuth();

  if (loading) {
    return (
      <section className="admin-shell admin-shell--gate">
        <p className="auth-message">Verifying admin access...</p>
      </section>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLoginPage onSuccess={() => onNavigate('admin')} />;
  }

  return <>{children}</>;
}
