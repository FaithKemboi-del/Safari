import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

type AdminLoginPageProps = {
  onSuccess: () => void;
};

export function AdminLoginPage({ onSuccess }: AdminLoginPageProps) {
  const { adminSignIn, loading, adminLoading, isAdmin, user } = useAuth();
  const [email, setEmail] = useState('');
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
      setMessage('Something went wrong. Please try again.');
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
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="off"
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
              autoComplete="new-password"
            />
          </label>
          {message ? <p className="auth-message">{message}</p> : null}
          <button className="primary-button full-width" disabled={submitting} type="submit">
            {submitting ? 'Signing in...' : 'Sign in to admin'}
          </button>
        </form>
        <p className="auth-switch">
          <a href="#home">← Back to site</a>
        </p>
      </div>
    </section>
  );
}
