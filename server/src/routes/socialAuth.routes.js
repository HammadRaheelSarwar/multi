const express = require('express');
const { googleLogin, facebookLogin, oauthCallback } = require('../controllers/socialAuth.controller');
const router = express.Router();

router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.post('/callback', oauthCallback);

module.exports = router;
