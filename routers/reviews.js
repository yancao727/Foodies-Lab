const express = require('express');
const router = express.Router({mergeParams: true});
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Snacks = require('../models/snacks');
const Review = require('../models/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const snack = await Snacks.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    snack.reviews.push(review);
    await review.save();
    await snack.save();
    req.flash('success', 'Successfully created a review!');
    res.redirect(`/snacks/${snack._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Snacks.findByIdAndUpdate(id, {$pull: { reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully delete a review!');
    res.redirect(`/snacks/${id}`);
}))

module.exports = router;