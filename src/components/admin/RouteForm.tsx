import { useEffect, useState, type FormEvent } from 'react';
import type { AdminRoute, RouteInput } from '../../types/admin';
import { AdminModal } from './AdminModal';

type RouteFormProps = {
  initial?: AdminRoute | null;
  onClose: () => void;
  onSave: (input: RouteInput) => Promise<void>;
};

const emptyRoute = (): RouteInput => ({
  name: '',
  routeType: '',
  distance: '',
  status: 'draft',
});

export function RouteForm({ initial, onClose, onSave }: RouteFormProps) {
  const [form, setForm] = useState<RouteInput>(emptyRoute());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      const { id: _id, updatedAt: _updatedAt, ...rest } = initial;
      setForm(rest);
      return;
    }

    setForm(emptyRoute());
  }, [initial]);

  const update = <K extends keyof RouteInput>(key: K, value: RouteInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!form.name.trim() || !form.routeType.trim() || !form.distance.trim()) {
        throw new Error('Name, route type, and distance are required.');
      }

      await onSave(form);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save route.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminModal
      eyebrow={initial ? 'Edit route' : 'Add route'}
      lead="Budget transport corridors used in operations planning."
      title={initial ? `Edit ${initial.name}` : 'Route details'}
      onClose={onClose}
    >
      <form className="form-stack admin-form" onSubmit={handleSubmit}>
        <label>
          Route name
          <input
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="Nairobi → Maasai Mara"
            required
          />
        </label>
        <div className="form-grid">
          <label>
            Route type
            <input
              value={form.routeType}
              onChange={(event) => update('routeType', event.target.value)}
              placeholder="Fly-in / Matatu / SGR"
              required
            />
          </label>
          <label>
            Distance
            <input
              value={form.distance}
              onChange={(event) => update('distance', event.target.value)}
              placeholder="290 km"
              required
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) => update('status', event.target.value as RouteInput['status'])}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        {error ? <p className="auth-message">{error}</p> : null}

        <button className="primary-button full-width" disabled={submitting} type="submit">
          {submitting ? 'Saving...' : initial ? 'Update route' : 'Create route'}
        </button>
      </form>
    </AdminModal>
  );
}
