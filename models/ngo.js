const mongoose = require('mongoose');

const ngoRegisterSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the NGO name"],
    },
    email: {
        type: String,
        required: [true, "Please add the NGO email address"],
        unique: [true, "Email address already taken"],
    },
    password: {
        type: String,
        required: [true, "Please add the NGO password"],
    },
    role: {
        type: String,
        default: "ngo",
    }
},
    {
        timestamps: true,
    }
);

const ngoInfoSchema = mongoose.Schema({
    ngoId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", 
        required: true 
    },
    name: {
        type: String,
        required: [true, "Please add the NGO address"],
    },
    email: {
        type: String,
        required: [true, "Please add the NGO email address"],
    },
    contact_no: {
        type: String,
        required: [true, "Please add the NGO contact number"],
    },
    location: {
        type: String,
        required: [true, "Please add the NGO city"],
    },
    category: {
        type: String,
        required: [true, "Please add the NGO category"],
    },
    subcategory: {
        type: String,
        required: [true, "Please add the NGO subcategory"],
    },
},
    {
        timestamps: true,
    }
);

module.exports = {
    NgoRegister: mongoose.model("NgoRegister", ngoRegisterSchema),
    NgoInfo: mongoose.model("NgoInfo", ngoInfoSchema)
};