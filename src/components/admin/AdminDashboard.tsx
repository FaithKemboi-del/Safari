import { useCallback, useEffect, useMemo, useState } from 'react';
import { Brand } from '../Brand';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { isSupabaseConfigured } from '../../lib/config';
import { categories } from '../../data';
import {
  createCategorySpot,
  createDestination,
  createItinerary,
  createRoute,
  deleteCategorySpot,
  deleteDestination,
  deleteItinerary,
  deleteRoute,
  fetchAdminCategorySpots,
  fetchAdminDestinations,
  fetchAdminItineraries,
  fetchAdminMetrics,
  fetchAdminRoutes,
  importDemoCategorySpots,
  updateCategorySpot,
  updateDestination,
  updateItinerary,
  updateRoute,
} from '../../services/adminApi';
import type {
  AdminCategorySpot,
  AdminDestination,
  AdminItinerary,
  AdminMetrics,
  AdminRoute,
  CategorySpotInput,
  DestinationInput,
  ItineraryInput,
  RouteInput,
} from '../../types/admin';
import { CategorySpotForm } from './CategorySpotForm';
import { DestinationForm } from './DestinationForm';
import { ItineraryForm } from './ItineraryForm';
import { RouteForm } from './RouteForm';

type AdminTab = 'Destinations' | 'Itineraries' | 'Routes' | 'Category cards';

type AdminDashboardProps = {
  onSignOut: () => void;
};

function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </article>
  );
}

export function AdminDashboard({ onSignOut }: AdminDashboardProps) {
  const { signOut, displayName } = useAuth();
  const { refresh: refreshPublicData } = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>('Destinations');
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [itineraries, setItineraries] = useState<AdminItinerary[]>([]);
  const [routes, setRoutes] = useState<AdminRoute[]>([]);
  const [categoryCards, setCategoryCards] = useState<AdminCategorySpot[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<AdminDestination | null>(null);
  const [editingItinerary, setEditingItinerary] = useState<AdminItinerary | null>(null);
  const [editingRoute, setEditingRoute] = useState<AdminRoute | null>(null);
  const [editingCategoryCard, setEditingCategoryCard] = useState<AdminCategorySpot | null>(null);

  const loadAll = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setError('Connect Supabase to manage live content from the admin dashboard.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [nextDestinations, nextItineraries, nextRoutes, nextCategoryCards, nextMetrics] =
        await Promise.all([
        fetchAdminDestinations(),
        fetchAdminItineraries(),
        fetchAdminRoutes(),
        fetchAdminCategorySpots(),
        fetchAdminMetrics(),
      ]);

      setDestinations(nextDestinations);
      setItineraries(nextItineraries);
      setRoutes(nextRoutes);
      setCategoryCards(nextCategoryCards);
      setMetrics(nextMetrics);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load admin data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const afterMutation = async (successMessage: string) => {
    setMessage(successMessage);
    await Promise.all([loadAll(), refreshPublicData()]);
    window.setTimeout(() => setMessage(''), 3200);
  };

  const openCreate = () => {
    setEditingDestination(null);
    setEditingItinerary(null);
    setEditingRoute(null);
    setEditingCategoryCard(null);
    setModalOpen(true);
  };

  const openEditDestination = (item: AdminDestination) => {
    setEditingDestination(item);
    setEditingItinerary(null);
    setEditingRoute(null);
    setEditingCategoryCard(null);
    setModalOpen(true);
  };

  const openEditItinerary = (item: AdminItinerary) => {
    setEditingItinerary(item);
    setEditingDestination(null);
    setEditingRoute(null);
    setEditingCategoryCard(null);
    setModalOpen(true);
  };

  const openEditRoute = (item: AdminRoute) => {
    setEditingRoute(item);
    setEditingDestination(null);
    setEditingItinerary(null);
    setEditingCategoryCard(null);
    setModalOpen(true);
  };

  const openEditCategoryCard = (item: AdminCategorySpot) => {
    setEditingCategoryCard(item);
    setEditingDestination(null);
    setEditingItinerary(null);
    setEditingRoute(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingDestination(null);
    setEditingItinerary(null);
    setEditingRoute(null);
    setEditingCategoryCard(null);
  };

  const handleDelete = async (label: string, action: () => Promise<void>) => {
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
      return;
    }

    try {
      await action();
      await afterMutation(`${label} deleted.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Delete failed.');
    }
  };

  const filteredDestinations = useMemo(() => {
    return destinations.filter((item) => {
      const matchesSearch =
        !search ||
        [item.title, item.location, item.region, item.slug].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [destinations, search, statusFilter]);

  const filteredItineraries = useMemo(() => {
    return itineraries.filter((item) => {
      const matchesSearch =
        !search ||
        [item.title, item.route, item.style, item.id].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [itineraries, search, statusFilter]);

  const filteredRoutes = useMemo(() => {
    return routes.filter((item) => {
      const matchesSearch =
        !search ||
        [item.name, item.routeType, item.distance].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [routes, search, statusFilter]);

  const filteredCategoryCards = useMemo(() => {
    return categoryCards.filter((item) => {
      const matchesSearch =
        !search ||
        [item.title, item.location, item.categoryId, item.id]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryCards, search, statusFilter, categoryFilter]);

  const statusOptions =
    activeTab === 'Itineraries'
      ? ['all', 'live', 'draft', 'review']
      : activeTab === 'Routes'
        ? ['all', 'active', 'draft']
        : ['all', 'published', 'draft', 'review'];

  const createLabel =
    activeTab === 'Category cards' ? 'card' : activeTab.slice(0, -1).toLowerCase();

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
  };

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <Brand className="brand admin-brand" />
        {(['Destinations', 'Itineraries', 'Routes', 'Category cards'] as const).map((item) => (
          <button
            key={item}
            className={activeTab === item ? 'active' : ''}
            onClick={() => {
              setActiveTab(item);
              setSearch('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
            type="button"
          >
            {item}
          </button>
        ))}
        <button className="admin-signout" onClick={handleSignOut} type="button">
          Sign out
        </button>
      </aside>

      <div className="admin-main">
        <div className="admin-topline">
          <div>
            <span className="eyebrow">Admin dashboard</span>
            <h1>Manage {activeTab.toLowerCase()}</h1>
            {displayName ? <p className="admin-user-label">Signed in as {displayName}</p> : null}
          </div>
          <div className="admin-topline-actions">
            {activeTab === 'Category cards' && categoryCards.length === 0 ? (
              <button
                className="secondary-button"
                disabled={!isSupabaseConfigured()}
                onClick={() =>
                  void (async () => {
                    try {
                      const count = await importDemoCategorySpots();
                      await afterMutation(`Imported ${count} demo category cards.`);
                    } catch (importError) {
                      setError(importError instanceof Error ? importError.message : 'Import failed.');
                    }
                  })()
                }
                type="button"
              >
                Import demo cards
              </button>
            ) : null}
            <button className="primary-button" disabled={!isSupabaseConfigured()} onClick={openCreate} type="button">
              Create {createLabel}
            </button>
          </div>
        </div>

        {message ? <p className="admin-banner admin-banner--success">{message}</p> : null}
        {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}

        <div className="metric-grid">
          <MetricCard
            label="Published destinations"
            trend={`${metrics?.draftDestinations ?? 0} drafts`}
            value={String(metrics?.publishedDestinations ?? 0).padStart(2, '0')}
          />
          <MetricCard
            label="Live itineraries"
            trend={`${itineraries.length} total`}
            value={String(metrics?.liveItineraries ?? 0).padStart(2, '0')}
          />
          <MetricCard
            label="Category cards live"
            trend={`${categoryCards.length} total`}
            value={String(metrics?.publishedCategoryCards ?? 0).padStart(2, '0')}
          />
          <MetricCard
            label="Active routes"
            trend={`${routes.length} total`}
            value={String(metrics?.activeRoutes ?? 0).padStart(2, '0')}
          />
        </div>

        <div className="table-card">
          <div className="table-toolbar">
            <label>
              Search records
              <input
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={search}
              />
            </label>
            <label>
              Status
              <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All statuses' : option}
                  </option>
                ))}
              </select>
            </label>
            {activeTab === 'Category cards' ? (
              <label>
                Category
                <select onChange={(event) => setCategoryFilter(event.target.value)} value={categoryFilter}>
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          {loading ? (
            <p className="admin-empty">Loading {activeTab.toLowerCase()}...</p>
          ) : activeTab === 'Destinations' ? (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No destinations found.</td>
                    </tr>
                  ) : (
                    filteredDestinations.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.title}</strong>
                          <small>{item.slug}</small>
                        </td>
                        <td>
                          {item.location}
                          <small>{item.region}</small>
                        </td>
                        <td>{item.experienceType}</td>
                        <td>
                          <span className={`admin-status admin-status--${item.status}`}>{item.status}</span>
                        </td>
                        <td className="admin-actions">
                          <button onClick={() => openEditDestination(item)} type="button">
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDelete(item.title, () => deleteDestination(item.id))}
                            type="button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'Itineraries' ? (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Route</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItineraries.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No itineraries found.</td>
                    </tr>
                  ) : (
                    filteredItineraries.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.title}</strong>
                          <small>
                            {item.duration} · {item.days.length} days
                          </small>
                        </td>
                        <td>{item.route}</td>
                        <td>{item.price}</td>
                        <td>
                          <span className={`admin-status admin-status--${item.status}`}>{item.status}</span>
                        </td>
                        <td className="admin-actions">
                          <button onClick={() => openEditItinerary(item)} type="button">
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDelete(item.title, () => deleteItinerary(item.id))}
                            type="button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'Routes' ? (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Type</th>
                    <th>Distance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No routes found.</td>
                    </tr>
                  ) : (
                    filteredRoutes.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>{item.routeType}</td>
                        <td>{item.distance}</td>
                        <td>
                          <span className={`admin-status admin-status--${item.status}`}>{item.status}</span>
                        </td>
                        <td className="admin-actions">
                          <button onClick={() => openEditRoute(item)} type="button">
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDelete(item.name, () => deleteRoute(item.id))}
                            type="button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategoryCards.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No category cards found.</td>
                    </tr>
                  ) : (
                    filteredCategoryCards.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.title}</strong>
                          <small>{item.id}</small>
                        </td>
                        <td>{item.categoryId}</td>
                        <td>
                          {item.location}
                          <small>{item.budget}</small>
                        </td>
                        <td>
                          <span className={`admin-status admin-status--${item.status}`}>{item.status}</span>
                        </td>
                        <td className="admin-actions">
                          <button onClick={() => openEditCategoryCard(item)} type="button">
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              void handleDelete(item.title, () => deleteCategorySpot(item.id))
                            }
                            type="button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && activeTab === 'Destinations' ? (
        <DestinationForm
          initial={editingDestination}
          onClose={closeModal}
          onSave={async (input: DestinationInput) => {
            if (editingDestination) {
              await updateDestination(editingDestination.id, input);
              await afterMutation('Destination updated.');
              return;
            }

            await createDestination(input);
            await afterMutation('Destination created.');
          }}
        />
      ) : null}

      {modalOpen && activeTab === 'Itineraries' ? (
        <ItineraryForm
          initial={editingItinerary}
          onClose={closeModal}
          onSave={async (input: ItineraryInput) => {
            if (editingItinerary) {
              await updateItinerary(input);
              await afterMutation('Itinerary updated.');
              return;
            }

            await createItinerary(input);
            await afterMutation('Itinerary created.');
          }}
        />
      ) : null}

      {modalOpen && activeTab === 'Routes' ? (
        <RouteForm
          initial={editingRoute}
          onClose={closeModal}
          onSave={async (input: RouteInput) => {
            if (editingRoute) {
              await updateRoute(editingRoute.id, input);
              await afterMutation('Route updated.');
              return;
            }

            await createRoute(input);
            await afterMutation('Route created.');
          }}
        />
      ) : null}

      {modalOpen && activeTab === 'Category cards' ? (
        <CategorySpotForm
          defaultCategoryId={categoryFilter !== 'all' ? categoryFilter : undefined}
          initial={editingCategoryCard}
          onClose={closeModal}
          onSave={async (input: CategorySpotInput) => {
            if (editingCategoryCard) {
              await updateCategorySpot(input);
              await afterMutation('Category card updated.');
              return;
            }

            await createCategorySpot(input);
            await afterMutation('Category card created.');
          }}
        />
      ) : null}
    </section>
  );
}
