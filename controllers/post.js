import Post from '../models/post';
import cloudinary from 'cloudinary';
import User from '../models/user';


cloudinary.config({ 
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY, 
    api_secret:process.env.CLOUD_API_SECRET 
  });

//------------------Get All Posts
export const posts = async(req, res ) => {
    try {
        const posts = await Post.find()
        .populate("postedBy", "id name username image")
        .populate("comments.postedBy", "_id name image username")
        .sort({createdAt: -1})
        .limit(12);
        
        
        res.json(posts)
    } catch (error) {
        console.log(error)
    }
}

//---------------- GET POST BY USER 
export const userPost =async(req,res) => {
    try {
        const post = await Post.findById(req.params._id)
        .populate('postedBy', '_id name image username')
        .populate("comments.postedBy", "_id name image username")
        res.json(post)
        
    } catch (err) {
        console.log(err)
    }
}



//------------------CREATE POST BY USER
export const createPost = async(req, res) =>{
    const {content, image} = req.body;
    if(!content){
        return res.json({
            error: 'empty'
        })
    }
    try {
        const post = await Post({content, image, postedBy: req.auth._id});
        await post.save();
        res.json(post)
        
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
        
    }
}



//------------------UPDATE POST
export const updatePost = async(req,res) => {
    try {
        const {content, image} = req.body 
        const post= await Post.findByIdAndUpdate(req.params._id, req.body,{
            new:true
        })
        res.json(post)
    } catch (err) {
        console.log(err)
    }
}

//------------------DELETE POST
export const deletePost = async(req,res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params._id);
        if(post.image && post.image.public_id){
            const image = await cloudinary.uploader.destroy(post.image.public_id);
        }
        res.json({ok: true})
    } catch (err) {
        console.log(err)
    }
}

//------------------UPLOAD IMAGE
export const uploadImage = async(req,res) =>{
    try {
        const result = await cloudinary.uploader.upload(req.files.image.path);
        //console.log(result)
        res.json({
            url: result.secure_url,
            public_id: result.public_id,
        })
    } catch (err) {
        console.log(err)
    }
}

//---------------- POST BY (USER AND FOLLOWING USER)
export const newsFeed = async (req,res) =>{
    try {
        const user = await User.findById(req.auth._id)

        let following = user.following;
        following.push(req.auth._id);

        const currentPage = req.params.page || 1;
        const perPage = 10;


        const posts = await Post.find({postedBy: {$in: following}})
        .skip((currentPage-1)*perPage)
        .populate('postedBy', '_id name image username')
        .populate("comments.postedBy", "_id name image username")
        .sort({createdAt: -1})
        .limit(perPage);
        res.json(posts)
    } catch (err) {
        console.log(err)
    }
}


//-------------------- NUMBER OF ALLPOST
export const totalPosts = async (re,res) => {
    try {
        const post = await Post.find().estimatedDocumentCount;
        res.json(post);
    } catch (err) {
        console.log(err);
    }
}



//-------------------LIKE POST
export const likePost = async (req,res) =>{
    try {
        const post = await Post.findByIdAndUpdate(req.body._id,{
            $addToSet: {likes: req.auth._id},
        },{new: true});
        
        res.json(post)
    } catch (err) {
        console.log(err)
    }
}



//-------------- UNLIKE POST

export const unlikePost = async (req,res) =>{
    try {
        const post = await Post.findByIdAndUpdate(req.body._id,{
            $pull: {likes: req.auth._id},
        },{new: true});
        
        res.json(post)
    } catch (err) {
        console.log(err)
    }
}



//------------- ADD COMMENT
export const addComment = async (req,res) =>{
    try {
        const {postId,comment} = req.body;
        const post = await Post.findByIdAndUpdate(postId,{
            $push: {comments: {text: comment, postedBy: req.auth._id}}
        },
            {new: true}
        ).populate("postedBy", "_id name image username")
        .populate("comments.postedBy", "_id name image username")
        .sort({createdAt: -1})
        

        
        res.json(post)
    } catch (err) {
        console.log(err)
    }
}


//---------------- dELETE COMMENT
export const removeComment = async (req,res) =>{
    try {
        const {postId,comment} = req.body;
        const post = await Post.findByIdAndUpdate(postId,{
            $pull: {comments: {_id: comment._id}}
        },
            {new: true}
        )
        res.json(post)
    } catch (err) {
        console.log(err)
    }
}

