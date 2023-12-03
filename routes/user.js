const user = require("../models/user");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();
//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try {
        const updatedUser = await user.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedUser); // Corrected the response
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

//DELETE
router.delete("/:id" , verifyTokenAndAuthorization , async(req , res) => {
    try{
        await user.findByIdAndDelete(req.params.id)
        res.status(200).json("user has been deleted...")
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const UserGet = await user.findById(req.params.id);
        const { password, ...other } = UserGet._doc;

        res.status(200).json(other);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const UsersGet = query? await user.find().sort({ _id : -1}).limit(1) : await user.find();

        res.status(200).json(UsersGet);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


//STATS (HOW MANY USER REGISTERED)
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await user.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        // Use 'data' in further processing
        res.status(200).json(data); // Send the aggregated data as the response
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" }); // Handle error response
    }
});



module.exports = router;
