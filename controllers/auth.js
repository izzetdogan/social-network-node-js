//import { hashPassword, comparePassword } from "../helpers/auth";
import { nanoid} from 'nanoid';
import User from "../models/user";
import Post from "../models/post";
import jwt from 'jsonwebtoken';



//----------------------- REGISTER USER
export const register = async(req,res) => {
    const {name, email, password, secret} = req.body;

    if(!name){
        return res.json({
            error:'Name is required'
        })
    }
    if(!password || password.length < 6 ){
        return res.json({
            error:'Password is 6 olmaslı'
        })
    }
    if(!secret){
        return res.json({
            error:'secret is required'
        })
    }

    const exist = await User.findOne({email})
    if(exist){
        return res.json({
            error:'Emial is takend'
        })
    }
    

    const user = new User({name, email, password, secret, username: nanoid(6) })
    try{
        await user.save();
        return res.json({
            ok: true
        })
        
    }catch(err){
        console.log("Register Failse",err);
        return res.status(400).send("errror try again")
    }
}


//----------------------- USER LOGIN
export const login =async(req,res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) {
            return res.json({
                error:'No user found'
            })
        }

        const match = await User.comparePassword(password, user.password);
        if(!match) {
            return res.json({
                error:'Wrong Password'
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
        user.password=undefined;

        res.json({
            token, 
            user,
        })
    }catch(err){
        console.log(err)
        return res.status(400).send('Error try again')
    }
}



//--------------------- CURRENT USER
export const currentUser = async(req,res) => {
    try{
        const user = await User.findById(req.auth._id);
   
    // res.json(user)
        res.json({
            ok: true
        })

    }catch(err){
        
        res.sendStatus(400);
    }
}




//------------------ FORGOT PASSWORD
export const forgotPassword = async(req, res) =>{
    const {email, newPassword, secret } = req.body;

    if(!newPassword || newPassword<6){
        return res.json({
            error: 'New pass is required and should be min 6 char'
        });
    }
    if(!secret ){
        return res.json({
            error: 'secret is requied'
        })
    }

    const user = await User.findOne({email, secret});
    if(!user){
        return res.json({
            error:"2we cant verify " 
        })
    }

    try{
        const hashed = await User.comparePassword(newPassword, user.password);
        await User.findByIdAndUpdate(user._id, {password: hashed});
        return res.json({
            success: 'congrat'
        })
    }catch(err){
        console.log(err);
        return res.json({
            error:"somethig went weong"
        })
    }
}


//----------------------- USER UPDATE
export const profileUpdate = async(req, res) => {
    try {
        const data = {}

        if(req.body.username){
            data.username = req.body.username; 
        }
        if(req.body.about){
            data.about= req.body.about; 
        }
        if(req.body.password){
            if(req.body.password.length<6){
                return res.json({error: "passsword is required min 6 char"})
            }else{
                data.password = await hashPassword(req.body.password);
            }
        }
        if(req.body.secret){
            data.secret = req.body.secret; 
        }
        if(req.body.image){
            data.image = req.body.image; 
        }

        let user = await User.findByIdAndUpdate(req.auth._id,data, {new: true})
        user.password = undefined;
        user.secret=undefined;
        res.json(user);
    } catch (err) {
        if(err.code==11000){
            return res.json({error: "duplicate username"})
        }
    }
}

export const findPeople = async(req,res) => {

    try {
        const user = await User.findById(req.auth._id)
        let following = user.following;
        following.push(user._id);
        const people = await User.find({_id: {$nin: following}}).limit(10)
        res.json(people)

    } catch (err) {
        console.log(err)
    }

}

export const addFollower = async (req,res,next) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id,{
            $addToSet: {
                followers: req.auth._id
            }
        })
        next();
        
    } catch (err) {
        console.log(err)
    }
}

export const userFollow = async (req,res,next)=> {
    try {
        const user = await User.findByIdAndUpdate(req.auth._id,{
            $addToSet: {following: req.body._id },
        },{new: true});
        res.json(user)
        
    } catch (err) {
        console.log(err)
    }
}

export const userFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        const following = await User.find({_id: user.following}).limit(100);
        res.json(following)
        
    } catch (err) {
        console.log(err)
    }
}

export const removeFollower = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id,{
            $pull: {followers: req.auth._id },
        })
        next();
    } catch (err) {
        console.log(err)
    }
}

export const userUnfollow = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.auth._id,{
            $pull: { following: req.body._id}
        },
        {new: true});
        res.json(user)
    } catch (err) {
        console.log(err)
    }
}

export const searchUser = async (req,res) =>{
    const {query} =req.params
    if(!query) return;
    try {
        const user=await User.find({
            $or: [
                {name: {$regex: query, $options: 'i'}},
                {username: {$regex: query, $options: 'i'}}
            ]
        }).select("-password -secret")

        res.json(user)
    } catch (error) {
        console.log(error)
    }

}

export const getUser = async (req, res) =>{
    try {
        const user = await User.findOne({username: req.params.username}).select("-password -secret")
        const userPost = await Post.find({postedBy: user._id})
        res.json({
            userPost: userPost,
            user: user
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAllUser = async (req, res) => {
    const user =  await User.find()
    res.json(user)

}