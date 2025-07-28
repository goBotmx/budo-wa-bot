const express = require('express');
const router = express.Router();
const WhatsAppController = require('../controllers/controller');

router.get('/', WhatsAppController.verifyWebhook);
router.post('/', WhatsAppController.handleWebhook);

module.exports = router;