import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const {Schema} = mongoose;

const userSchema = new Schema ({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64
    },
    secret: {
        type: String,
        required: true,

    },
    about: {},
    image: {
        url: String,
        public_id: String,
    },
    following: [{type: Schema.ObjectId, ref: "User"}],
    followers: [{type: Schema.ObjectId, ref: "User"}]

},{timestamps: true});


userSchema.pre("save", async function (next) {
    let user = this;
  
    if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hashSync(user.password, salt);
        user.password = hash;
    }
  

    return next();
});


userSchema.statics.comparePassword = async function (password,hashed) {

    const user = this;
    return bcrypt.compare(password, hashed).catch((e) => false);
};



export default mongoose.model('User', userSchema);