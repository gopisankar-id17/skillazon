const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Skill = require('../models/Skill');
const User = require('../models/SkillazonUser');
const authenticateToken = require('../middleware/authenticateToken');

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    const { skillId, scheduledDate, message, duration } = req.body;

    // Validate required fields
    if (!skillId || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Skill ID and scheduled date are required'
      });
    }

    // Check if skill exists and is active
    const skill = await Skill.findById(skillId).populate('teacher');
    if (!skill || !skill.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found or not available'
      });
    }

    // Prevent self-booking
    if (skill.teacher._id.toString() === studentId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own skill'
      });
    }

    // Check if the scheduled date is in the future
    const bookingDate = new Date(scheduledDate);
    if (bookingDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Booking date must be in the future'
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      teacher: skill.teacher._id,
      scheduledDate: {
        $gte: new Date(bookingDate.getTime() - (duration || skill.duration) * 60000),
        $lte: new Date(bookingDate.getTime() + (duration || skill.duration) * 60000)
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is not available'
      });
    }

    // Create booking
    const booking = new Booking({
      skill: skillId,
      teacher: skill.teacher._id,
      student: studentId,
      scheduledDate: bookingDate,
      duration: duration || skill.duration,
      message: message || '',
      price: skill.price
    });

    await booking.save();

    // Populate booking details
    await booking.populate([
      { path: 'skill', select: 'title category duration price' },
      { path: 'teacher', select: 'username firstName lastName email profile' },
      { path: 'student', select: 'username firstName lastName email profile' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type = 'all', status, page = 1, limit = 10 } = req.query;

    let query = {};
    
    // Filter by user type
    if (type === 'as-teacher') {
      query.teacher = userId;
    } else if (type === 'as-student') {
      query.student = userId;
    } else {
      query.$or = [{ teacher: userId }, { student: userId }];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('skill', 'title category duration price')
      .populate('teacher', 'username firstName lastName email profile')
      .populate('student', 'username firstName lastName email profile')
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Get upcoming bookings
router.get('/upcoming', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { as = 'both' } = req.query;

    let bookings;
    if (as === 'teacher') {
      bookings = await Booking.findUpcoming(userId, 'teacher');
    } else if (as === 'student') {
      bookings = await Booking.findUpcoming(userId, 'student');
    } else {
      const teacherBookings = await Booking.findUpcoming(userId, 'teacher');
      const studentBookings = await Booking.findUpcoming(userId, 'student');
      bookings = [...teacherBookings, ...studentBookings].sort((a, b) => 
        new Date(a.scheduledDate) - new Date(b.scheduledDate)
      );
    }

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching upcoming bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming bookings',
      error: error.message
    });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId)
      .populate('skill', 'title category duration price description')
      .populate('teacher', 'username firstName lastName email profile stats')
      .populate('student', 'username firstName lastName email profile');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is involved in this booking
    if (booking.teacher._id.toString() !== userId && 
        booking.student._id.toString() !== userId && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// Confirm booking (teacher only)
router.patch('/:id/confirm', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;
    const { meetingLink, meetingPlatform, teacherNotes } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the teacher
    if (booking.teacher.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the teacher can confirm this booking'
      });
    }

    // Check if booking can be confirmed
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be confirmed'
      });
    }

    // Update booking
    booking.status = 'confirmed';
    if (meetingLink) booking.meetingLink = meetingLink;
    if (meetingPlatform) booking.meetingPlatform = meetingPlatform;
    if (teacherNotes) booking.teacherNotes = teacherNotes;

    await booking.save();

    await booking.populate([
      { path: 'skill', select: 'title category duration' },
      { path: 'teacher', select: 'username firstName lastName email' },
      { path: 'student', select: 'username firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming booking',
      error: error.message
    });
  }
});

// Cancel booking
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is involved in this booking
    if (booking.teacher.toString() !== userId && booking.student.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (!booking.canCancel) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled (less than 24 hours before session or already completed)'
      });
    }

    await booking.cancel(userId, reason);

    await booking.populate([
      { path: 'skill', select: 'title category duration' },
      { path: 'teacher', select: 'username firstName lastName email' },
      { path: 'student', select: 'username firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

// Complete booking
router.patch('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the teacher
    if (booking.teacher.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the teacher can mark this booking as completed'
      });
    }

    // Check if booking can be completed
    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed bookings can be completed'
      });
    }

    await booking.complete();

    // Update skill session count
    const skill = await Skill.findById(booking.skill);
    if (skill) {
      await skill.incrementSessions();
    }

    // Update user stats
    const teacher = await User.findById(booking.teacher);
    const student = await User.findById(booking.student);
    
    if (teacher) {
      await teacher.updateStats('totalSessionsAsTeacher', 1);
      await teacher.updateStats('totalEarnings', booking.price);
    }
    
    if (student) {
      await student.updateStats('totalSessionsAsStudent', 1);
    }

    await booking.populate([
      { path: 'skill', select: 'title category duration' },
      { path: 'teacher', select: 'username firstName lastName email' },
      { path: 'student', select: 'username firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: 'Booking completed successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error completing booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing booking',
      error: error.message
    });
  }
});

// Get booking statistics
router.get('/stats/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { as = 'both' } = req.query;

    let stats = {};

    if (as === 'teacher' || as === 'both') {
      const teacherStats = await Booking.getBookingStats(userId, 'teacher');
      stats.asTeacher = teacherStats;
    }

    if (as === 'student' || as === 'both') {
      const studentStats = await Booking.getBookingStats(userId, 'student');
      stats.asStudent = studentStats;
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking stats',
      error: error.message
    });
  }
});

module.exports = router;
