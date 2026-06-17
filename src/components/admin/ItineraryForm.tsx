import { useEffect, useState, type FormEvent } from 'react';
import { slugify } from '../../lib/adminFormUtils';
import type { AdminItinerary, AdminItineraryDay, ItineraryInput } from '../../types/admin';
import { AdminModal } from './AdminModal';

type ItineraryFormProps = {
  initial?: AdminItinerary | null;
  onClose: () => void;
  onSave: (input: ItineraryInput) => Promise<void>;
};

const emptyDay = (): AdminItineraryDay => ({
  day: 'Day 1',
  title: '',
  details: '',
});

const emptyItinerary = (): ItineraryInput => ({
  id: '',
  title: '',
  duration: '3 days',
  route: '',
  price: '',
  style: '',
  image: '',
  status: 'draft',
  featuredOnHome: false,
  featuredSortOrder: 0,
  days: [emptyDay()],
});

export function ItineraryForm({ initial, onClose, onSave }: ItineraryFormProps) {
  const [form, setForm] = useState<ItineraryInput>(emptyItinerary());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      const { updatedAt: _updatedAt, ...rest } = initial;
      setForm({
        ...rest,
        days: rest.days.length ? rest.days : [emptyDay()],
      });
      return;
    }

    setForm(emptyItinerary());
  }, [initial]);

  const update = <K extends keyof ItineraryInput>(key: K, value: ItineraryInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateDay = (index: number, key: keyof AdminItineraryDay, value: string) => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day, dayIndex) =>
        dayIndex === index ? { ...day, [key]: value } : day,
      ),
    }));
  };

  const addDay = () => {
    setForm((current) => ({
      ...current,
      days: [
        ...current.days,
        {
          day: `Day ${current.days.length + 1}`,
          title: '',
          details: '',
        },
      ],
    }));
  };

  const removeDay = (index: number) => {
    setForm((current) => ({
      ...current,
      days: current.days.filter((_, dayIndex) => dayIndex !== index),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload: ItineraryInput = {
        ...form,
        id: slugify(form.id || form.title),
        days: form.days.filter((day) => day.title.trim() || day.details.trim()),
      };

      if (!payload.title.trim() || !payload.id.trim() || !payload.image.trim()) {
        throw new Error('Title, ID, and cover image URL are required.');
      }

      if (payload.days.length === 0) {
        throw new Error('Add at least one itinerary day.');
      }

      await onSave(payload);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save itinerary.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminModal
      wide
      eyebrow={initial ? 'Edit itinerary' : 'Add itinerary'}
      lead="Build the itinerary card and expandable day-by-day plan shown on the public site."
      title={initial ? `Edit ${initial.title}` : 'Itinerary details'}
      onClose={onClose}
    >
      <form className="form-stack admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => {
                const title = event.target.value;
                update('title', title);
                if (!initial) {
                  update('id', slugify(title));
                }
              }}
              required
            />
          </label>
          <label>
            ID / slug
            <input
              value={form.id}
              onChange={(event) => update('id', slugify(event.target.value))}
              placeholder="budget-mara-weekend"
              required
            />
          </label>
          <label>
            Duration
            <input
              value={form.duration}
              onChange={(event) => update('duration', event.target.value)}
              placeholder="3 days"
              required
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) => update('status', event.target.value as ItineraryInput['status'])}
            >
              <option value="live">Live</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
            </select>
          </label>
          <label>
            Route summary
            <input
              value={form.route}
              onChange={(event) => update('route', event.target.value)}
              placeholder="Nairobi → Maasai Mara → Nairobi"
              required
            />
          </label>
          <label>
            Price
            <input
              value={form.price}
              onChange={(event) => update('price', event.target.value)}
              placeholder="From $180 pp"
              required
            />
          </label>
          <label>
            Style
            <input
              value={form.style}
              onChange={(event) => update('style', event.target.value)}
              placeholder="Budget wildlife weekend"
              required
            />
          </label>
          <label>
            Cover image URL
            <input
              value={form.image}
              onChange={(event) => update('image', event.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </label>
          <label className="checkbox-field">
            <input
              checked={form.featuredOnHome}
              onChange={(event) => update('featuredOnHome', event.target.checked)}
              type="checkbox"
            />
            Featured on Popular itineraries (homepage)
          </label>
          <label>
            Featured sort order
            <input
              min={0}
              type="number"
              value={form.featuredSortOrder}
              onChange={(event) => update('featuredSortOrder', Number(event.target.value) || 0)}
            />
          </label>
        </div>

        <div className="admin-day-editor">
          <div className="admin-day-editor-header">
            <h3>Day-by-day plan</h3>
            <button className="secondary-button" onClick={addDay} type="button">
              Add day
            </button>
          </div>

          {form.days.map((day, index) => (
            <div key={`day-${index}`} className="admin-day-card">
              <div className="admin-day-card-top">
                <strong>Day {index + 1}</strong>
                {form.days.length > 1 ? (
                  <button className="ghost-link" onClick={() => removeDay(index)} type="button">
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="form-grid">
                <label>
                  Day label
                  <input
                    value={day.day}
                    onChange={(event) => updateDay(index, 'day', event.target.value)}
                    placeholder="Day 1"
                    required
                  />
                </label>
                <label>
                  Day title
                  <input
                    value={day.title}
                    onChange={(event) => updateDay(index, 'title', event.target.value)}
                    placeholder="Arrival and evening game drive"
                    required
                  />
                </label>
              </div>
              <label>
                Details
                <textarea
                  value={day.details}
                  onChange={(event) => updateDay(index, 'details', event.target.value)}
                  placeholder="What happens this day — transport, activities, budget tips..."
                  rows={3}
                  required
                />
              </label>
            </div>
          ))}
        </div>

        {error ? <p className="auth-message">{error}</p> : null}

        <button className="primary-button full-width" disabled={submitting} type="submit">
          {submitting ? 'Saving...' : initial ? 'Update itinerary' : 'Create itinerary'}
        </button>
      </form>
    </AdminModal>
  );
}
