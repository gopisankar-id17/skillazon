import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

// Initial state
const initialState = {
  bookings: [],
  upcomingBookings: [],
  pastBookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  stats: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_BOOKINGS: 'SET_BOOKINGS',
  SET_UPCOMING_BOOKINGS: 'SET_UPCOMING_BOOKINGS',
  SET_PAST_BOOKINGS: 'SET_PAST_BOOKINGS',
  SET_CURRENT_BOOKING: 'SET_CURRENT_BOOKING',
  ADD_BOOKING: 'ADD_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  SET_STATS: 'SET_STATS',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const bookingReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_BOOKINGS:
      return { ...state, bookings: action.payload, loading: false };
    
    case actionTypes.SET_UPCOMING_BOOKINGS:
      return { ...state, upcomingBookings: action.payload, loading: false };
    
    case actionTypes.SET_PAST_BOOKINGS:
      return { ...state, pastBookings: action.payload, loading: false };
    
    case actionTypes.SET_CURRENT_BOOKING:
      return { ...state, currentBooking: action.payload, loading: false };
    
    case actionTypes.ADD_BOOKING:
      return { 
        ...state, 
        bookings: [action.payload, ...state.bookings],
        upcomingBookings: [action.payload, ...state.upcomingBookings]
      };
    
    case actionTypes.UPDATE_BOOKING:
      const updatedBooking = action.payload;
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        ),
        upcomingBookings: state.upcomingBookings.map(booking =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        ),
        pastBookings: state.pastBookings.map(booking =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        ),
        currentBooking: state.currentBooking?._id === updatedBooking._id 
          ? updatedBooking 
          : state.currentBooking
      };
    
    case actionTypes.SET_STATS:
      return { ...state, stats: action.payload };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Booking Provider Component
export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const { user, token } = useAuth();

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003';

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

  // Create new booking
  const createBooking = async (bookingData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const data = await apiCall('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
      
      dispatch({ 
        type: actionTypes.ADD_BOOKING, 
        payload: data.data 
      });
      
      return data.data;
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Fetch user's bookings
  const fetchMyBookings = async (type = 'all', status = null) => {
    if (!user || !token) return;
    
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const queryParams = new URLSearchParams({ type });
      if (status) queryParams.append('status', status);
      
      const data = await apiCall(`/api/bookings/my-bookings?${queryParams}`);
      
      dispatch({ 
        type: actionTypes.SET_BOOKINGS, 
        payload: data.data.bookings 
      });
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Fetch upcoming bookings
  const fetchUpcomingBookings = async (as = 'both') => {
    if (!user || !token) return;
    
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const data = await apiCall(`/api/bookings/upcoming?as=${as}`);
      
      dispatch({ 
        type: actionTypes.SET_UPCOMING_BOOKINGS, 
        payload: data.data 
      });
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Fetch booking by ID
  const fetchBookingById = async (bookingId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const data = await apiCall(`/api/bookings/${bookingId}`);
      
      dispatch({ 
        type: actionTypes.SET_CURRENT_BOOKING, 
        payload: data.data 
      });
      
      return data.data;
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Confirm booking (teacher only)
  const confirmBooking = async (bookingId, confirmationData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const data = await apiCall(`/api/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        body: JSON.stringify(confirmationData)
      });
      
      dispatch({ 
        type: actionTypes.UPDATE_BOOKING, 
        payload: data.data 
      });
      
      return data.data;
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId, reason) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const data = await apiCall(`/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });
      
      dispatch({ 
        type: actionTypes.UPDATE_BOOKING, 
        payload: data.data 
      });
      
      return data.data;
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Complete booking (teacher only)
  const completeBooking = async (bookingId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const data = await apiCall(`/api/bookings/${bookingId}/complete`, {
        method: 'PATCH'
      });
      
      dispatch({ 
        type: actionTypes.UPDATE_BOOKING, 
        payload: data.data 
      });
      
      return data.data;
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Fetch booking statistics
  const fetchBookingStats = async (as = 'both') => {
    if (!user || !token) return;
    
    try {
      const data = await apiCall(`/api/bookings/stats/user?as=${as}`);
      
      dispatch({ 
        type: actionTypes.SET_STATS, 
        payload: data.data 
      });
      
      return data.data;
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  // Helper functions
  const getBookingsByStatus = (status) => {
    return state.bookings.filter(booking => booking.status === status);
  };

  const getUpcomingBookingsCount = () => {
    return state.upcomingBookings.length;
  };

  const getPendingBookingsCount = () => {
    return state.bookings.filter(booking => booking.status === 'pending').length;
  };

  // Load initial data when user changes
  useEffect(() => {
    if (user && token) {
      fetchUpcomingBookings();
      fetchBookingStats();
    }
  }, [user, token]);

  const value = {
    // State
    ...state,
    
    // Actions
    createBooking,
    fetchMyBookings,
    fetchUpcomingBookings,
    fetchBookingById,
    confirmBooking,
    cancelBooking,
    completeBooking,
    fetchBookingStats,
    clearError,
    
    // Helper functions
    getBookingsByStatus,
    getUpcomingBookingsCount,
    getPendingBookingsCount
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use Booking context
export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
