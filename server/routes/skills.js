const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const User = require('../models/SkillazonUser');
const authenticateToken = require('../middleware/authenticateToken');

// Get all skills with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      level,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = { isActive: true };
    
    if (category) filters.category = category;
    if (level) filters.level = level;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query;
    if (search) {
      query = Skill.searchSkills(search, filters);
    } else {
      query = Skill.find(filters).populate('teacher', 'username firstName lastName profile.avatar stats.averageRatingAsTeacher stats.totalReviewsAsTeacher');
    }

    // Apply sorting
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    query = query.sort(sortObj);

    // Apply pagination
    const skills = await query.skip(skip).limit(parseInt(limit));
    const total = await Skill.countDocuments(filters);

    res.json({
      success: true,
      data: {
        skills,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message
    });
  }
});

// Get skill by ID
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('teacher', 'username firstName lastName profile stats.averageRatingAsTeacher stats.totalReviewsAsTeacher teachingProfile');

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      data: skill
    });

  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skill',
      error: error.message
    });
  }
});

// Create new skill (requires authentication and teacher role)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user is a teacher
    const user = await User.findById(userId);
    if (!user || (!['teacher', 'both', 'admin'].includes(user.role))) {
      return res.status(403).json({
        success: false,
        message: 'Only teachers can create skills'
      });
    }

    const skillData = {
      ...req.body,
      teacher: userId
    };

    const skill = new Skill(skillData);
    await skill.save();

    await skill.populate('teacher', 'username firstName lastName profile');

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill
    });

  } catch (error) {
    console.error('Error creating skill:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating skill',
      error: error.message
    });
  }
});

// Update skill (requires authentication and ownership)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const skillId = req.params.id;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check ownership or admin role
    if (skill.teacher.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this skill'
      });
    }

    // Update skill
    Object.assign(skill, req.body);
    await skill.save();

    await skill.populate('teacher', 'username firstName lastName profile');

    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });

  } catch (error) {
    console.error('Error updating skill:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating skill',
      error: error.message
    });
  }
});

// Delete skill (requires authentication and ownership)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const skillId = req.params.id;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check ownership or admin role
    if (skill.teacher.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this skill'
      });
    }

    // Soft delete by setting isActive to false
    skill.isActive = false;
    await skill.save();

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting skill',
      error: error.message
    });
  }
});

// Get skills by teacher
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const skills = await Skill.find({ 
      teacher: teacherId, 
      isActive: true 
    })
    .populate('teacher', 'username firstName lastName profile stats')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Skill.countDocuments({ 
      teacher: teacherId, 
      isActive: true 
    });

    res.json({
      success: true,
      data: {
        skills,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching teacher skills:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher skills',
      error: error.message
    });
  }
});

// Get top-rated skills
router.get('/featured/top-rated', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const skills = await Skill.findTopRated(parseInt(limit));

    res.json({
      success: true,
      data: skills
    });

  } catch (error) {
    console.error('Error fetching top-rated skills:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top-rated skills',
      error: error.message
    });
  }
});

// Get skills by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skills = await Skill.findByCategory(category);
    
    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedSkills = skills.slice(skip, skip + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        skills: paginatedSkills,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(skills.length / parseInt(limit)),
          totalItems: skills.length,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching skills by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skills by category',
      error: error.message
    });
  }
});

module.exports = router;
