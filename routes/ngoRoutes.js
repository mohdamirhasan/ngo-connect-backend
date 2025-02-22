const express = require('express');
const { registerNGO, registerNGOInfo, loginNGO, currentNGO, logoutNGO, getNgo, deleteNGO, updateNGO, getNgoById } = require('../controllers/ngoController');
const validateToken = require("../middlewares/validateToken");

const router = express.Router();

router.post('/register', registerNGO);

router.post('/register-info', registerNGOInfo);

router.post('/login', loginNGO);

router.put('/update', validateToken, updateNGO);

router.get('/current', validateToken, currentNGO);

router.get('/logout', validateToken, logoutNGO);

router.get('/:category', getNgo);

router.delete('/delete', validateToken, deleteNGO);

router.get('/:id/get', getNgoById);

module.exports = router;