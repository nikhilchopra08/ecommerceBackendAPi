const jwt = require("jsonwebtoken");

const verifyToken = (req , res , next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token , process.env.JWT_SEC, (err , user) => {
            if(err) res.status(403).json("Token is not valid");
            req.user = user;
            next();
        })
    }else{
        return res.json("you are not authorised")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.Isadmin){
            next();
        } else {
            res.status(402).json("Not allowed");
        }
    });
};

// const verifyTokenAndAdmin1 = (req, res, next) => {
//     verifyToken(req, res, () => {
//         console.log(req.user);
//         if (req.user.Isadmin){
//             next();
//         } else {
//             res.status(402).json("Not allowed");
//         }
//     });
// };

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log(req.user);
        if (req.user.isadmin) {
            next();
          } else {
            res.status(403).json("You are not alowed to do that!");
          }
        });
      };



module.exports = {verifyToken , verifyTokenAndAuthorization , verifyTokenAndAdmin};