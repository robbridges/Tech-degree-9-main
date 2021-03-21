const express = require('express');
const router = express.Router();
const {User, Course} = require('../models');
const {asyncHandler} = require('../middleware/asyncHandler');
const { authenticateUser } = require('../middleware/user-auth');
const e = require('express');


// should return authenticated user
router.get('/users', authenticateUser,  asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.currentUser);

  
  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddress

  })
}));
// returns all courses
router.get('/courses', asyncHandler(async (req, res) => {

    const courses = await Course.findAll({  
      });
  res.json(courses);
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({message: "Course not found"});
  }
  


}));


// adds user to the database
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).location('/').json();
  } catch (error) {
    res.json(error);
    console.log(req.body);
  }
}));

router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
    await Course.create(req.body);
    res.status(201).location('/').json();
  } catch (error) {
    res.json(error);
    
  }
}));

router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  try {
    if ( course ) {
      await course.update(req.body);
      res.status(204).send();
    } else {
      res.status(404).json({message: 'Course not found'});
    } 
  } catch (error) {
    res.json(error);
  } 
}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  try {
    if ( course ) {
      await course.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({message: 'Course not found'});
    } 
  } catch (error) {
    res.json(error);
  } 
}));




module.exports = router;