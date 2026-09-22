/*const http = require('http');*/
require('dotenv').config();
/*process.on('uncaughtException', err => {
    console.error("UNCAUGHT ERROR:", err);
});

process.on('unhandledRejection', err => {
    console.error("PROMISE ERROR:", err);
});*/
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const env = process.env;
const config = {
    mon : env.MONURI ,
    port : env.PORT || 3000 ,
    host : env.HOSTNAME
}
const hostname = config.host || '0.0.0.0' ;
const port = config.port || 3000 ;
//static files
//app.use('/css',express.static(path.join(__dirname,'public')));
//app.use('/images',express.static(path.join(__dirname,'public')));

/*
app.use((req,res,next) => {
    console.log(req.method, req.url);next()
});
*/

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname,'public')));
console.log(MongoStore);
console.log("MongoDB URI loaded:", !!process.env.MONGO_URI);
mongoose.connect(config.mon)
.then(() =>{ console.log("Connected successfly to db.");
    app.listen(port,hostname,() => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
})
.catch(err =>{console.log("DB error :",err);
    process.exit(1);
});

/*
/pages
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'views','main.html'));
});
*/

function sendpage(req,res,next,filename) {
    const filepath = path.join(__dirname,'views',filename);
    res.sendFile(filepath,(err) => {
        if (err) {
            next(err);
        }
    });
}
//To check error 500
/*app.get('/error',(req,res,next) => {
    throw new Error("Test server Error");
});*/

app.use(helmet());

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "upgrade-insecure-requests": null
            }
        }
    })
);


app.use(session({
    name : 'sid' ,
    secret : process.env.SESSION_SECRET ,
    resave : false ,
    saveUninitialized : false ,
    store : MongoStore.create({
        mongoUrl : config.mon ,
        collectionName : 'sessions'
    }),
    cookie : {
        maxAge : 1000 * 60 *60 *24 ,
        httpOnly : true ,
        secure : false ,
        sameSite : 'lax'
    }
}));

function isAuth(req,res,next){
    if (!req.session.userId){
        return res.status(401).redirect('/login');        
    }
    next();
}
async function isAdmin (req,res,next){

    try {

        if (!req.session.userId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).sendFile(path.join(__dirname,'views','403.html'));
        }

        req.user = user;

        next();

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Authorization failed"
        });

    }
}
function isGuest(req,res,next){
    if (req.session.userId){
        return res.redirect('/');
    }
    next();
}
function requirePasswordResetVerification(req, res, next) {

    if (
        !req.session.passwordResetVerified ||
        !req.session.passwordResetUserId
    ) {
        return res.redirect("/respass.html");
    }

    next();
}

app.get('/',/*isGuest,*/(req,res,next) => sendpage(req,res,next,'main.html'));
app.get('/about',/*isGuest,*/(req,res,next) => sendpage(req,res,next,'about.html'));
app.get('/PRELIMINARYPAGES',/*isGuest,*/(req,res,next) => sendpage(req,res,next,'PRELIMINARYPAGES.html'));
app.get('/login',/*isGuest,*/(req,res,next) => sendpage(req,res,next,'login.html'));
app.get('/register',isGuest,(req,res,next) => sendpage(req,res,next,'register.html'));
app.get('/registration-success',isGuest,(req,res,next) => sendpage(req,res,next,'registration-success.html'));
app.get('/respass',isGuest,(req,res,next) => sendpage(req,res,next,'respass.html'));
app.get('/verify-otp',isGuest,(req,res,next) => sendpage(req,res,next,'verify-otp.html'));
app.get('/reset-password',requirePasswordResetVerification,(req,res,next) => sendpage(req,res,next,'reset-password.html'));
app.get('/dashboard' ,isAdmin, (req,res,next) => sendpage(req,res,next,'dashboard.html'));
app.get('/cart' ,isAuth, (req,res,next) => sendpage(req,res,next,'cart.html'));
app.get('/checkout' ,isAuth, (req,res,next) => sendpage(req,res,next,'checkout.html'));
app.get('/order-success' ,isAuth, (req,res,next) => sendpage(req,res,next,'order-success.html'));
app.get('/payment' ,isAuth, (req,res,next) => sendpage(req,res,next,'payment.html'));
app.get('/payment-test' ,isAuth, (req,res,next) => sendpage(req,res,next,'payment-test.html'));
app.get('/payment-success' ,isAuth, (req,res,next) => sendpage(req,res,next,'payment-success.html'));
app.get('/payment-failed' ,isAuth, (req,res,next) => sendpage(req,res,next,'payment-failed.html'));
app.get('/payment-cancelled' ,isAuth, (req,res,next) => sendpage(req,res,next,'payment-cancelled.html'));
app.get('/orders' ,isAuth, (req,res,next) => sendpage(req,res,next,'orders.html'));
app.get('/order-details' ,isAuth, (req,res,next) => sendpage(req,res,next,'order-details.html'));
app.get('/admin-orders' ,isAdmin, (req,res,next) => sendpage(req,res,next,'admin-orders.html'));
app.get('/admin-order-details' ,isAdmin, (req,res,next) => sendpage(req,res,next,'admin-order-details.html'));
app.get('/Addproduct',isAdmin,(req,res,next) => sendpage(req,res,next,'Addproduct.html'));
app.get('/admin' , isAdmin, (req,res) =>{
    res.send("Welcome admin.");
});
app.get('/Products', isAuth,(req,res,next) => sendpage(req,res,next,'Addproduct.html'));
app.get('/check',isAdmin,(req,res)=>{
    console.log(req.session);
    if (req.session.userId) {
        res.send("User logged in.");
    } else {
        res.send("Not logges in.");
    }
});

app.get("/api/auth/status", (req, res) => {

    if (!req.session.userId) {

        return res.json({
            loggedIn: false,
            role: "guest"
        });

    }

    res.json({
        loggedIn: true,
        userId: req.session.userId,
        role: req.session.role || "user"
    });
});
app.get('/logout' , (req,res) =>{
    req.session.destroy((error) => {

        if (error) {
            console.error(error);

            return res.status(500).send(
                "Unable to logout"
            );
        }

        res.clearCookie("connect.sid");

        res.redirect("/");
    });
});
app.get(
    "/edit-product",
    isAdmin,
    (req, res, next) => {

        sendpage(
            req,
            res,
            next,
            "edit-product.html"
        );

    }
);
app.use((req, res ,next) => {
    res.locals.user = req.session.user || null ;
    next();
});

app.use(express.urlencoded({extended:true}));

//Process product enrollment
app.post('/Products',async(req,res)=>{
    try{
        const Product = require("./models/Product"); 
        const { name,category,description,price,image,stock} = req.body;
        console.log("Product enrollment:",req.body);
        const newproduct = new Product({
            name: name ,
            category: category,
            description: description,
            price: price,
            image: image ,
            stock: stock
        });
        await newproduct.save();
        console.log("Product enrollment saved.");
        return res.status(200).redirect('/dashboard'); //send(`Data update ok.`);
    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to enrollment products"
        });

    }
});
//API product
const Product = require("./models/Product");

app.get("/api/products", async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch products"
        });

    }
});

//Delete product
app.delete(
    "/api/products/:id",
    isAdmin,
    async (req, res) => {

        try {

            const product =
                await Product.findByIdAndDelete(req.params.id);

            if (!product) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }

            res.status(200).json({
                message: "Product deleted successfully"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to delete product"
            });

        }

    }
);
//Edit product
//const Product = require("./models/Product");
app.get(
    "/api/products/:id",
    isAdmin,
    async (req, res) => {

        try {

            const product =
                await Product.findById(
                    req.params.id
                );


            if (!product) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }


            res.status(200).json(product);


        } catch (error) {

            console.error(
                "Get product error:",
                error
            );


            res.status(500).json({
                message:
                    "Failed to get product"
            });

        }

    }
);

/*
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));
*/

app.patch(
    "/api/products/:id",
    isAdmin,
    async (req, res) => {

        try {
            console.log("BODY:", req.body);
            const {
                name,
                category,
                description,
                price,
                image,
                stock
            } = req.body;


            if (
                !name ||
                !category ||
                !description ||
                !price ||
                !image ||
                !stock
            ) {

                return res.status(400).json({

                    message:
                        "All fields are required"

                });

            }


            const updatedProduct =
                await Product.findByIdAndUpdate(

                    req.params.id,

                    {
                        name,
                        category,
                        description,
                        price,
                        image,
                        stock
                    },

                    {
                        new: true,
                        runValidators: true
                    }

                );


            if (!updatedProduct) {

                return res.status(404).json({

                    message:
                        "Product not found"

                });

            }


            res.status(200).json({

                message:
                    "Product updated successfully",

                product:
                    updatedProduct

            });


        } catch (error) {

            console.error(
                "Update product error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to update product"

            });

        }

    }
);

//Create order

const orderRoutes =
    require("./routes/orderRoutes");
    app.use(
    "/api/orders",
    orderRoutes
);

//Admin dashboard router
const adminRoutes =
    require("./routes/adminRoutes");
    app.use(
    "/api/admin",
    adminRoutes
);

//Payment routes
const paymentRoutes =
    require("./routes/paymentRoutes");
app.use(
    "/api/payments",
    paymentRoutes
);

//Passrest router
const PassresetRoutes =
    require("./routes/PassresetRoutes");
    app.use(
    "/",
    PassresetRoutes
);

/*
app.post("/api/orders", async (req, res) => {

    try {

        const Order =
            require("./models/Order");

        const Product =
            require("./models/Product");

        const {
            customer,
            items
        } = req.body;

        if (
            !customer ||
            !items ||
            items.length === 0
        ) {

            return res.status(400).json({
                message: "Invalid order data"
            });

        }

        let totalAmount = 0;

        const orderItems = [];

        for (const item of items) {

            const product =
                await Product.findById(
                    item.product
                );

            if (!product) {

                return res.status(404).json({
                    message:
                        "Product not found"
                });

            }

            if (
                product.stock <
                item.quantity
            ) {

                return res.status(400).json({
                    message:
                        `Not enough stock for ${product.name}`
                });

            }

            totalAmount +=
                product.price *
                item.quantity;

            orderItems.push({

                product: product._id,

                quantity: item.quantity,

                price: product.price

            });

        }

        const order =
            new Order({

                customer,

                items: orderItems,

                totalAmount

            });

        await order.save();

        res.status(201).json({

            message:
                "Order created successfully",

            orderId:
                order._id

        });

    } catch (error) {

        console.error(
            "Create order error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to create order"

        });

    }

});
*/

//login post.
app.post('/login', async (req,res) => {
    try{
    console.log(`login data:`,req.body);
    const { username , password } = req.body;
    if ( !username||username == "" || !password||password == "" ){
        return res.status(400).send("All fields required.");
    }
    //Search user on db.
    const user = await User.findOne({ username });
    if ( !user ){
        console.log("User not found.");
        return res.status(400).send("Username or pssword not corrct.");
    } else {
        console.log("User exists.");
    }
    //Compare password.
    const isMatch = await bcrypt.compare(password, user.password);
    if  (!isMatch){
        return res.status(400).send("Username or pssword not corrct.");
    }
    req.session.userId = user._id;
        req.session.role = user.role;

       return res.redirect("/");
    //res.status(200).send(`Welcome ${user.username}`)
    //res.status(200).send(`Welcome ${user.username}.`);
} catch (err){
    console.error(err);
    res.status(500).send("Server error.");
} });
//Secere from brute foce.
const loginlimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 5
});
app.use('/login', loginlimiter);
//Registration form proccessing.
const User = require("./models/user");
const bcrypt = require("bcrypt");
app.post('/register', async (req,res)=>{
    try {
    console.log(`Register data:`,req.body);
    const { username , email , password , confirmpassword } = req.body;
    if ( !username||username == "" || !email||email == "" || !password||password == "" || !confirmpassword||confirmpassword == "" ){
        return res.status(400).send("All fields required.");
    }
    //Clean user inputs.
const cleanusername = username.trim();
const cleanemail = email.trim().toLowerCase();
    //Check existinguser from db.
    const existinguser = await User.findOne({email : cleanemail});
    if (existinguser) {
        return res.status(400).send("Email already existing.");
    }
    
//Check username.
const userpattern = /^[a-zA-Z0-9_]{3,20}$/;
if ( !userpattern.test(cleanusername) ){
     res.status(400).send("Invaild username.");
}
//Check email.
const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if ( !emailpattern.test(cleanemail) ){
    return res.status(400).send("Invlid email.");
}
//Check password.
const passwordpattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
if ( !passwordpattern.test(password) ){
    return res.status(400).send("Weak password.");
}
if ( password != confirmpassword ){
    return res.status(400).send("Password do not match.");
}
//Hash password.
const hashedpassword = await bcrypt.hash(password, 10);
 //Create user.
const newUser = new User({
    username : cleanusername,
    email : cleanemail ,
    password : hashedpassword
 });
console.log(`saved user:`,{
    username : cleanusername,
    email : cleanemail,
    password : hashedpassword
});
//Save the user on db.
await newUser.save();
res.redirect("/registration-success");
 } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
}
   // res.status(200).send(`Welcome ${username} registred successfly`);
});  
app.use((req,res,next) =>{
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});
app.use((err,req,res,next) => {
    console.error(err);
    const errormap ={
        ENOENT : 404,
        EACCES :403,
        EISDIR:400,
        ENOTDIR:400,
        ENAMETOOLONG:400,
        ECONNREFUSED:502,
        ETIMDOUT:504
    };
    const errorpage = {
        400 : '400.html',
        403 : '403.html',
        404 : '404.html',
        500 : '500.html',
        502 : '502.html',
        504 : '504.html'
    };
    //select the status
    let status = err.status || errormap[err.code] || 500;
    
    //select the page
    let file = errorpage[status] || '500.html';
    
    //send the page
    return res.status(status).sendFile(path.join(__dirname,'views',file));
});
    /*console.error(err);
    let status = err.status || 500;
    if(err.code === 'ENOENT') status = 404;
    if(err.code === 'EACCES') status = 403;
    if(err.code === 'EISDIR') status = 400;
    if(err.code === 'ENOTDIR') status = 400;
    if(err.code === 'ENAMETOOLONG') status = 400;
    if(err.code === 'EADDRINUSE') status = 500;
    if(err.code === 'EPIPE') status = 500;
    if(err.code === 'ECONNRESET') status = 500;
    if(err.code === 'ECONNREFUSED') status = 502;
    if(err.code === 'ETIMEDOUT') status = 504;
    //send pags
    if(status === 404){
        return app.use((req,res) => {
            res.status(404).sendFile(path.join(__dirname,'views','404.html'));
        });
        ///res.status(404).sendFile(path.join(__dirname,'views','404.html'));
    }
    if (status === 403){
        return res.status(403).sendFile(path.join(__dirname,'views','403.html'));
    }
    if (status === 400){
        return res.status(400).sendFile(path.join(__dirname,'views','400.html'));
    }
    if(status === 500){
        return res.status(500).sendFile(path.join(__dirname,'views','500.html'));
    }
    if (status === 502){
        return res.status(502).sendFile(path.join(__dirname,'views','502.html'));
    }
    if (status === 504){
        return res.status(504).sendFile(path.join(__dirname,'views','504.html'));
    }
});
/*const server = http.createServer((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('Hello World');
});*/
/*app.listen(port,hostname,() => {
    console.log(`Server running at http://${hostname}:${port}/`);
});*/