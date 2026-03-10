const express = require('express')
let router = express.Router()
let userSchema = require('../schemas/users')

// GET all users with username query (includes)
router.get('/', async (req, res) => {
    try {
        let query = { isDeleted: false };
        
        // Filter by username if provided
        if (req.query.username) {
            query.username = { $regex: req.query.username, $options: 'i' };
        }
        
        let users = await userSchema.find(query).populate('role');
        res.send(users)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        let user = await userSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        }).populate('role');
        
        if (!user) {
            res.status(404).send({ message: "ID NOT FOUND" })
        } else {
            res.send(user)
        }
    } catch (error) {
        res.status(404).send({ message: "something went wrong" })
    }
})

// POST create new user
router.post('/', async (req, res) => {
    try {
        let newUser = new userSchema({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            role: req.body.role
        })
        await newUser.save();
        res.send(newUser)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// POST enable user
router.post('/enable', async (req, res) => {
    try {
        let user = await userSchema.findOne({
            email: req.body.email,
            username: req.body.username,
            isDeleted: false
        });
        
        if (!user) {
            res.status(404).send({ message: "User not found or credentials incorrect" })
        } else {
            user.status = true;
            await user.save();
            res.send(user)
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// POST disable user
router.post('/disable', async (req, res) => {
    try {
        let user = await userSchema.findOne({
            email: req.body.email,
            username: req.body.username,
            isDeleted: false
        });
        
        if (!user) {
            res.status(404).send({ message: "User not found or credentials incorrect" })
        } else {
            user.status = false;
            await user.save();
            res.send(user)
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// PUT update user
router.put('/:id', async (req, res) => {
    try {
        let user = await userSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('role');
        
        if (user) {
            res.send(user)
        } else {
            res.status(404).send({ message: "ID NOT FOUND" })
        }
    } catch (error) {
        res.status(404).send({ message: error.message })
    }
})

// DELETE user (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        let user = await userSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        });
        
        if (!user) {
            res.status(404).send({ message: "ID NOT FOUND" })
        } else {
            user.isDeleted = true;
            await user.save();
            res.send(user)
        }
    } catch (error) {
        res.status(404).send({ message: error.message })
    }
})

module.exports = router;
