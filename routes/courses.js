'use strict';

const express =require('express')
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Course, User } = require('../models');
const router = express.Router()

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