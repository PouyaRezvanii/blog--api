/**
 * @type {import('stripe').Stripe}
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const express = require('express')
const Ebook = require('../../models/ebook');
const BadRequestError = require('../../common/errors/bad-request-error');
const jwt = require('jsonwebtoken')

const router = express.Router();

router.post('/purchase/:ebookId', async (req, res, next) => {

    try {
        const { stripeToken } = req.body;
        const ebook = await Ebook.findById(req.params.ebookId)

        if(!ebook) throw new BadRequestError('document not found')
        
        const charge = await stripe.charges.create({
            amount: ebook.price * 100,
            currency: 'usd',
            description: 'One-Time payment',
            source: stripeToken
        })

        if (charge.status === 'failed'){
            throw new BadRequestError('payment has failed!')
        }

        const token = jwt.sign({ ebookId: ebook._id, userId: req.currentUser.userId }, process.env.JWT_SECRET, {expiresIn: '1d'})

        const download_url = `http://localhost:3000/ebook/download/${token}`

        res.status(200).json({ download_url })
    } catch (error) {
        next(error)
    }

})

module.exports = router;