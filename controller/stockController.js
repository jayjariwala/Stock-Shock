var yahooFinance = require('yahoo-finance');
module.exports = function(app,io)
{
  app.get('/',function(req,res){
    res.render('index');

    yahooFinance.historical({
      symbol:'AAPL',
      from:'2015-01-01',
      to:'2016-12-01',
      period:'m'
    },function(err,quotes){
      console.log(quotes);
    })
    yahooFinance.snapshot({symbol:'AAPL',fields:['n']},function(err,snapshot){
      console.log(snapshot);
    })

    res.end();
  });
  io.on('connection',function(socket){
    socket.on('stock code',function(msg){
      console.log('message: '+ msg);
    });

  })




}
