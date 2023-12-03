const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserRoute = require("./routes/user");
const AuthRoute = require("./routes/auth")
const ProductRoute = require("./routes/product")
const CartRoute = require("./routes/cart")
const OrderRoute = require("./routes/order")

dotenv.config();

mongoose.connect(
   process.env.CONNECTION_STRING
)
.then(() => console.log("connected"))
.catch((err) => {
    console.log(err)
}); 

app.use(express.json());
app.use("/api/users" , UserRoute);
app.use("/api/auth" , AuthRoute);
app.use("/api/product" , ProductRoute);
app.use("/api/carts" , CartRoute);
app.use("/api/orders" , OrderRoute);

app.listen(5000 , () => {
    console.log("backend is running on port 5000")
})