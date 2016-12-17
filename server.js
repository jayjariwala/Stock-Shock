var express=require('express');
var app = express();
var bodyParser=require('body-parser');
var controller=require('./controller/stockController');
var http= require('http').Server(app);
var io=require('socket.io')(http);

app.use(express.static('./public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

controller(app,io);

var port= Number(process.env.PORT || 8086 );
http.listen(port);
