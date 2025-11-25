import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Token from '../models/Token.js';
import {verifyPayload} from '../utils/helper.js';

const login = async (req, res) => {
    try {
        const isValid = verifyPayload({email: '', password: ''}, req.body);
        if (!isValid) {
            return res.status(400).json({message: 'All credentials are required'});
        }
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(401).json({message: 'User does not exists'});
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const accessToken = jwt.sign({email: req.body.email}, process.env.JWT_SECRET, {expiresIn: '7d'});
        await Token.findOneAndUpdate(user._id, {
            email: req.body.email,
            token: accessToken,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        }, {upsert: true, new: true});
        res.status(200).json({accessToken, role: user.role, message: 'Login successful'});
    } catch (error) {
        res.status(500).json({message: 'An unexpected error occurred during login'});
    }
};

const register = async (req, res) => {
    try {
        const isValid = verifyPayload({email: '', password: ''}, req.body);
        if (!isValid) {
            return res.status(400).json({message: 'All credentials are required'});
        }
        const existingUser = await User.findOne({email: req.body.email});
        if (existingUser) {
            return res.status(409).json({message: 'User already exists'});
        }   
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({message: 'An unexpected error occurred during registration'});
    }
};

export { login, register };