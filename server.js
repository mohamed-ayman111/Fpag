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
const app = express();
const env = process.env;
const config = {
    mon : env.MONURI ,
    port : env.PORT || 3000 ,
    host : env.HOSTNAME
}
const hostname = config.host || '127.0.0.1' ;
const port = config.port || 3000 ;
//static files
//app.use('/css',express.static(path.join(__dirname,'public')));
//app.use('/images',express.static(path.join(__dirname,'public')));
/*app.use((req,res,next) => {
    console.log(req.method, req.url);next()
});*/
app.use(express.static(path.join(__dirname,'public')));
console.log("mongoose:",env.MONURI);
mongoose.connect(config.mon)
.then(() =>{ console.log("Connected successfly to db.");
    app.listen(port,hostname,() => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
})
.catch(err =>{console.log("DB error :",err);
    process.exit(1);
});
/*/pages
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'views','main.html'));
});*/
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
app.get('/', (req,res,next) => sendpage(req,res,next,'main.html'));
app.get('/about',(req,res,next) => sendpage(req,res,next,'about.html'));
app.get('/login',(req,res,next) =>sendpage(req,res,next,'login.html'));
app.get('/register',(req,res,next) =>sendpage(req,res,next,'register.html'));
app.get('/respass',(req,res,next) => sendpage(req,res,next,'respass.html'));

app.use(express.urlencoded({extended:true}));
//respass post.
app.post('/respass',(req,res)=>{
    console.log(`Reset email:`,req.body);
    const {email} = req.body;
    const cleanemail = email.trim().toLowerCase();
    const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanemail){
        return res.status(400).send("Email is require.");
    }
    if (!emailpattern.test(cleanemail)){
        return res.status(400).send("Invild email.");
    }
    res.status(200).send(`Done .`);
});
//login post.
app.post('/login',(req,res)=> {
    console.log(`login data:`,req.body);
    const { username , password } = req.body;
    if ( !username || !password ){
        return res.status(400).send("All fields required.");
    }
    res.status(200).send(`Welcome ${username}.`);
});

//Registration form proccessing.
const User = require("./models/user");
const bcrypt = require("bcrypt");
app.post('/register', async (req,res)=>{
    try {
    console.log(`Register data:`,req.body);
    const { username , email , password , confirmpassword } = req.body;
    if ( !username || !email || !password || !confirmpassword ){
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
    return res.status(400).send("Invaild username.");
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
res.status(200).send(`Welcome ${cleanusername} registred successfly.`);
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