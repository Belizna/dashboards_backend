import {validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import UserModel from '../models/User.js'


export const register = async (req, res) => {
    try
    {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const salt = await bcrypt.genSalt(10);
        const password = req.body.password
        const passwordhash = await bcrypt.hash(password, salt)

        const userDoc = new UserModel({
            fullname: req.body.fullname,
            email: req.body.email,
            passwordHash: passwordhash
        })

        const user = await userDoc.save()
        const token = jwt.sign(
            {_id: user._id,} , 'govno!2', {expiresIn: '1d'},
        );

        res.json({
            ...user._doc,
            token
        })

    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if(!user){
            return res.status(404).json({
                message:'Неверный email'
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.passwordHash)
        if(!isValidPassword){
            return res.status(404).json({
                message:'Неверный email или пароль'
            })
        }

        const token = jwt.sign({_id: user._id}, 'govno!2', {expiresIn: '1d'})

        res.json({
            ...user._doc,
            token
        })

    }
    catch(err) {
        res.json({
            err
        })
    }
}

export const me = async (req, res) => {
    try{
        const user = await UserModel.findById(req.userId)
        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        else {
            return res.json({
                ...user._doc,
            })
        }
    }
    catch(err) {
        res.status(400).json({
            err
        })
    }
}