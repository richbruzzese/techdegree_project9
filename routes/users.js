'use strict';

const express =require('express')
const { asyncHandler } = require('../middleware/async-handler')
const { User } = require('../models')
const { authenticateUser } = require('../middleware/auth-user')
const router = express.Router()

router.get('/users', asyncHandler(async (req, res) =>{
    const user = await User.findAll()
    res.json(user)
}))

router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location('/').json({ "message": "Account successfully created!" });
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));

module.exports = router