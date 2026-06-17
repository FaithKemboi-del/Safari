import { useEffect, useState, type FormEvent } from 'react';
import { KENYA_PROVINCES } from '../../lib/kenyaProvinces';
import { formatListInput, parseListInput, slugify } from '../../lib/adminFormUtils';
import type { AdminDestination, DestinationInput } from '../../types/admin';
import { AdminModal } from './AdminModal';

type DestinationFormProps = {
  initial?: AdminDestination | null;
  onClose: () => void;
  onSave: (input: DestinationInput) => Promise<void>;
};

const emptyDestination = (): DestinationInput => ({
  slug: '',
  title: '',
  location: '',
  region: 'Rift Valley',
  experienceType: 'standard',
  description: '',
  pricing: '',
  safetyAndConditions: '',
  transportAndLogistics: '',
  additionalInfo: '',
  hikeDifficulty: '',
  image: '',
  gallery: [],
  highlights: [],
  mapQuery: '',
  status: 'draft',
  featuredOnHome: false,
  featuredSortOrder: 0,
  trendingOnHome: false,
  trendingSortOrder: 0,
});

export function DestinationForm({ initial, onClose, onSave }: DestinationFormProps) {
  const [form, setForm] = useState<DestinationInput>(emptyDestination);
  const [galleryInput, setGalleryInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      const { id: _id, updatedAt: _updatedAt, ...rest } = initial;
      setForm(rest);
      setGalleryInput(formatListInput(rest.gallery));
      setHighlightsInput(formatListInput(rest.highlights));
      return;
    }

    setForm(emptyDestination());
    setGalleryInput('');
    setHighlightsInput('');
  }, [initial]);

  const update = <K extends keyof DestinationInput>(key: K, value: DestinationInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload: DestinationInput = {
        ...form,
        slug: slugify(form.slug || form.title),
        gallery: parseListInput(galleryInput),
        highlights: parseListInput(highlightsInput),
        mapQuery: form.mapQuery || form.title,
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
      lead="These fields power the public destination detail page — pricing, safety, transport, gallery, and hike info."
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
            Location
            <input
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              placeholder="Naivasha, Nakuru County"
              required
            />
          </label>
          <label>
            Province / region
            <select
              value={form.region}
              onChange={(event) => update('region', event.target.value)}
              required
            >
              {KENYA_PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Description
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
            Experience type
            <select
              value={form.experienceType}
              onChange={(event) =>
                update('experienceType', event.target.value as DestinationInput['experienceType'])
              }
            >
              <option value="standard">Safari & travel</option>
              <option value="hike">Hiking</option>
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
            <label>
              Trending tag
              <input
                value={form.trendingTag ?? ''}
                onChange={(event) => update('trendingTag', event.target.value)}
                placeholder="Wildlife"
              />
            </label>
            <label>
              Trending searches label
              <input
                value={form.trendingSearches ?? ''}
                onChange={(event) => update('trendingSearches', event.target.value)}
                placeholder="+42% searches"
              />
            </label>
          </div>
          <small className="field-help">
            Up to three featured destinations and three trending cards appear on the homepage.
          </small>
        </div>

        {form.experienceType === 'hike' ? (
          <>
            <label>
              Hike difficulty
              <textarea
                value={form.hikeDifficulty ?? ''}
                onChange={(event) => update('hikeDifficulty', event.target.value)}
                placeholder="Moderate — 3–4 hour loop, rocky sections..."
                rows={3}
              />
            </label>
            <label>
              Transport & logistics
              <textarea
                value={form.transportAndLogistics ?? ''}
                onChange={(event) => update('transportAndLogistics', event.target.value)}
                rows={3}
              />
            </label>
            <label>
              Additional info
              <textarea
                value={form.additionalInfo ?? ''}
                onChange={(event) => update('additionalInfo', event.target.value)}
                rows={3}
              />
            </label>
          </>
        ) : (
          <>
            <label>
              Pricing
              <textarea
                value={form.pricing ?? ''}
                onChange={(event) => update('pricing', event.target.value)}
                placeholder="Budget day trip from $55 pp, camping from $20/night..."
                rows={3}
              />
            </label>
            <label>
              Safety & conditions
              <textarea
                value={form.safetyAndConditions ?? ''}
                onChange={(event) => update('safetyAndConditions', event.target.value)}
                rows={3}
              />
            </label>
            <label>
              Transport & logistics
              <textarea
                value={form.transportAndLogistics ?? ''}
                onChange={(event) => update('transportAndLogistics', event.target.value)}
                rows={3}
              />
            </label>
            <label>
              Additional info
              <textarea
                value={form.additionalInfo ?? ''}
                onChange={(event) => update('additionalInfo', event.target.value)}
                rows={3}
              />
            </label>
          </>
        )}

        <label>
          Gallery image URLs (one per line)
          <textarea
            value={galleryInput}
            onChange={(event) => setGalleryInput(event.target.value)}
            placeholder="https://images.unsplash.com/..."
            rows={4}
          />
        </label>

        <label>
          Highlights (comma or line separated)
          <textarea
            value={highlightsInput}
            onChange={(event) => setHighlightsInput(event.target.value)}
            placeholder="Great Migration, Big cats, Hot-air balloon safaris"
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
