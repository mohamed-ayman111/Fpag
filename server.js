/*const http = require('http');*/
const  express = require('express');
const path = require('path');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;
//static files
//app.use('/css',express.static(path.join(__dirname,'public')));
//app.use('/images',express.static(path.join(__dirname,'public')));
app.use((req,res,next) => {
    console.log(req.method, req.url);next()
});
app.use(express.static(path.join(__dirname,'public')));
//pages
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'views','main.html'));
});
app.get('/about',(req,res) => {
    res.sendFile(path.join(__dirname,'views','about.html'));
});
app.get('/login',(req,res) => {
    res.sendFile(path.join(__dirname,'views','login.html'));
});
app.get('/register',(req,res) => {
    res.sendFile(path.join(__dirname,'views','register.html'));
});
/*const server = http.createServer((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('Hello World');
});*/
app.listen(port,hostname,() => {
    console.log(`Server running at http://${hostname}:${port}/`);
});