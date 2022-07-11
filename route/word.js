const express = require('express');
const router = express.Router();

const { tokenVerifyMiddleware } = require("./../middleware");

const { user, history, word } = require("./../models");

router.post("/add", async (req, res) => {
    const { eng, thai } = req.body;

    await word.create({
        eng,
        thai,
    });

    res.json({ message: "success" });
});

router.get("/", async (req, res) => {
    const count = await word.count();

    const word_id = Math.floor(Math.random() * count) + 1;

    const result = await word.findOne({
        attributes: ["id", "eng"],
        where: {
            id: word_id,
        },
    });

    res.json({ word: result });
});

router.post("/answer", tokenVerifyMiddleware, async (req, res) => {
    const { word_id, thai } = req.body;

    const selected_word = await word.findOne({
        attributes: [ "thai" ],
        where: {
            id: word_id,
        },
    })

    const is_correct = selected_word.thai == thai;

    await history.create({
        word_id,
        user_id: req.user.id,
        is_correct,
    });

    res.json({ is_correct });
});

router.get("/all", async (req, res) => {
    const result = await user.findAll({
        attributes: ["username"],
        include: [
            {
                attributes: ["is_correct"],
                model: history,
                required: false,
                include: [
                    {
                        model: word,
                        required: true,
                        attributes: ["eng", "thai"],
                    },
                ],
            },
        ],
    });

    res.json(result);
});

module.exports = router;