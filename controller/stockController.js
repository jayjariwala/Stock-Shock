var yahooFinance = require('yahoo-finance');
var model= require('../model/stockmodel');

var connection=model.getConnection();

var stock_data=model.createSchema(connection);

var retrivedstocks =[];
var sendfinalstock =[];
var stockprice=[];
module.exports = function(app,io)
{
  app.get('/',function(req,res){
    res.render('index');
    res.end();
  });
  io.on('connection',function(socket){
    stock_data.find({},function(err,allstocks){
        allstocks.forEach(function(each){
          retrivedstocks.push(each.stock_code);
        })
    yahooFinance.historical({
          symbols:retrivedstocks,
          from:'2016-01-01',
          to:'2016-12-01',
          period:'m'
        },function(err,stockhis){

          retrivedstocks.forEach(function(allstocks){

            var sobj=stockhis[allstocks];
            sobj.forEach(function(data){
              stockprice.push(data.close);
            })

            var stockobj={
              label: allstocks,
              fill: true,
              lineTension: 0.1,
              backgroundColor: "rgba(555,154,192,0.4)",
              borderColor: "rgba(555,154,192,1)",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "rgba(555,154,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(555,154,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: stockprice,
              spanGaps: false,
            }

            sendfinalstock.push(stockobj);

          });
          console.log("THIS IS FINAL BOSS"+sendfinalstock);
          io.emit('user connection',stockhis);
        });
    })

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
