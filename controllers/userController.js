const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


//@desc Resgister the User 
//@route POST api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if ( !name || !email || !password ){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({email});
    if (userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, password: hashedPassword, deletedAt: null});
    if (user){
        console.log(`User Created`);
        res.status(201).json({_id: user.id, email: user.email});
    }
    else{
        res.status(400);
        throw new Error("User data is not valid");
    }
});


//@desc Login User 
//@route POST api/users/login
//@access public
const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body;
    if ( !email || !password ){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    
    const user = await User.findOne({ email });
    if ( user && await bcrypt.compare(password, user.password)){
        const accessToken = jwt.sign({
            user : {
                name: user.name,
                email: user.email,
                id: user.id,
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "2h"
            }
        );
        res.status(200).json({ accessToken });
    }
    else{
        res.status(401);
        throw new Error("email or password is not valid");
    }
});

//@desc Update User
//@route PATCH api/users/update
//@access private
const updatePassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    if (!password) {
        res.status(400);
        throw new Error("Password is required");
    }

    const user = await User.findById(req.user.user.id);
    if (user) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        res.status(200).json({ email: user.email, message: "Password Updated" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

//@desc Delete User
//@route DELETE api/users/delete
//@access private
const deleteUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user.user.id);
    if (user){
        await user.deleteOne();
        res.status(200).json({message: 'User removed', id: req.user.user.id});
    }
    else{
        res.status(404);
        throw new Error("User not found");
    }
}
);

//@desc Current User information
//@route GET api/users/current
//@access private
const currentUser = asyncHandler( async (req, res) => {
    res.json(req.user.user);
});

//@desc Logout user
//@route GET api/users/logout
//@access private
const logoutUser = (req, res) => {
    res.json({message: 'User logged out'});
};


module.exports = { registerUser, loginUser, currentUser, logoutUser, updatePassword, deleteUser };