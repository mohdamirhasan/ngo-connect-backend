const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add the title"]
    },
    desc: {
        type: String,
        required: [true, "Please add description"]
    },
    location: {
        type: String,
        required: [true, "Please add location"]
    },
    imagePath: {
        type: String
    },
    category: {
        type: String,
        required: [true, "Please add category"]
    },
    subcategory: {
        type: String
    },
    status: {
        type: String,
        default: "Pending",
    },
    resolvedAt: {
        type: Date,
        default: null,
    },
    ngo_resolved: {
        type: mongoose.Schema.Types.ObjectId, ref: "Ngo",
        default: null,
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", 
        required: true 
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Report", reportSchema);