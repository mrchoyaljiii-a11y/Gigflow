const express = require('express');
const notification_router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { getNotifications,HandleView ,Read_notification} = require('../../controllers/Notification_controller');


notification_router.get('/api/notifications', authMiddleware, getNotifications);


// when the client view freelancer profile and when the client view freelancer bid then send notification to freelancer
notification_router.get('/api/notifications/view_profile', authMiddleware,HandleView); 

// when user read ntification 
notification_router.post(`/api/notifications/read/:id`,authMiddleware,Read_notification)

module.exports = notification_router