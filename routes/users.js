'use strict';
//Dependencies
const express =require('express')
const { asyncHandler } = require('../middleware/async-handler')
const { User } = require('../models')
const { authenticateUser } = require('../middleware/auth-user')
const router = express.Router()
const bcrypt = require('bcrypt')

// Get route to provide details of current Authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) =>{
    const user = req.currentUser
    res.json({
      id:user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    })
}))

// POST route to allow for creation of new users.  If password is provided, password is hashed before being stored in Database
router.post('/users', asyncHandler(async (req, res) => {
    try {
      const user = req.body
      let password = user.password
      if(password){
        user.password = bcrypt.hashSync(user.password, 10)
      }
  
      await User.create(user)
      res.status(201)
      .location('/')
      .end()
    
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }}));

module.exports = router