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

        if(snapshot.name==null)
        {
          io.emit('stock code','stockerr');
        }
        else {
          stock_data.find({stock_code : stockCode},function(err,available){
            if(available =="")
            {
              var timestamp = Math.floor(Date.now() /1000);
              var processid= process.pid;
              var ranNum = Math.random() * (100 - 0) + 100;
              var sid= timestamp+''+processid+''+ranNum;
              var userstock = new stock_data({
                s_id:sid,
                stock_code:snapshot.symbol
                });
                userstock.save(function(err){
                  if(err) throw err;
                  console.log("information stored successfully");
                  stock_data.find({},function(err,allstocks){
                    var retrivedstocks =[];
                      allstocks.forEach(function(each){

                        retrivedstocks.push(each.stock_code);
                      })
                      console.log(retrivedstocks.toString());
                  yahooFinance.historical({
                        symbols:retrivedstocks,
                        from:'2016-01-01',
                        to:'2016-12-01',
                        period:'m'
                      },function(err,stockhis){
                        console.log(stockhis);
                      });
                  })
                });
            }
            else {
                  io.emit('stock code', 'stockavail');
            }

          });

          /*
          yahooFinance.historical({
            symbol:stockCode,
            from:'2016-01-01',
            to:'2016-12-01',
            period:'m'
          },function(err,stock){


            var stock_d = [];

            for(var i=0 ; i< stock.length  ; i++)
            {
                stock_d.push(stock[i].high);
            }

        /*    console.log("This Should be 12:"+stock_d.length);

             */
      /*    });  */



        }


      })

    });

  })




}
