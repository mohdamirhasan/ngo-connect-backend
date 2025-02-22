const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a Title"],
    },
    content: {
        type: String,
        required: [true, "Please add content"],
    },
    imagePath: {
        type: String,
    },
    ngo_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", 
        required: true 
    },
    NGOname: {
        type: String,
        required: [true, "NGO's name is missing"],
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, 
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", postSchema);