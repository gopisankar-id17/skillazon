const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Skill title is required'],
    trim: true,
    minlength: [3, 'Skill title must be at least 3 characters'],
    maxlength: [100, 'Skill title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Skill description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Programming', 'Design', 'Languages', 'Music', 'Art', 'Sports',
      'Business', 'Marketing', 'Writing', 'Photography', 'Cooking',
      'Fitness', 'Academic', 'Other'
    ]
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required']
  },
  level: {
    type: String,
    required: [true, 'Skill level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Session duration is required'],
    min: [30, 'Minimum session duration is 30 minutes'],
    max: [240, 'Maximum session duration is 4 hours']
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  requirements: {
    type: String,
    trim: true,
    maxlength: [500, 'Requirements cannot exceed 500 characters']
  },
  materials: {
    type: String,
    trim: true,
    maxlength: [500, 'Materials cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  availableSlots: [{
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6 // 0 = Sunday, 6 = Saturday
    },
    startTime: String, // Format: "HH:MM"
    endTime: String,   // Format: "HH:MM"
    timezone: {
      type: String,
      default: 'UTC'
    }
  }],
  maxStudentsPerSession: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
skillSchema.index({ teacher: 1 });
skillSchema.index({ category: 1 });
skillSchema.index({ 'rating.average': -1 });
skillSchema.index({ createdAt: -1 });
skillSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for teacher details
skillSchema.virtual('teacherDetails', {
  ref: 'User',
  localField: 'teacher',
  foreignField: '_id',
  justOne: true
});

// Methods
skillSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

skillSchema.methods.incrementSessions = function() {
  this.totalSessions += 1;
  return this.save();
};

// Static methods
skillSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true }).populate('teacher', 'username email firstName lastName');
};

skillSchema.statics.findTopRated = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'rating.average': -1, 'rating.count': -1 })
    .limit(limit)
    .populate('teacher', 'username email firstName lastName');
};

skillSchema.statics.searchSkills = function(query, filters = {}) {
  const searchQuery = {
    isActive: true,
    ...filters
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  return this.find(searchQuery)
    .populate('teacher', 'username email firstName lastName')
    .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 });
};

module.exports = mongoose.model('Skill', skillSchema);
