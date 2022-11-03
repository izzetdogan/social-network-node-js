import express from "express";
import formidable from "express-formidable"
const router = express.Router();
import { createPost, uploadImage,userPost, updatePost, deletePost,newsFeed,likePost,unlikePost,addComment,removeComment,posts,totalPosts} from "../controllers/post";
import { requireSignin,canEditDeletePost } from "../middlewares/auth";

router.post('/create-post', requireSignin,createPost)
router.post('/upload-image',requireSignin,formidable({maxFileSize: 5 * 1024 * 1024}),uploadImage);
//router.get('/user-posts', requireSignin,postByUser)
router.get('/user-post/:_id',requireSignin, userPost);
router.put('/update-post/:_id',requireSignin,canEditDeletePost,updatePost)
router.delete('/delete-post/:_id', requireSignin,canEditDeletePost,deletePost)

router.get('/news-feed/:page', requireSignin, newsFeed);
router.get('/total-posts',totalPosts);

router.put('/like-post', requireSignin, likePost);
router.put('/unlike-post', requireSignin, unlikePost)

router.put('/add-comment' ,requireSignin, addComment)
router.put('/remove-comment' ,requireSignin, removeComment)



router.get('/posts',posts)

module.exports = router;