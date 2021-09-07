'use strict';

const express =require('express')
const { asyncHandler } = require('../middleware/async-handler')
const { User } = require('../models')
const { authenticateUser } = require('../middleware/auth-user')
const router = express.Router()
const bcrypt = require('bcrypt')

router.get('/users', asyncHandler(async (req, res) =>{
    const user = await User.findAll()
    res.json(user)
}))

router.post('/users', asyncHandler(async (req, res) => {
    try {
      const user = req.body
      const errors = []

      //Check if First Name is included in request
      if (!user.firstName){
        errors.push('First Name is required')
      }
      //Check if Last Name included
      if(!user.lastName){
        errors.push('Last Name is required')
      }
      //Check if Email is provided
      if(!user.emailAddress){
        errors.push('Email Address is required')
      }
      //Check if Password Provided
      let password = user.password
      if(!password){
        errors.push('Password is required')
      }else{
        //If Password Provided, hash the provided password
        user.password = bcrypt.hashSync(password, 10)
      }
      //If any errors present, return those errors to user
      if( errors.length > 0 ){
        res.status(400)
        .json({errors})
      }else{
        //If no errors present, create the new user in the DB
        await User.create(user)
        res.status(201)
        .location('/')
        .json({ "message": "Account successfully created!" });
      }
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }}));

module.exports = router