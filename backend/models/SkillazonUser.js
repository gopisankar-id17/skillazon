const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'both', 'admin'],
    default: 'student'
  },
  profile: {
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    avatar: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    languages: [{
      type: String,
      trim: true
    }],
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
      other: String
    },
    experience: {
      type: String,
      trim: true,
      maxlength: [1000, 'Experience cannot exceed 1000 characters']
    },
    education: {
      type: String,
      trim: true,
      maxlength: [500, 'Education cannot exceed 500 characters']
    }
  },
  teachingProfile: {
    isTeacher: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: [0, 'Hourly rate cannot be negative']
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: [0, 'Years of experience cannot be negative']
    },
    teachingStyle: {
      type: String,
      trim: true,
      maxlength: [300, 'Teaching style cannot exceed 300 characters']
    },
    availability: [{
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
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDocuments: [{
      type: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  stats: {
    totalSessionsAsTeacher: {
      type: Number,
      default: 0
    },
    totalSessionsAsStudent: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    averageRatingAsTeacher: {
      type: Number,
      default: 0
    },
    totalReviewsAsTeacher: {
      type: Number,
      default: 0
    },
    averageRatingAsStudent: {
      type: Number,
      default: 0
    },
    totalReviewsAsStudent: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    emailNotifications: {
      bookingUpdates: {
        type: Boolean,
        default: true
      },
      messageNotifications: {
        type: Boolean,
        default: true
      },
      reminderNotifications: {
        type: Boolean,
        default: true
      },
      marketingEmails: {
        type: Boolean,
        default: false
      }
    },
    privacySettings: {
      showEmail: {
        type: Boolean,
        default: false
      },
      showLocation: {
        type: Boolean,
        default: true
      },
      allowDirectMessages: {
        type: Boolean,
        default: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockoutExpires: {
    type: Date
  },
  emailVerificationToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ 'teachingProfile.isTeacher': 1 });
userSchema.index({ 'stats.averageRatingAsTeacher': -1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.username;
});

// Virtual for teacher skills
userSchema.virtual('skills', {
  ref: 'Skill',
  localField: '_id',
  foreignField: 'teacher'
});

// Virtual for completed sessions count
userSchema.virtual('completedSessions').get(function() {
  return this.stats.totalSessionsAsTeacher + this.stats.totalSessionsAsStudent;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update role based on teaching profile
userSchema.pre('save', function(next) {
  if (this.teachingProfile.isTeacher && this.role === 'student') {
    this.role = 'both';
  } else if (!this.teachingProfile.isTeacher && this.role === 'both') {
    this.role = 'student';
  }
  next();
});

// Instance Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  this.loginAttempts = 0;
  this.lockoutExpires = undefined;
  return this.save();
};

userSchema.methods.incrementLoginAttempts = function() {
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
  const lockoutHours = parseInt(process.env.LOGIN_LOCKOUT_HOURS) || 1;
  
  this.loginAttempts += 1;
  
  if (this.loginAttempts >= maxAttempts) {
    this.lockoutExpires = new Date(Date.now() + (lockoutHours * 60 * 60 * 1000));
  }
  
  return this.save();
};

userSchema.methods.isLocked = function() {
  return this.lockoutExpires && this.lockoutExpires > new Date();
};

userSchema.methods.becomeTeacher = function(teachingData) {
  this.teachingProfile.isTeacher = true;
  this.teachingProfile.title = teachingData.title;
  this.teachingProfile.hourlyRate = teachingData.hourlyRate;
  this.teachingProfile.yearsOfExperience = teachingData.yearsOfExperience;
  this.teachingProfile.teachingStyle = teachingData.teachingStyle;
  this.teachingProfile.availability = teachingData.availability;
  
  if (this.role === 'student') {
    this.role = 'both';
  } else if (this.role !== 'admin') {
    this.role = 'teacher';
  }
  
  return this.save();
};

userSchema.methods.updateStats = function(statType, value) {
  if (this.stats[statType] !== undefined) {
    if (typeof this.stats[statType] === 'number') {
      this.stats[statType] += value;
    } else {
      this.stats[statType] = value;
    }
  }
  return this.save();
};

userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  
  // Remove sensitive information
  delete user.password;
  delete user.loginAttempts;
  delete user.lockoutExpires;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  
  // Apply privacy settings
  if (!user.preferences.privacySettings.showEmail) {
    delete user.email;
  }
  
  if (!user.preferences.privacySettings.showLocation) {
    delete user.profile.location;
  }
  
  return user;
};

// Static Methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: new RegExp(`^${username}$`, 'i') });
};

userSchema.statics.findTeachers = function(filters = {}) {
  const query = {
    $or: [
      { role: 'teacher' },
      { role: 'both' }
    ],
    'teachingProfile.isTeacher': true,
    isActive: true,
    ...filters
  };
  
  return this.find(query)
    .select('-password -loginAttempts -lockoutExpires')
    .sort({ 'stats.averageRatingAsTeacher': -1, 'stats.totalSessionsAsTeacher': -1 });
};

userSchema.statics.findTopTeachers = function(limit = 10) {
  return this.find({
    $or: [{ role: 'teacher' }, { role: 'both' }],
    'teachingProfile.isTeacher': true,
    'stats.totalReviewsAsTeacher': { $gte: 5 },
    isActive: true
  })
  .select('-password -loginAttempts -lockoutExpires')
  .sort({ 'stats.averageRatingAsTeacher': -1, 'stats.totalSessionsAsTeacher': -1 })
  .limit(limit);
};

userSchema.statics.getUserStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
        teachers: { 
          $sum: { 
            $cond: [
              { $or: [{ $eq: ['$role', 'teacher'] }, { $eq: ['$role', 'both'] }] },
              1,
              0
            ]
          }
        },
        students: { 
          $sum: { 
            $cond: [
              { $or: [{ $eq: ['$role', 'student'] }, { $eq: ['$role', 'both'] }] },
              1,
              0
            ]
          }
        },
        verifiedTeachers: {
          $sum: { $cond: ['$teachingProfile.isVerified', 1, 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('SkillazonUser', userSchema);
