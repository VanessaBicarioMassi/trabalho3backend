"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const hashedPassword = yield bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        yield newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        const token = jwt.sign({ userId: user._id }, 'secreto', { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
