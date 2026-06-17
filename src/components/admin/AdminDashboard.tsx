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
  deleteCommunityPost,
  deleteDestination,
  deleteItinerary,
  deleteRoute,
  deleteSpotInquiry,
  fetchAdminCategorySpots,
  fetchAdminCommunityPosts,
  fetchAdminDestinations,
  fetchAdminItineraries,
  fetchAdminMetrics,
  fetchAdminRoutes,
  fetchAdminSpotInquiries,
  importDemoCategorySpots,
  markSpotInquirySeen,
  updateCategorySpot,
  updateCommunityPostModeration,
  updateDestination,
  updateItinerary,
  updateRoute,
  updateSpotInquiryStatus,
} from '../../services/adminApi';
import type {
  AdminCategorySpot,
  AdminCommunityPost,
  AdminDestination,
  AdminItinerary,
  AdminMetrics,
  AdminRoute,
  AdminSpotInquiry,
  CategorySpotInput,
  DestinationInput,
  ItineraryInput,
  RouteInput,
} from '../../types/admin';
import { CategorySpotForm } from './CategorySpotForm';
import { DestinationForm } from './DestinationForm';
import { ItineraryForm } from './ItineraryForm';
import { RouteForm } from './RouteForm';

type AdminTab =
  | 'Destinations'
  | 'Itineraries'
  | 'Routes'
  | 'Category cards'
  | 'Community'
  | 'Inquiries';

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
  const [communityPosts, setCommunityPosts] = useState<AdminCommunityPost[]>([]);
  const [spotInquiries, setSpotInquiries] = useState<AdminSpotInquiry[]>([]);
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
      const [nextDestinations, nextItineraries, nextRoutes, nextCategoryCards, nextCommunityPosts, nextMetrics] =
        await Promise.all([
          fetchAdminDestinations(),
          fetchAdminItineraries(),
          fetchAdminRoutes(),
          fetchAdminCategorySpots(),
          fetchAdminCommunityPosts(),
          fetchAdminMetrics(),
        ]);

      let nextSpotInquiries: AdminSpotInquiry[] = [];
      try {
        nextSpotInquiries = await fetchAdminSpotInquiries();
      } catch (inquiryLoadError) {
        console.warn('Spot inquiries unavailable:', inquiryLoadError);
      }

      setDestinations(nextDestinations);
      setItineraries(nextItineraries);
      setRoutes(nextRoutes);
      setCategoryCards(nextCategoryCards);
      setCommunityPosts(nextCommunityPosts);
      setSpotInquiries(nextSpotInquiries);
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

  const destinationInputFromAdmin = (item: AdminDestination): DestinationInput => {
    const { id: _id, updatedAt: _updatedAt, ...rest } = item;
    return rest;
  };

  const itineraryInputFromAdmin = (item: AdminItinerary): ItineraryInput => {
    const { updatedAt: _updatedAt, ...rest } = item;
    return rest;
  };

  const toggleDestinationFeatured = async (item: AdminDestination) => {
    try {
      await updateDestination(item.id, {
        ...destinationInputFromAdmin(item),
        featuredOnHome: !item.featuredOnHome,
      });
      await afterMutation(
        item.featuredOnHome ? 'Removed from featured destinations.' : 'Added to featured destinations.',
      );
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Could not update featured status.');
    }
  };

  const toggleDestinationTrending = async (item: AdminDestination) => {
    try {
      await updateDestination(item.id, {
        ...destinationInputFromAdmin(item),
        trendingOnHome: !item.trendingOnHome,
      });
      await afterMutation(
        item.trendingOnHome ? 'Removed from trending this week.' : 'Added to trending this week.',
      );
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Could not update trending status.');
    }
  };

  const toggleItineraryFeatured = async (item: AdminItinerary) => {
    try {
      await updateItinerary({
        ...itineraryInputFromAdmin(item),
        featuredOnHome: !item.featuredOnHome,
      });
      await afterMutation(
        item.featuredOnHome ? 'Removed from popular itineraries.' : 'Added to popular itineraries.',
      );
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Could not update featured status.');
    }
  };

  const toggleCommunityPin = async (item: AdminCommunityPost) => {
    try {
      await updateCommunityPostModeration(item.id, { isPinned: !item.isPinned });
      await afterMutation(item.isPinned ? 'Post unpinned.' : 'Post pinned.');
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Could not update pin status.');
    }
  };

  const toggleCommunityVisibility = async (item: AdminCommunityPost) => {
    try {
      await updateCommunityPostModeration(item.id, {
        status: item.status === 'published' ? 'hidden' : 'published',
      });
      await afterMutation(item.status === 'published' ? 'Post hidden.' : 'Post published.');
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Could not update post status.');
    }
  };

  const markInquirySeen = async (item: AdminSpotInquiry) => {
    if (item.adminSeen) {
      return;
    }

    try {
      await markSpotInquirySeen(item.id);
      await afterMutation('Inquiry marked as seen.');
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Could not mark inquiry as seen.');
    }
  };

  const toggleInquiryVisibility = async (item: AdminSpotInquiry) => {
    try {
      await updateSpotInquiryStatus(item.id, item.status === 'published' ? 'hidden' : 'published');
      await afterMutation(item.status === 'published' ? 'Inquiry hidden.' : 'Inquiry published.');
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Could not update inquiry.');
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

  const filteredCommunityPosts = useMemo(() => {
    return communityPosts.filter((item) => {
      const matchesSearch =
        !search ||
        [item.authorName, item.message, item.kind].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [communityPosts, search, statusFilter]);

  const filteredSpotInquiries = useMemo(() => {
    return spotInquiries.filter((item) => {
      const matchesSearch =
        !search ||
        [item.authorName, item.message, item.spotTitle, item.categoryId, item.spotId]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unseen' ? !item.adminSeen : item.status === statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [spotInquiries, search, statusFilter]);

  const unseenInquiryCount = metrics?.unseenSpotInquiries ?? spotInquiries.filter((item) => !item.adminSeen).length;

  const statusOptions =
    activeTab === 'Itineraries'
      ? ['all', 'live', 'draft', 'review']
      : activeTab === 'Routes'
        ? ['all', 'active', 'draft']
        : activeTab === 'Community'
          ? ['all', 'published', 'hidden']
          : activeTab === 'Inquiries'
            ? ['all', 'unseen', 'published', 'hidden']
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
        {(['Destinations', 'Itineraries', 'Routes', 'Category cards', 'Community', 'Inquiries'] as const).map((item) => (
          <button
            key={item}
            className={activeTab === item ? 'active' : ''}
            onClick={() => {
              setActiveTab(item);
              setSearch('');
              setStatusFilter(item === 'Inquiries' && unseenInquiryCount > 0 ? 'unseen' : 'all');
              setCategoryFilter('all');
            }}
            type="button"
          >
            {item}
            {item === 'Inquiries' && unseenInquiryCount > 0 ? (
              <span className="admin-nav-badge">{unseenInquiryCount}</span>
            ) : null}
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
            <button
              className="primary-button"
              disabled={!isSupabaseConfigured()}
              onClick={() =>
                activeTab === 'Community' || activeTab === 'Inquiries' ? void loadAll() : openCreate()
              }
              type="button"
            >
              {activeTab === 'Community' || activeTab === 'Inquiries' ? 'Refresh' : `Create ${createLabel}`}
            </button>
          </div>
        </div>

        {message ? <p className="admin-banner admin-banner--success">{message}</p> : null}
        {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
        {unseenInquiryCount > 0 ? (
          <p className="admin-banner admin-banner--prompt">
            {unseenInquiryCount} new spot inquir{unseenInquiryCount === 1 ? 'y' : 'ies'} waiting in the
            Inquiries tab.
          </p>
        ) : null}

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
            label="New inquiries"
            trend={`${spotInquiries.length} total`}
            value={String(unseenInquiryCount).padStart(2, '0')}
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
                    <th>Landing page</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.length === 0 ? (
                    <tr>
                      <td colSpan={6}>No destinations found.</td>
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
                        <td className="admin-landing-toggles">
                          <button
                            className={`admin-feature-toggle ${item.featuredOnHome ? 'active' : ''}`}
                            disabled={!isSupabaseConfigured()}
                            onClick={() => void toggleDestinationFeatured(item)}
                            type="button"
                          >
                            {item.featuredOnHome ? 'Featured ✓' : 'Feature'}
                          </button>
                          <button
                            className={`admin-feature-toggle ${item.trendingOnHome ? 'active' : ''}`}
                            disabled={!isSupabaseConfigured()}
                            onClick={() => void toggleDestinationTrending(item)}
                            type="button"
                          >
                            {item.trendingOnHome ? 'Trending ✓' : 'Trending'}
                          </button>
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
                    <th>Landing page</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItineraries.length === 0 ? (
                    <tr>
                      <td colSpan={6}>No itineraries found.</td>
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
                        <td className="admin-landing-toggles">
                          <button
                            className={`admin-feature-toggle ${item.featuredOnHome ? 'active' : ''}`}
                            disabled={!isSupabaseConfigured()}
                            onClick={() => void toggleItineraryFeatured(item)}
                            type="button"
                          >
                            {item.featuredOnHome ? 'Featured ✓' : 'Feature'}
                          </button>
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
          ) : activeTab === 'Community' ? (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Message</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Moderation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommunityPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6}>No community posts found.</td>
                    </tr>
                  ) : (
                    filteredCommunityPosts.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.authorName}</strong>
                          {item.isPinned ? <small>Pinned</small> : null}
                        </td>
                        <td>{item.message}</td>
                        <td>{item.kind}</td>
                        <td>
                          <span className={`admin-status admin-status--${item.status}`}>{item.status}</span>
                        </td>
                        <td className="admin-landing-toggles">
                          <button
                            className={`admin-feature-toggle ${item.isPinned ? 'active' : ''}`}
                            disabled={!isSupabaseConfigured()}
                            onClick={() => void toggleCommunityPin(item)}
                            type="button"
                          >
                            {item.isPinned ? 'Pinned ✓' : 'Pin'}
                          </button>
                          <button
                            className={`admin-feature-toggle ${item.status === 'hidden' ? 'active' : ''}`}
                            disabled={!isSupabaseConfigured()}
                            onClick={() => void toggleCommunityVisibility(item)}
                            type="button"
                          >
                            {item.status === 'hidden' ? 'Hidden ✓' : 'Hide'}
                          </button>
                        </td>
                        <td className="admin-actions">
                          <button
                            onClick={() => void handleDelete(item.authorName, () => deleteCommunityPost(item.id))}
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
          ) : activeTab === 'Inquiries' ? (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Spot</th>
                    <th>Author</th>
                    <th>Question</th>
                    <th>Answers</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpotInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6}>No spot inquiries found.</td>
                    </tr>
                  ) : (
                    filteredSpotInquiries.map((item) => (
                      <tr key={item.id} className={!item.adminSeen ? 'admin-row--highlight' : ''}>
                        <td>
                          <strong>{item.spotTitle}</strong>
                          <small>
                            {item.categoryId} · {item.spotId}
                          </small>
                          <a
                            href={
                              item.categoryId === 'hiking' && item.spotId.includes('trail')
                                ? `#trail/${item.spotId}`
                                : `#spot/${item.spotId}`
                            }
                          >
                            View spot
                          </a>
                        </td>
                        <td>{item.authorName}</td>
                        <td>{item.message}</td>
                        <td>{item.replyCount}</td>
                        <td>
                          <span className={`admin-status admin-status--${item.status}`}>{item.status}</span>
                          {!item.adminSeen ? <small>New</small> : null}
                        </td>
                        <td className="admin-actions">
                          {!item.adminSeen ? (
                            <button onClick={() => void markInquirySeen(item)} type="button">
                              Mark seen
                            </button>
                          ) : null}
                          <button onClick={() => void toggleInquiryVisibility(item)} type="button">
                            {item.status === 'hidden' ? 'Publish' : 'Hide'}
                          </button>
                          <button
                            onClick={() => void handleDelete(item.spotTitle, () => deleteSpotInquiry(item.id))}
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
          ) : activeTab === 'Category cards' ? (
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
          ) : null}
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
