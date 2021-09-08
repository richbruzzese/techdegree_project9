'use strict';
// Dependencies
const express =require('express')
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Course, User } = require('../models');
const router = express.Router()

// GET route provides a list of all courses and their owners
router.get('/courses', asyncHandler(async ( req, res ) =>{
    const course = await Course.findAll({
        include: [
            {
                model: User,
                as: 'Owner',
                attributes:{
                    exclude:[
                        'password',
                        'createdAt',
                        'updatedAt'
                    ]
                }
            }
        ],
        attributes:{
            exclude: [
                'createdAt',
                'updatedAt'
            ]
        }
    })
    
    res.json(course)
}))

// GET Route provides the details of a single course and the owner of the course
router.get('/courses/:id', asyncHandler(async( req, res ) => {
    const course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
                as: 'Owner',
                attributes:{
                    exclude:[
                        'password',
                        'createdAt',
                        'updatedAt'
                    ]
                }
            }
        ],
        attributes:{
            exclude: [
                'createdAt',
                'updatedAt'
            ]
        }
    })
    res.json(course)
}))

//POST route will allow an authenticated user to create a new course
router.post('/courses', authenticateUser, asyncHandler(async ( req, res ) => {
    try{
        const course = req.body 
        await Course.create(course)
         res.status(201)
         .location(`/api/courses/${course.id}`)
         .end()
        }catch(error){
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
          } else {
            throw error;
          }
        }
}))

// PUT route will allow an authenticated user to update an existing course.
// If the current authenticated user does not own the course to be updated, a 403 error is returned
router.put('/courses/:id', authenticateUser, asyncHandler(async ( req, res ) =>{
    try{
        const course = await Course.findByPk(req.params.id)
            if( req.currentUser.id === course.userId ){
                if(course){
                    console.log('UPDATING COURSE')
                    await course.update(req.body)
                    res.status(204).end()
                }else{
                    res.status(404).end()
                }
            }else{
                res.status(403)
                .json({message: "Update Failed. User does not have permissions for requested course"})
            }
            
    }catch(error){
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
          } else {
            throw error;
          }
        }
}))

// DELETE route will allow an authenticated user to remove a course from the database
// If the current authenticated user does not own the course to be deleted, a 403 error is returned
router.delete('/courses/:id', authenticateUser, asyncHandler(async ( req, res ) =>{
    const course = await Course.findByPk(req.params.id)
    if(req.currentUser.id !== course.userId ){
        res.status(403)
        .json({message: 'Course deletion failed. User does not have permissions for requested course'})
        .end()
    }else{
        await course.destroy()
        res.status(204).end()
    }
}))

module.exports = router