const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { NgoRegister, NgoInfo } = require("../models/ngo");
const jwt = require("jsonwebtoken");

//@desc Register NGO
//@route POST api/ngo/register
//@access public
const registerNGO = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!")
    }
    const NGOAvailable = await NgoRegister.findOne({ email });
    if (NGOAvailable) {
        res.status(400);
        throw new Error("NGO already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const ngoRegister = await NgoRegister.create({ name, email, password: hashedPassword, role: "ngo" });
    if (ngoRegister) {
        console.log('NGO Created');
        res.status(201).json({ _id: ngoRegister.id, email: ngoRegister.email });
    } else {
        res.status(400);
        throw new Error("NGO data is not valid");
    }
});

//@desc Register NGO information
//@route POST api/ngo/register-info
//@access public (only if NGO is registered)
const registerNGOInfo = asyncHandler(async (req, res) => {
    const { name, email, contact_no, location, category, subcategory } = req.body;
    
    if (!name || !email || !contact_no || !location || !category || !subcategory) {
        res.status(400);
        throw new Error('These fields are mandatory');
    }

    const NGOInfoAvailable = await NgoInfo.findOne({ email });
    if (NGOInfoAvailable) {
        res.status(400);
        throw new Error("NGO information already registered");
    }

    const ngo = await NgoRegister.findOne({ email });
    if (!ngo) {
        res.status(400);
        throw new Error("NGO is not registered. Please register first.");
    }

    const ngoInfo = await NgoInfo.create({
        ngoId: ngo._id,
        name,
        email,
        contact_no,
        location,
        category,
        subcategory,
    });

    if (ngoInfo) {
        console.log('NGO Info Created');
        res.status(201).json({ _id: ngoInfo.id, email: ngoInfo.email });
    } else {
        res.status(400);
        throw new Error("NGO data is not valid");
    }
});

//@desc Login NGO
//@route POST api/ngo/login
//@access public
const loginNGO = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }

    const ngoRegister = await NgoRegister.findOne({ email });

    const ngo = await NgoInfo.findOne({ email });

    if (ngoRegister && await bcrypt.compare(password, ngoRegister.password)) {
        const accessToken = jwt.sign(
            {
                id: ngoRegister._id,
                name: ngoRegister.name,
                email: ngoRegister.email,
                role: ngoRegister.role,
                category: ngo.category,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
});

//@desc Current NGO information
//@route GET api/ngo/current
//@access private
const currentNGO = ( (req, res) => {
    res.json(req.user);
});

//@desc Fetch Category NGOs
//@route GET api/ngo/:category
//@access public
const getNgo = asyncHandler( async (req, res) => {
    const category = req.params.category;
    if (!category){
        res.status(400);
        throw new Error("Category not valid");
    }
    const ngos = await NgoInfo.find({ category });

    if (ngos.length > 0) {
        res.status(200).json(ngos);
    } else {
        res.status(404);
        throw new Error("No NGO found with the category");
    }
});

//@desc Update NGO information
//@route PUT api/ngo/update
//@access private
const updateNGO = asyncHandler ( async (req, res) => {
    const { name, email, contact_no, location, category, subcategory } = req.body;
    const ngo = await NgoInfo.findOne({ email });
    if (!ngo) {
        res.status(400);
        throw new Error("NGO is not registered. Please register first.");
    }
    const ngoInfo = await NgoInfo.updateOne({
        ngoId: ngo._id,
        name,
        email,
        contact_no,
        location,
        category,
        subcategory,
    });
    if (ngoInfo) {
        console.log('NGO Info Updated');
        res.status(201).json({ _id: ngoInfo.id, email: ngoInfo.email });
    } else {
        res.status(400);
        throw new Error("NGO data is not valid");
    }
});

//@desc Delete NGO information
//@route DELETE api/ngo/delete
//@access private
const deleteNGO = asyncHandler ( async (req, res) => {
    const { email } = req.body;
    const ngo = await NgoInfo.findOne({ email });
    const ngoRegister = await NgoRegister.findOne({ email });
    if (!ngoRegister) {
        res.status(400);
        throw new Error("NGO is not registered. Please register first.");
    }
    if (!ngo) {
        res.status(400);
        throw new Error("NGO is not registered. Please register first.");
    }
    const ngoDelete = await NgoRegister.deleteOne({
        _id: ngo._id,
    });
    const ngoInfo = await NgoInfo.deleteOne({
        ngoId: ngo._id,
    });
    if (ngoInfo && ngoDelete) {
        console.log('NGO Info Deleted');
        res.status(201).json({ _id: ngoInfo.id, email: ngoInfo.email });
    } else {
        res.status(400);
        throw new Error("NGO data is not valid");
    }  
});

//@desc Logout NGO
//@route POST api/ngo/logout
//@access private
const logoutNGO = (req, res) => {
    res.json({ message: "Logged out successfully" });
};

module.exports = { registerNGO, registerNGOInfo, loginNGO, currentNGO, logoutNGO, getNgo, updateNGO, deleteNGO };
