import { expressjwt} from "express-jwt";
import Post from "../models/post"

export const requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
})

export const canEditDeletePost = async(req,res, next) => {
    try {
        const post =await Post.findById(req.params._id);
        if(req.auth._id != post.postedBy){
            return res.status(400).send("Unauthor");
        }else{
            next()
        }
    } catch (err) {
        console.log(err)
    }
}