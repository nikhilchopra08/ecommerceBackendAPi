const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");

//Register

router.post("/register" ,async (req , res) => {
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    });

    try{
    const SavedUser = await newUser.save(); 
    res.status(201).json(SavedUser)
    }catch(error) {
        res.status(500).json(error)
    }
});

//Login

router.post("/login" , async(req , res) => {
    try{
        const user = await User.findOne({username : req.body.username});
        if (!user) {
            return res.status(401).json("Wrong Credentials");
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );


        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;

        originalPassword != inputPassword && 
        res.status(401).json("Wrong Password");

        const accesstoken = jwt.sign({
            id: user._id,
            isadmin: user.Isadmin
        }, process.env.JWT_SEC , 
        {expiresIn: "3d"}
        );

        const {password , ...other} = user._doc;

        res.status(200).json({...other , accesstoken});
    } catch (error) {
        console.log(error);
};
}); 

module.exports = router;