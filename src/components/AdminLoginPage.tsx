import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../lib/config';

type AdminLoginPageProps = {
  onSuccess: () => void;
};

export function AdminLoginPage({ onSuccess }: AdminLoginPageProps) {
  const { adminSignIn, isConfigured, loading, adminLoading, isAdmin, user } = useAuth();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const verifying = loading || (Boolean(user) && adminLoading);

  useEffect(() => {
    if (!verifying && isAdmin) {
      onSuccess();
    }
  }, [isAdmin, verifying, onSuccess]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const result = await adminSignIn(email.trim(), password);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      onSuccess();
    } catch (error) {
      console.error('Admin sign-in failed:', error);
      setMessage('Something went wrong. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <section className="auth-page admin-login-page">
        <div className="auth-card admin-login-card">
          <p className="auth-message">Checking session...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page admin-login-page">
      <div className="auth-visual section-dark">
        <div className="auth-image" />
        <div className="hero-overlay" />
        <div>
          <span className="eyebrow">Restricted access</span>
          <h1>Admin dashboard</h1>
          <p>
            Sign in with your authorized admin account to manage destinations, itineraries, and
            routes. Public travelers cannot access this area.
          </p>
        </div>
      </div>

      <div className="auth-card admin-login-card">
        <span className="eyebrow">Admin sign in</span>
        <h2>Travel operations login</h2>
        {!isConfigured ? (
          <p className="auth-message">
            Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, then run the admin seed
            script.
          </p>
        ) : (
          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              Admin email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={ADMIN_EMAIL}
                required
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                autoComplete="current-password"
              />
            </label>
            {message ? <p className="auth-message">{message}</p> : null}
            <button className="primary-button full-width" disabled={submitting} type="submit">
              {submitting ? 'Signing in...' : 'Sign in to admin'}
            </button>
          </form>
        )}
        <p className="auth-switch">
          <a href="#home">← Back to site</a>
        </p>
      </div>
    </section>
  );
}
