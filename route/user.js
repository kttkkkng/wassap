const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { tokenVerifyMiddleware } = require("./../middleware");

const { user } = require("./../models");

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const exist = await user.findOne({
        where: {
            username: username
        }
    });

    if (exist) {
        return res.status(400).json({ message: "this username existed" });
    }

    const newUser = await user.create({
        username,
        password
    });

    return res.json({ user: newUser });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const exist = await user.findOne({
        where: {
            username: username
        }
    });

    if (!exist) {
        return res.status(400).json({ message: "user not existed" });
    }

    if (password != exist.password) {
        return res.status(400).json({ message: "invalid username, password" });
    }

    const token = jwt.sign({ id: exist.id }, "secret", { expiresIn: "7d" });

    return res.json({ token: token });
});

router.patch("/password", tokenVerifyMiddleware, async (req, res) => {
    const { password } = req.body;

    await user.update({
        password: password
    }, {
        where: {
            id: req.user.id,
        }
    });

    return res.json({ message: "success" });
});

module.exports = router;