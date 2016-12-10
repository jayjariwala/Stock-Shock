module.exports = function(app,io)
{
  app.get('/',function(req,res){
    res.render('index');



    res.end();
  });
  io.on('connection',function(socket){
    socket.on('stock code',function(msg){
      console.log('message: '+ msg);
    });

  })




}
