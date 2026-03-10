const express = require('express')
let router = express.Router()
let roleSchema = require('../schemas/roles')

// GET all roles
router.get('/', async (req, res) => {
    try {
        let roles = await roleSchema.find({ isDeleted: false });
        res.send(roles)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// GET role by ID
router.get('/:id', async (req, res) => {
    try {
        let role = await roleSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        });
        if (!role) {
            res.status(404).send({ message: "ID NOT FOUND" })
        } else {
            res.send(role)
        }
    } catch (error) {
        res.status(404).send({ message: "something went wrong" })
    }
})

// GET all users by role ID
router.get('/:id/users', async (req, res) => {
    try {
        let userSchema = require('../schemas/users');
        let users = await userSchema.find({
            isDeleted: false,
            role: req.params.id
        }).populate('role');
        res.send(users)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// POST create new role
router.post('/', async (req, res) => {
    try {
        let newRole = new roleSchema({
            name: req.body.name,
            description: req.body.description
        })
        await newRole.save();
        res.send(newRole)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// PUT update role
router.put('/:id', async (req, res) => {
    try {
        let role = await roleSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (role) {
            res.send(role)
        } else {
            res.status(404).send({ message: "ID NOT FOUND" })
        }
    } catch (error) {
        res.status(404).send({ message: error.message })
    }
})

// DELETE role (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        let role = await roleSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        });
        if (!role) {
            res.status(404).send({ message: "ID NOT FOUND" })
        } else {
            role.isDeleted = true
            await role.save();
            res.send(role)
        }
    } catch (error) {
        res.status(404).send({ message: error.message })
    }
})

module.exports = router;
