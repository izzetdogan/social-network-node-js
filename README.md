# social-network-node-js
it is a social-network api where users can post articles and follow other users

## API EndPoints

```
javascript

//User Endpoints

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

//Post Endpoints

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


```



## Features

<ul>
<li>Jwt auth</li>
<li>Cloudinary for media upload</li>
</ul>
