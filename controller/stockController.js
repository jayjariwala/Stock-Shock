var yahooFinance = require('yahoo-finance');
var model= require('../model/stockmodel');

var connection=model.getConnection();

var stock_data=model.createSchema(connection);


module.exports = function(app,io)
{
  app.get('/',function(req,res){
    res.render('index');
    res.end();
  });
  io.on('connection',function(socket){
    socket.on('stock code',function(stockCode){
      yahooFinance.snapshot({symbol:stockCode,fields:['n']},function(err,snapshot){
        var stockObj ={

        }
        if(snapshot.name==null)
        {
          io.emit('stock code','stockerr');
        }
        else {
          yahooFinance.historical({
            symbol:stockCode,
            from:'2015-01-01',
            to:'2016-12-01',
            period:'m'
          },function(err,stock){
            var userstock = new stock_data({
              s_id:'abc',
              stock_code:'xyz',
              stock_name:'lmn',
              Stock_values: ['a','b','c']
              });

              userstock.save(function(err){
                if(err) throw err;
                console.log("information stored successfully");
                })
          });
        }









      })

    });

  })




}
