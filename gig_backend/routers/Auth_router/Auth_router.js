const express = require('express');
const Auth_router = express.Router();
const { Handle_UserSignup, Handle_UserLogin, Handle_UserLogout, Handle_CheckLogin,Handle_GetUserProfile } = require('../../controllers/Auth_controller'); 

//register routes
Auth_router.post('/api/auth/register', Handle_UserSignup);
//login routes
Auth_router.post('/api/auth/login', Handle_UserLogin);
//check if user is logged in
Auth_router.get('/api/auth/check', Handle_CheckLogin);
//logout routes
Auth_router.get('/api/auth/logout', Handle_UserLogout);

Auth_router.get('/api/auth/profile', Handle_GetUserProfile);

module.exports = Auth_router;

