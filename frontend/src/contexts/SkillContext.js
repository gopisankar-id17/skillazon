import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SkillContext = createContext();

// Initial state
const initialState = {
  skills: [],
  userSkills: [],
  categories: [
    'Programming', 'Design', 'Languages', 'Music', 'Art', 'Sports',
    'Business', 'Marketing', 'Writing', 'Photography', 'Cooking',
    'Fitness', 'Academic', 'Other'
  ],
  loading: false,
  error: null,
  currentSkill: null,
  filters: {
    category: '',
    level: '',
    priceRange: { min: 0, max: 1000 },
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  }
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SKILLS: 'SET_SKILLS',
  SET_USER_SKILLS: 'SET_USER_SKILLS',
  SET_CURRENT_SKILL: 'SET_CURRENT_SKILL',
  ADD_SKILL: 'ADD_SKILL',
  UPDATE_SKILL: 'UPDATE_SKILL',
  DELETE_SKILL: 'DELETE_SKILL',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const skillReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_SKILLS:
      return { 
        ...state, 
        skills: action.payload.skills,
        pagination: action.payload.pagination || state.pagination,
        loading: false 
      };
    
    case actionTypes.SET_USER_SKILLS:
      return { ...state, userSkills: action.payload, loading: false };
    
    case actionTypes.SET_CURRENT_SKILL:
      return { ...state, currentSkill: action.payload, loading: false };
    
    case actionTypes.ADD_SKILL:
      return { 
        ...state, 
        skills: [action.payload, ...state.skills],
        userSkills: [action.payload, ...state.userSkills]
      };
    
    case actionTypes.UPDATE_SKILL:
      return {
        ...state,
        skills: state.skills.map(skill =>
          skill._id === action.payload._id ? action.payload : skill
        ),
        userSkills: state.userSkills.map(skill =>
          skill._id === action.payload._id ? action.payload : skill
        ),
        currentSkill: state.currentSkill?._id === action.payload._id 
          ? action.payload 
          : state.currentSkill
      };
    
    case actionTypes.DELETE_SKILL:
      return {
        ...state,
        skills: state.skills.filter(skill => skill._id !== action.payload),
        userSkills: state.userSkills.filter(skill => skill._id !== action.payload)
      };
    
    case actionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case actionTypes.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Skill Provider Component
export const SkillProvider = ({ children }) => {
  const [state, dispatch] = useReducer(skillReducer, initialState);
  const { user, token } = useAuth();

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3004';

  // Helper function to make API calls
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return data;
  };

  // Fetch all skills with filters
  const fetchSkills = async (filters = {}, page = 1) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: state.pagination.itemsPerPage.toString(),
        ...filters
      });

      const data = await apiCall(`/api/skills?${queryParams}`);
      
      dispatch({ 
        type: actionTypes.SET_SKILLS, 
        payload: {
          skills: data.data.skills,
          pagination: data.data.pagination
        }
      });
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Fetch user's skills
  const fetchUserSkills = async () => {
    if (!user || !token) return;
    
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const data = await apiCall(`/api/skills/teacher/${user.id}`);
      
      dispatch({ 
        type: actionTypes.SET_USER_SKILLS, 
        payload: data.data.skills 
      });
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Fetch skill by ID
  const fetchSkillById = async (skillId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const data = await apiCall(`/api/skills/${skillId}`);
      
      dispatch({ 
        type: actionTypes.SET_CURRENT_SKILL, 
        payload: data.data 
      });
      
      return data.data;
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Create new skill
  const createSkill = async (skillData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const data = await apiCall('/api/skills', {
        method: 'POST',
        body: JSON.stringify(skillData)
      });
      
      dispatch({ 
        type: actionTypes.ADD_SKILL, 
        payload: data.data 
      });
      
      return data.data;
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Update skill
  const updateSkill = async (skillId, skillData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const data = await apiCall(`/api/skills/${skillId}`, {
        method: 'PUT',
        body: JSON.stringify(skillData)
      });
      
      dispatch({ 
        type: actionTypes.UPDATE_SKILL, 
        payload: data.data 
      });
      
      return data.data;
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Delete skill
  const deleteSkill = async (skillId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      await apiCall(`/api/skills/${skillId}`, {
        method: 'DELETE'
      });
      
      dispatch({ 
        type: actionTypes.DELETE_SKILL, 
        payload: skillId 
      });
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Search skills
  const searchSkills = async (searchQuery, filters = {}) => {
    return fetchSkills({ search: searchQuery, ...filters });
  };

  // Get skills by category
  const getSkillsByCategory = async (category) => {
    return fetchSkills({ category });
  };

  // Get top-rated skills
  const getTopRatedSkills = async (limit = 6) => {
    try {
      const data = await apiCall(`/api/skills/featured/top-rated?limit=${limit}`);
      return data.data;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: newFilters });
  };

  // Update pagination
  const updatePagination = (newPagination) => {
    dispatch({ type: actionTypes.SET_PAGINATION, payload: newPagination });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  // Load initial data
  useEffect(() => {
    fetchSkills();
  }, []);

  // Load user skills when user changes
  useEffect(() => {
    if (user && token) {
      fetchUserSkills();
    }
  }, [user, token]);

  const value = {
    // State
    ...state,
    
    // Actions
    fetchSkills,
    fetchUserSkills,
    fetchSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
    searchSkills,
    getSkillsByCategory,
    getTopRatedSkills,
    updateFilters,
    updatePagination,
    clearError
  };

  return (
    <SkillContext.Provider value={value}>
      {children}
    </SkillContext.Provider>
  );
};

// Custom hook to use Skill context
export const useSkills = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error('useSkills must be used within a SkillProvider');
  }
  return context;
};

export default SkillContext;
