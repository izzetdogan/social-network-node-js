import mongoose from "mongoose";
const {Schema} = mongoose;

const postSchema = new Schema ({
    content: {
        type: {},
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    image: {
        url: String,
        public_id: String,
    },
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    comments: [
        {
            text: String,
            created: {type: Date, default: Date.now},
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
    ],
},{timestamps: true});

export default mongoose.model('Post', postSchema);