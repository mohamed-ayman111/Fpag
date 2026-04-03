//const http = require('http');
const  express = require('express');
const path = ('path');
const app = express();
const hostname = '0.0.0.0';
const port = 3000;
//static files
app.use('/css',express.static(path.join(__dirname,'css')));
app.use('/images',express.static(path.join(__dirname,'images')));
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
    res.sendFile(path.join(__dirname,'views','register'));
});
/*const server = http.createServer((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('Hello World');
});*/
server.listen(port,hostname,() => {
    console.log(`Server running at http://${hostname}:${port}/`);
});