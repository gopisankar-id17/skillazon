const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Skill is required']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Duration is required'],
    min: [30, 'Minimum duration is 30 minutes']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    trim: true
  },
  meetingLink: {
    type: String,
    trim: true
  },
  meetingPlatform: {
    type: String,
    enum: ['zoom', 'google-meet', 'jitsi', 'in-person', 'other'],
    default: 'jitsi'
  },
  studentNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  teacherNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  rating: {
    studentRating: {
      type: Number,
      min: 1,
      max: 5
    },
    teacherRating: {
      type: Number,
      min: 1,
      max: 5
    },
    studentReview: {
      type: String,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    teacherReview: {
      type: String,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
bookingSchema.index({ teacher: 1, scheduledDate: 1 });
bookingSchema.index({ student: 1, scheduledDate: 1 });
bookingSchema.index({ skill: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ scheduledDate: 1 });

// Virtuals
bookingSchema.virtual('isUpcoming').get(function() {
  return this.scheduledDate > new Date() && this.status === 'confirmed';
});

bookingSchema.virtual('isPast').get(function() {
  return this.scheduledDate < new Date();
});

bookingSchema.virtual('canCancel').get(function() {
  // Can cancel if it's at least 24 hours before the session
  const twentyFourHours = 24 * 60 * 60 * 1000;
  return (this.scheduledDate - new Date()) > twentyFourHours && 
         ['pending', 'confirmed'].includes(this.status);
});

// Methods
bookingSchema.methods.confirm = function() {
  this.status = 'confirmed';
  return this.save();
};

bookingSchema.methods.cancel = function(userId, reason) {
  this.status = 'cancelled';
  this.cancelledBy = userId;
  this.cancellationReason = reason;
  return this.save();
};

bookingSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

bookingSchema.methods.addRating = function(ratingData, userType) {
  if (userType === 'student') {
    this.rating.studentRating = ratingData.rating;
    this.rating.studentReview = ratingData.review;
  } else if (userType === 'teacher') {
    this.rating.teacherRating = ratingData.rating;
    this.rating.teacherReview = ratingData.review;
  }
  return this.save();
};

// Static methods
bookingSchema.statics.findUpcoming = function(userId, userType) {
  const query = {
    status: 'confirmed',
    scheduledDate: { $gt: new Date() }
  };
  
  if (userType === 'teacher') {
    query.teacher = userId;
  } else {
    query.student = userId;
  }
  
  return this.find(query)
    .populate('skill', 'title category duration')
    .populate('teacher', 'username email firstName lastName')
    .populate('student', 'username email firstName lastName')
    .sort({ scheduledDate: 1 });
};

bookingSchema.statics.findPast = function(userId, userType) {
  const query = {
    status: { $in: ['completed', 'no-show'] },
    scheduledDate: { $lt: new Date() }
  };
  
  if (userType === 'teacher') {
    query.teacher = userId;
  } else {
    query.student = userId;
  }
  
  return this.find(query)
    .populate('skill', 'title category duration')
    .populate('teacher', 'username email firstName lastName')
    .populate('student', 'username email firstName lastName')
    .sort({ scheduledDate: -1 });
};

bookingSchema.statics.getBookingStats = function(userId, userType) {
  const matchStage = userType === 'teacher' 
    ? { teacher: new mongoose.Types.ObjectId(userId) }
    : { student: new mongoose.Types.ObjectId(userId) };

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalEarnings: { $sum: '$price' }
      }
    }
  ]);
};

module.exports = mongoose.model('Booking', bookingSchema);
