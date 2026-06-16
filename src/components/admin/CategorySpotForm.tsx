import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { categories } from '../../data';
import { getCategoryCardConfig, sanitizeCategorySpotInputForCategory } from '../../lib/categoryCardFields';
import { slugify } from '../../lib/adminFormUtils';
import type { AdminCategorySpot, CategorySpotInput } from '../../types/admin';
import { AdminModal } from './AdminModal';

type CategorySpotFormProps = {
  initial?: AdminCategorySpot | null;
  defaultCategoryId?: string;
  onClose: () => void;
  onSave: (input: CategorySpotInput) => Promise<void>;
};

const emptySpot = (categoryId = 'hiking'): CategorySpotInput => ({
  id: '',
  categoryId,
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

export function CategorySpotForm({
  initial,
  defaultCategoryId,
  onClose,
  onSave,
}: CategorySpotFormProps) {
  const [form, setForm] = useState<CategorySpotInput>(emptySpot(defaultCategoryId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const config = useMemo(() => getCategoryCardConfig(form.categoryId), [form.categoryId]);

  useEffect(() => {
    if (initial) {
      const { updatedAt: _updatedAt, ...rest } = initial;
      setForm(sanitizeCategorySpotInputForCategory(rest) as CategorySpotInput);
      return;
    }

    setForm(emptySpot(defaultCategoryId && defaultCategoryId !== 'all' ? defaultCategoryId : 'hiking'));
  }, [initial, defaultCategoryId]);

  const update = <K extends keyof CategorySpotInput>(key: K, value: CategorySpotInput[K]) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === 'categoryId' && typeof value === 'string') {
        return sanitizeCategorySpotInputForCategory({
          ...next,
          categoryId: value,
        }) as CategorySpotInput;
      }
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const sanitized = sanitizeCategorySpotInputForCategory(form);
      const payload: CategorySpotInput = {
        ...sanitized,
        id: slugify(form.id || form.title),
        slug: sanitized.slug?.trim() || undefined,
        trailId: sanitized.trailId?.trim() || undefined,
        mapQuery: sanitized.mapQuery?.trim() || undefined,
        dateLabel: config.showEventFields ? sanitized.dateLabel?.trim() : undefined,
        eventStatus: config.showEventFields ? sanitized.eventStatus : undefined,
      };

      if (!payload.title.trim() || !payload.id.trim() || !payload.image.trim()) {
        throw new Error('Title, ID, and image URL are required.');
      }

      if (config.showEventFields && (!payload.dateLabel || !payload.eventStatus)) {
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
      eyebrow={initial ? `Edit ${config.eyebrow} card` : `Add ${config.eyebrow} card`}
      lead={config.sectionLead}
      title={initial ? `Edit ${initial.title}` : `${config.eyebrow} card details`}
      onClose={onClose}
    >
      <form className="form-stack admin-form" onSubmit={handleSubmit}>
        <div className="category-form-preview" aria-label="Card preview guide">
          <strong>On the public {config.eyebrow.toLowerCase()} page, this card shows:</strong>
          <ul>
            {config.previewLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            Section: <code>{config.sectionTitle}</code>
          </p>
        </div>

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
              placeholder={`${form.categoryId}-example`}
              required
            />
          </label>
          <label>
            Location
            <input
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              placeholder="Naivasha, Kwale, Westlands..."
              required
            />
          </label>
          <label>
            {config.budgetLabel}
            <input
              value={form.budget}
              onChange={(event) => update('budget', event.target.value)}
              placeholder={config.budgetPlaceholder}
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
            placeholder={config.descriptionPlaceholder}
            rows={4}
            required
          />
        </label>

        {config.showEventFields ? (
          <div className="form-grid">
            <label>
              {config.dateLabelLabel}
              <input
                value={form.dateLabel ?? ''}
                onChange={(event) => update('dateLabel', event.target.value)}
                placeholder={config.dateLabelPlaceholder}
                required
              />
            </label>
            <label>
              {config.eventStatusLabel}
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

        {config.showDestinationSlug || config.showTrailId || config.showMapQuery ? (
          <div className="category-form-links">
            <h3>Card actions (matches user-side buttons)</h3>
            <div className="form-grid">
              {config.showDestinationSlug ? (
                <label>
                  {config.destinationSlugLabel}
                  <input
                    value={form.slug ?? ''}
                    onChange={(event) => update('slug', event.target.value)}
                    placeholder={config.destinationSlugPlaceholder}
                  />
                  <small className="field-help">{config.destinationSlugHelp}</small>
                </label>
              ) : null}
              {config.showTrailId ? (
                <label>
                  {config.trailIdLabel}
                  <input
                    value={form.trailId ?? ''}
                    onChange={(event) => update('trailId', event.target.value)}
                    placeholder={config.trailIdPlaceholder}
                  />
                  <small className="field-help">{config.trailIdHelp}</small>
                </label>
              ) : null}
              {config.showMapQuery ? (
                <label>
                  {config.mapQueryLabel}
                  <input
                    value={form.mapQuery ?? ''}
                    onChange={(event) => update('mapQuery', event.target.value)}
                    placeholder={config.mapQueryPlaceholder}
                  />
                  <small className="field-help">{config.mapQueryHelp}</small>
                </label>
              ) : null}
            </div>
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
