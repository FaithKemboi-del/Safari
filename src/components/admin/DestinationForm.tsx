import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { KENYA_PROVINCES } from '../../lib/kenyaProvinces';
import { formatListInput, parseListInput, slugify } from '../../lib/adminFormUtils';
import {
  DESTINATION_CATEGORY_OPTIONS,
  computeBudgetEstimates,
  formatBudgetKes,
  getCategoryConfig,
} from '../../lib/destinationCategories';
import {
  adminDestinationToInput,
  emptyDestinationInput,
} from '../../lib/destinationFormUtils';
import type { AdminDestination, DestinationInput } from '../../types/admin';
import type { DestinationCategoryId } from '../../types/destination';
import { AdminModal } from './AdminModal';

type DestinationFormProps = {
  initial?: AdminDestination | null;
  onClose: () => void;
  onSave: (input: DestinationInput) => Promise<void>;
};

export function DestinationForm({ initial, onClose, onSave }: DestinationFormProps) {
  const [form, setForm] = useState<DestinationInput>(emptyDestinationInput());
  const [galleryInput, setGalleryInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const categoryConfig = useMemo(() => getCategoryConfig(form.category), [form.category]);
  const budgetEstimates = useMemo(() => computeBudgetEstimates(form.budget), [form.budget]);

  useEffect(() => {
    if (initial) {
      const input = adminDestinationToInput(initial);
      setForm(input);
      setGalleryInput(formatListInput(input.gallery));
      setHighlightsInput(formatListInput(input.highlights));
      return;
    }

    setForm(emptyDestinationInput());
    setGalleryInput('');
    setHighlightsInput('');
  }, [initial]);

  const update = <K extends keyof DestinationInput>(key: K, value: DestinationInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateBudget = (key: keyof DestinationInput['budget'], value: number) => {
    setForm((current) => ({
      ...current,
      budget: { ...current.budget, [key]: value },
    }));
  };

  const updateCategoryField = (key: string, value: string) => {
    setForm((current) => ({
      ...current,
      categoryFields: { ...current.categoryFields, [key]: value },
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload: DestinationInput = {
        ...form,
        slug: slugify(form.slug || form.title),
        county: form.county || form.location,
        mapQuery: form.mapQuery || form.title,
        gallery: parseListInput(galleryInput),
        highlights: parseListInput(highlightsInput),
        experienceType: form.category === 'hiking' ? 'hike' : 'standard',
        categoryFields: Object.fromEntries(
          Object.entries(form.categoryFields).filter(([, value]) => value.trim()),
        ),
      };

      if (!payload.title.trim() || !payload.slug.trim() || !payload.image.trim()) {
        throw new Error('Title, slug, and cover image URL are required.');
      }

      await onSave(payload);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save destination.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminModal
      wide
      eyebrow={initial ? 'Edit destination' : 'Add destination'}
      lead="Shared travel details plus category-specific fields. Only the section for the selected category is shown below."
      title={initial ? `Edit ${initial.title}` : 'Destination details'}
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
                  update('slug', slugify(title));
                  update('mapQuery', title);
                }
              }}
              placeholder="Hell's Gate National Park"
              required
            />
          </label>
          <label>
            Slug
            <input
              value={form.slug}
              onChange={(event) => update('slug', slugify(event.target.value))}
              placeholder="hells-gate"
              required
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(event) => {
                const category = event.target.value as DestinationCategoryId;
                update('category', category);
                update('experienceType', category === 'hiking' ? 'hike' : 'standard');
              }}
            >
              {DESTINATION_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) => update('status', event.target.value as DestinationInput['status'])}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
            </select>
          </label>
          <label>
            Location
            <input
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              placeholder="Naivasha, Nakuru County"
              required
            />
          </label>
          <label>
            County
            <input
              value={form.county}
              onChange={(event) => update('county', event.target.value)}
              placeholder="Nakuru County"
            />
          </label>
          <label>
            Province / region
            <select value={form.region} onChange={(event) => update('region', event.target.value)}>
              {KENYA_PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </label>
          <label>
            Nearest town
            <input
              value={form.nearestTown ?? ''}
              onChange={(event) => update('nearestTown', event.target.value)}
              placeholder="Naivasha"
            />
          </label>
          <label>
            Distance from Nairobi (km)
            <input
              min={0}
              type="number"
              value={form.distanceFromNairobiKm ?? ''}
              onChange={(event) =>
                update('distanceFromNairobiKm', event.target.value ? Number(event.target.value) : undefined)
              }
            />
          </label>
          <label>
            Travel time from Nairobi
            <input
              value={form.travelTimeFromNairobi ?? ''}
              onChange={(event) => update('travelTimeFromNairobi', event.target.value)}
              placeholder="2 hours by road"
            />
          </label>
          <label>
            Best time to visit
            <input
              value={form.bestTimeToVisit ?? ''}
              onChange={(event) => update('bestTimeToVisit', event.target.value)}
              placeholder="Dry season, Jun–Oct"
            />
          </label>
          <label className="checkbox-field">
            <input
              checked={form.familyFriendly}
              onChange={(event) => update('familyFriendly', event.target.checked)}
              type="checkbox"
            />
            Family friendly
          </label>
        </div>

        <label>
          Short description
          <textarea
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            placeholder="What makes this place worth visiting on a budget?"
            rows={4}
            required
          />
        </label>

        <div className="form-grid">
          <label>
            Cover image URL
            <input
              value={form.image}
              onChange={(event) => update('image', event.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </label>
          <label>
            Map query
            <input
              value={form.mapQuery}
              onChange={(event) => update('mapQuery', event.target.value)}
              placeholder="Hell's Gate National Park Kenya"
            />
          </label>
        </div>

        <div className="category-form-links">
          <h3>Budget breakdown (KES)</h3>
          <div className="form-grid">
            {(
              [
                ['transport', 'Transport'],
                ['accommodation', 'Accommodation'],
                ['entryFee', 'Entry fee'],
                ['guideFee', 'Guide fee'],
                ['food', 'Food estimate'],
                ['activity', 'Activity cost'],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  min={0}
                  type="number"
                  value={form.budget[key]}
                  onChange={(event) => updateBudget(key, Number(event.target.value) || 0)}
                />
              </label>
            ))}
          </div>
          <div className="destination-budget-estimates destination-budget-estimates--admin">
            <div>
              <small>Day trip</small>
              <strong>{formatBudgetKes(budgetEstimates.dayTrip)}</strong>
            </div>
            <div>
              <small>Weekend</small>
              <strong>{formatBudgetKes(budgetEstimates.weekend)}</strong>
            </div>
            <div>
              <small>Total</small>
              <strong>{formatBudgetKes(budgetEstimates.total)}</strong>
            </div>
          </div>
        </div>

        <div className="category-form-links">
          <h3>How to get there</h3>
          <label>
            Directions
            <textarea
              value={form.directions ?? ''}
              onChange={(event) => update('directions', event.target.value)}
              rows={3}
            />
          </label>
          <label>
            Public transport
            <textarea
              value={form.publicTransport ?? ''}
              onChange={(event) => update('publicTransport', event.target.value)}
              rows={3}
            />
          </label>
          <label>
            Road conditions
            <textarea
              value={form.roadConditions ?? ''}
              onChange={(event) => update('roadConditions', event.target.value)}
              rows={2}
            />
          </label>
        </div>

        <div className="category-form-links">
          <h3>Travel tips</h3>
          <label>
            Safety information
            <textarea
              value={form.safetyAndConditions ?? ''}
              onChange={(event) => update('safetyAndConditions', event.target.value)}
              rows={3}
            />
          </label>
          <label>
            What to carry
            <textarea
              value={form.whatToCarry ?? ''}
              onChange={(event) => update('whatToCarry', event.target.value)}
              rows={3}
            />
          </label>
          <label>
            Useful advice
            <textarea
              value={form.travelTips ?? ''}
              onChange={(event) => update('travelTips', event.target.value)}
              rows={3}
            />
          </label>
        </div>

        <div className="category-form-links">
          <h3>{categoryConfig.label} details</h3>
          <div className="form-grid">
            {categoryConfig.fields.map((field) => (
              <label key={field.key}>
                {field.label}
                {field.type === 'textarea' ? (
                  <textarea
                    value={form.categoryFields[field.key] ?? ''}
                    onChange={(event) => updateCategoryField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={form.categoryFields[field.key] ?? ''}
                    onChange={(event) => updateCategoryField(field.key, event.target.value)}
                  >
                    <option value="">Select</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={form.categoryFields[field.key] ?? ''}
                    onChange={(event) => updateCategoryField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    type={field.type === 'url' ? 'url' : 'text'}
                  />
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="category-form-links">
          <h3>Homepage placement</h3>
          <div className="form-grid">
            <label className="checkbox-field">
              <input
                checked={form.featuredOnHome}
                onChange={(event) => update('featuredOnHome', event.target.checked)}
                type="checkbox"
              />
              Featured destination on landing page
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
            <label className="checkbox-field">
              <input
                checked={form.trendingOnHome}
                onChange={(event) => update('trendingOnHome', event.target.checked)}
                type="checkbox"
              />
              Show in Trending this week
            </label>
            <label>
              Trending sort order
              <input
                min={0}
                type="number"
                value={form.trendingSortOrder}
                onChange={(event) => update('trendingSortOrder', Number(event.target.value) || 0)}
              />
            </label>
          </div>
        </div>

        <label>
          Gallery URLs (one per line)
          <textarea
            value={galleryInput}
            onChange={(event) => setGalleryInput(event.target.value)}
            rows={3}
          />
        </label>
        <label>
          Highlights (comma or line separated)
          <textarea
            value={highlightsInput}
            onChange={(event) => setHighlightsInput(event.target.value)}
            rows={3}
          />
        </label>

        {error ? <p className="auth-message">{error}</p> : null}
        <button className="primary-button full-width" disabled={submitting} type="submit">
          {submitting ? 'Saving...' : initial ? 'Update destination' : 'Create destination'}
        </button>
      </form>
    </AdminModal>
  );
}
