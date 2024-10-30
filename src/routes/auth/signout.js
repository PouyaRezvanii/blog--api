const express = require('express')

const router = express.Router();

router.post('/signout', async (req, res, next) => {
    req.session = null;
    res.send({})
})

module.exports = router;