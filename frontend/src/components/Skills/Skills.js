import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSkills } from '../../contexts/SkillContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MagnifyingGlassIcon as SearchIcon, 
  AdjustmentsVerticalIcon as FilterIcon, 
  StarIcon, 
  ClockIcon, 
  UserIcon,
  XMarkIcon as XIcon,
  AdjustmentsHorizontalIcon as AdjustmentsIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import './Skills.css';

const CATEGORIES = [
  'Programming',
  'Design',
  'Marketing',
  'Music',
  'Language',
  'Fitness',
  'Business',
  'Photography',
  'Cooking',
  'Writing',
  'Art',
  'Technology'
];

const PRICE_RANGES = [
  { label: 'Free', min: 0, max: 0 },
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: Infinity }
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' }
];

const Skills = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { skills, searchSkills, loading, error } = useSkills();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const filters = {
      search: searchTerm,
      category: selectedCategory,
      sort: sortBy,
      minRating: minRating > 0 ? minRating : undefined
    };

    if (selectedPriceRange) {
      const range = PRICE_RANGES.find(r => r.label === selectedPriceRange);
      if (range) {
        filters.minPrice = range.min;
        filters.maxPrice = range.max === Infinity ? undefined : range.max;
      }
    }

    searchSkills(filters);

    // Update URL params
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchTerm, selectedCategory, selectedPriceRange, sortBy, minRating, searchSkills, setSearchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSortBy('newest');
    setMinRating(0);
    setSearchParams({});
  };

  const renderStars = (rating, size = 'sm') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIconSolid 
            key={i} 
            className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400`}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-gray-300`} />
            <StarIconSolid 
              className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400 absolute top-0 left-0`}
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        );
      } else {
        stars.push(
          <StarIcon 
            key={i} 
            className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-gray-300`}
          />
        );
      }
    }

    return stars;
  };

  const SkillCard = ({ skill }) => (
    <Link to={`/skills/${skill._id}`} className="skill-card">
      <div className="skill-card-image">
        {skill.image ? (
          <img src={skill.image} alt={skill.title} />
        ) : (
          <div className="skill-card-placeholder">
            <UserIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="skill-card-category">{skill.category}</div>
      </div>
      
      <div className="skill-card-content">
        <h3 className="skill-card-title">{skill.title}</h3>
        <p className="skill-card-description">{skill.description}</p>
        
        <div className="skill-card-meta">
          <div className="skill-rating">
            <div className="rating-stars">
              {renderStars(skill.averageRating || 0)}
            </div>
            <span className="rating-text">
              {skill.averageRating ? skill.averageRating.toFixed(1) : '0.0'}
              {skill.reviewCount > 0 && ` (${skill.reviewCount})`}
            </span>
          </div>
          
          <div className="skill-duration">
            <ClockIcon className="w-4 h-4" />
            <span>{skill.duration} min</span>
          </div>
        </div>
        
        <div className="skill-card-footer">
          <div className="skill-teacher">
            <div className="teacher-avatar">
              {skill.teacher?.avatar ? (
                <img src={skill.teacher.avatar} alt={skill.teacher.name} />
              ) : (
                <UserIcon className="w-full h-full text-gray-400" />
              )}
            </div>
            <span>{skill.teacher?.name || 'Anonymous'}</span>
          </div>
          
          <div className="skill-price">
            {skill.price === 0 ? 'Free' : `$${skill.price}`}
          </div>
        </div>
      </div>
    </Link>
  );

  const FilterSection = () => (
    <div className={`filters-section ${showFilters ? 'filters-open' : ''}`}>
      <div className="filters-header">
        <h3>Filters</h3>
        <button 
          className="filters-close"
          onClick={() => setShowFilters(false)}
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="filter-group">
        <label className="filter-label">Category</label>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label className="filter-label">Price Range</label>
        <select 
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
          className="filter-select"
        >
          <option value="">Any Price</option>
          {PRICE_RANGES.map(range => (
            <option key={range.label} value={range.label}>{range.label}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label className="filter-label">Minimum Rating</label>
        <div className="rating-filter">
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              className={`rating-button ${minRating >= rating ? 'active' : ''}`}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
            >
              {renderStars(rating)}
              <span>{rating}+</span>
            </button>
          ))}
        </div>
      </div>
      
      <button 
        onClick={clearFilters}
        className="clear-filters-btn"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="skills-page">
      <div className="skills-header">
        <div className="container">
          <h1>Discover Skills</h1>
          <p>Learn from experts in various fields</p>
          
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-group">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search skills, categories, or teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="skills-content">
        <div className="container">
          <div className="skills-layout">
            {/* Desktop Filters Sidebar */}
            <aside className="filters-sidebar desktop-only">
              <FilterSection />
            </aside>

            {/* Main Content */}
            <main className="skills-main">
              <div className="skills-toolbar">
                <div className="toolbar-left">
                  <button 
                    className="filters-toggle mobile-only"
                    onClick={() => setShowFilters(true)}
                  >
                    <FilterIcon className="w-5 h-5" />
                    Filters
                  </button>
                  
                  <span className="results-count">
                    {skills.length} skill{skills.length !== 1 ? 's' : ''} found
                  </span>
                </div>
                
                <div className="toolbar-right">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || selectedCategory || selectedPriceRange || minRating > 0) && (
                <div className="active-filters">
                  <span>Active filters:</span>
                  {searchTerm && (
                    <span className="filter-tag">
                      Search: {searchTerm}
                      <button onClick={() => setSearchTerm('')}>
                        <XIcon className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="filter-tag">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('')}>
                        <XIcon className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {selectedPriceRange && (
                    <span className="filter-tag">
                      Price: {selectedPriceRange}
                      <button onClick={() => setSelectedPriceRange('')}>
                        <XIcon className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="filter-tag">
                      Rating: {minRating}+ stars
                      <button onClick={() => setMinRating(0)}>
                        <XIcon className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  <button onClick={clearFilters} className="clear-all-btn">
                    Clear All
                  </button>
                </div>
              )}

              {/* Skills Grid */}
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading skills...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>Error loading skills: {error}</p>
                  <button onClick={() => window.location.reload()}>
                    Try Again
                  </button>
                </div>
              ) : skills.length === 0 ? (
                <div className="empty-state">
                  <h3>No skills found</h3>
                  <p>Try adjusting your search criteria or filters.</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="skills-grid">
                  {skills.map(skill => (
                    <SkillCard key={skill._id} skill={skill} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="filters-overlay">
          <div className="filters-modal">
            <FilterSection />
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
