import { useEffect, useState, type FormEvent } from 'react';
import { categories } from '../../data';
import { slugify } from '../../lib/adminFormUtils';
import type { AdminCategorySpot, CategorySpotInput } from '../../types/admin';
import { AdminModal } from './AdminModal';

type CategorySpotFormProps = {
  initial?: AdminCategorySpot | null;
  onClose: () => void;
  onSave: (input: CategorySpotInput) => Promise<void>;
};

const emptySpot = (): CategorySpotInput => ({
  id: '',
  categoryId: 'hiking',
  title: '',
  location: '',
  budget: '',
  description: '',
  image: '',
  slug: '',
  trailId: '',
  mapQuery: '',
  dateLabel: '',
  eventStatus: 'upcoming',
  status: 'draft',
  sortOrder: 0,
});

export function CategorySpotForm({ initial, onClose, onSave }: CategorySpotFormProps) {
  const [form, setForm] = useState<CategorySpotInput>(emptySpot());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isEvent = form.categoryId === 'events';

  useEffect(() => {
    if (initial) {
      const { updatedAt: _updatedAt, ...rest } = initial;
      setForm(rest);
      return;
    }

    setForm(emptySpot());
  }, [initial]);

  const update = <K extends keyof CategorySpotInput>(key: K, value: CategorySpotInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload: CategorySpotInput = {
        ...form,
        id: slugify(form.id || form.title),
        slug: form.slug?.trim() || undefined,
        trailId: form.trailId?.trim() || undefined,
        mapQuery: form.mapQuery?.trim() || undefined,
        dateLabel: isEvent ? form.dateLabel?.trim() : undefined,
        eventStatus: isEvent ? form.eventStatus : undefined,
      };

      if (!payload.title.trim() || !payload.id.trim() || !payload.image.trim()) {
        throw new Error('Title, ID, and image URL are required.');
      }

      if (isEvent && (!payload.dateLabel || !payload.eventStatus)) {
        throw new Error('Events need a date label and event status.');
      }

      await onSave(payload);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save category card.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminModal
      wide
      eyebrow={initial ? 'Edit category card' : 'Add category card'}
      lead="These cards appear on category pages — hiking, coast, waterfalls, events, and more."
      title={initial ? `Edit ${initial.title}` : 'Category card details'}
      onClose={onClose}
    >
      <form className="form-stack admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Category
            <select
              value={form.categoryId}
              onChange={(event) => update('categoryId', event.target.value)}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) => update('status', event.target.value as CategorySpotInput['status'])}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
            </select>
          </label>
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
            Card ID
            <input
              value={form.id}
              onChange={(event) => update('id', slugify(event.target.value))}
              placeholder="hike-hells-gate"
              required
            />
          </label>
          <label>
            Location
            <input
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              required
            />
          </label>
          <label>
            Budget line
            <input
              value={form.budget}
              onChange={(event) => update('budget', event.target.value)}
              placeholder="From $15 park entry"
              required
            />
          </label>
          <label>
            Sort order
            <input
              min={0}
              type="number"
              value={form.sortOrder}
              onChange={(event) => update('sortOrder', Number(event.target.value) || 0)}
            />
          </label>
          <label>
            Image URL
            <input
              value={form.image}
              onChange={(event) => update('image', event.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </label>
        </div>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            rows={4}
            required
          />
        </label>

        <div className="form-grid">
          <label>
            Link to destination slug
            <input
              value={form.slug ?? ''}
              onChange={(event) => update('slug', event.target.value)}
              placeholder="hells-gate"
            />
          </label>
          <label>
            Link to trail ID
            <input
              value={form.trailId ?? ''}
              onChange={(event) => update('trailId', event.target.value)}
              placeholder="longonot-trail"
            />
          </label>
          <label>
            Map query
            <input
              value={form.mapQuery ?? ''}
              onChange={(event) => update('mapQuery', event.target.value)}
              placeholder="Hell's Gate National Park Kenya"
            />
          </label>
        </div>

        {isEvent ? (
          <div className="form-grid">
            <label>
              Date label
              <input
                value={form.dateLabel ?? ''}
                onChange={(event) => update('dateLabel', event.target.value)}
                placeholder="Happening this week"
                required
              />
            </label>
            <label>
              Event status
              <select
                value={form.eventStatus ?? 'upcoming'}
                onChange={(event) =>
                  update('eventStatus', event.target.value as CategorySpotInput['eventStatus'])
                }
                required
              >
                <option value="happening-now">Happening now</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </label>
          </div>
        ) : null}

        {error ? <p className="auth-message">{error}</p> : null}

        <button className="primary-button full-width" disabled={submitting} type="submit">
          {submitting ? 'Saving...' : initial ? 'Update card' : 'Create card'}
        </button>
      </form>
    </AdminModal>
  );
}
