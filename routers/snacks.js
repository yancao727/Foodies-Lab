const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Snacks = require('../models/snacks');
const {snackSchema} = require('../schemas.js');
const {isLoggedIn, isAuthor, validateSnack } = require('../middleware');



router.get('/', async (req, res) => {
    const snacks = await Snacks.find({});
    res.render('snacks/index', { snacks })
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('snacks/new');
})

router.post('/', isLoggedIn, validateSnack, catchAsync (async (req, res, next) => {
        // if (!req.body.snack) throw new ExpressError('Invalid data', 400);
        const snack = new Snacks(req.body.snack);
        snack.author = req.user._id;
        await snack.save();
        req.flash('success', 'Sucessfully made a new snack!');
        res.redirect(`/snacks/${snack._id}` )
}))

router.get('/:id', catchAsync (async (req, res) => {
    const snack = await Snacks.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(snack);
    if (!snack) {
        req.flash('error', 'Cannot find that snack!');
        return res.redirect('/snacks');
    }
    res.render('snacks/show', { snack })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (async(req, res) => {
    const {id} = req.params;
    const snack = await Snacks.findById(id);
    if (!snack) {
        req.flash('error', 'Cannot find that snack!');
        return res.redirect('/snacks');
    }
    res.render('snacks/edit', { snack })
}))

router.put('/:id', isLoggedIn, isAuthor, validateSnack, catchAsync (async (req, res) => {
    const {id} = req.params;
    const snack = await Snacks.findByIdAndUpdate(id, { ...req.body.snack });
    req.flash('success', "Successfully updated snack!");
    res.redirect(`/snacks/${snack._id}` )
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync (async(req, res) => {
    const { id } = req.params;
    await Snacks.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete a snack!');
    res.redirect('/snacks')
}))

module.exports = router;