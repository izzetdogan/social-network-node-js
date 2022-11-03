import express from "express";
import { 
    register, 
    login, 
    currentUser, 
    forgotPassword,
    profileUpdate,
    addFollower,
    userFollow,
    userFollowing,
    removeFollower,
    userUnfollow,
    searchUser,
    getUser,
    findPeople,
    getAllUser
  
     } from "../controllers/auth";
import { requireSignin } from "../middlewares/auth";

const router = express.Router();


router.post('/register',register)
router.post('/login',login);
router.get('/current-user',requireSignin,currentUser);
router.post('/forgot-password',forgotPassword);


router.put('/profile-update',requireSignin,profileUpdate);
router.get('/find-people', requireSignin, findPeople);


router.put('/user-follow',requireSignin,addFollower, userFollow );
router.put('/user-unfollow',requireSignin,removeFollower, userUnfollow );
router.get('/user-following', requireSignin,userFollowing);


router.get('/search-user/:query',searchUser)
router.get('/user/:username',getUser)
router.get('/all-user',getAllUser);
module.exports = router;