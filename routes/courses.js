'use strict';

const express =require('express')
const { asyncHandler } = require('../middleware/async-handler')
const { Course } = require('../models')
const router = express.Router()

router.get('/courses', asyncHandler(async (req, res) =>{
    const course = await Course.findAll()
    res.json(course)
}))

router.get('/courses/:id', asyncHandler(async( req, res) => {
    const course = await Course.findByPk(req.params.id)
    res.json(course)
}))

module.exports = router