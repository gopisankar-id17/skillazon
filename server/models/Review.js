const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
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
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  reviewType: {
    type: String,
    enum: ['student-to-teacher', 'teacher-to-student'],
    required: [true, 'Review type is required']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: true // Since it's from a completed booking
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reportedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'spam', 'fake', 'offensive', 'other']
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isHidden: {
    type: Boolean,
    default: false
  },
  response: {
    text: {
      type: String,
      trim: true,
      maxlength: [500, 'Response cannot exceed 500 characters']
    },
    respondedAt: {
      type: Date
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ teacher: 1, createdAt: -1 });
reviewSchema.index({ skill: 1, createdAt: -1 });
reviewSchema.index({ student: 1 });
reviewSchema.index({ booking: 1 }, { unique: true });
reviewSchema.index({ rating: -1 });

// Ensure one review per booking
reviewSchema.index({ booking: 1, reviewType: 1 }, { unique: true });

// Virtual for teacher average rating
reviewSchema.virtual('teacherAverageRating', {
  ref: 'Review',
  localField: 'teacher',
  foreignField: 'teacher',
  justOne: false
});

// Methods
reviewSchema.methods.addResponse = function(responseText, responderId) {
  this.response.text = responseText;
  this.response.respondedAt = new Date();
  this.response.respondedBy = responderId;
  return this.save();
};

reviewSchema.methods.addHelpfulVote = function() {
  this.helpfulVotes += 1;
  return this.save();
};

reviewSchema.methods.reportReview = function(userId, reason) {
  this.reportedBy.push({
    user: userId,
    reason: reason
  });
  return this.save();
};

reviewSchema.methods.hideReview = function() {
  this.isHidden = true;
  return this.save();
};

// Static methods
reviewSchema.statics.getTeacherReviews = function(teacherId, options = {}) {
  const query = {
    teacher: teacherId,
    reviewType: 'student-to-teacher',
    isPublic: true,
    isHidden: false
  };

  return this.find(query)
    .populate('student', 'username firstName lastName')
    .populate('skill', 'title category')
    .sort({ createdAt: -1 })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

reviewSchema.statics.getSkillReviews = function(skillId, options = {}) {
  const query = {
    skill: skillId,
    reviewType: 'student-to-teacher',
    isPublic: true,
    isHidden: false
  };

  return this.find(query)
    .populate('student', 'username firstName lastName')
    .sort({ createdAt: -1 })
    .limit(options.limit || 10)
    .skip(options.skip || 0);
};

reviewSchema.statics.getTeacherStats = function(teacherId) {
  return this.aggregate([
    {
      $match: {
        teacher: new mongoose.Types.ObjectId(teacherId),
        reviewType: 'student-to-teacher',
        isHidden: false
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    },
    {
      $project: {
        _id: 0,
        averageRating: { $round: ['$averageRating', 1] },
        totalReviews: 1,
        fiveStars: {
          $size: {
            $filter: {
              input: '$ratingDistribution',
              cond: { $eq: ['$$this', 5] }
            }
          }
        },
        fourStars: {
          $size: {
            $filter: {
              input: '$ratingDistribution',
              cond: { $eq: ['$$this', 4] }
            }
          }
        },
        threeStars: {
          $size: {
            $filter: {
              input: '$ratingDistribution',
              cond: { $eq: ['$$this', 3] }
            }
          }
        },
        twoStars: {
          $size: {
            $filter: {
              input: '$ratingDistribution',
              cond: { $eq: ['$$this', 2] }
            }
          }
        },
        oneStar: {
          $size: {
            $filter: {
              input: '$ratingDistribution',
              cond: { $eq: ['$$this', 1] }
            }
          }
        }
      }
    }
  ]);
};

// Pre-save middleware to update skill rating
reviewSchema.post('save', async function(doc) {
  if (doc.reviewType === 'student-to-teacher') {
    const Skill = mongoose.model('Skill');
    await Skill.findById(doc.skill).then(skill => {
      if (skill) {
        skill.updateRating(doc.rating);
      }
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
