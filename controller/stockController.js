var yahooFinance = require('yahoo-finance');
var model= require('../model/stockmodel');
var stocksdata=require('./retriveAllStocks');
var randomColor= require('randomcolor');
var moment = require('moment');
var connection=model.getConnection();

var stock_data=model.createSchema(connection);


var currentdate=moment().format('YYYY-MM-DD');
var yearback = moment().subtract(11,'months').calendar();
var formatedyearback=moment(yearback).format('YYYY-MM-DD');

module.exports = function(app,io)
{
  app.get('/',function(req,res){



    var dateStart = moment(formatedyearback);
    var dateEnd = moment(currentdate);
    var timeValues = [];

    while (dateEnd >= dateStart) {

       timeValues.push(dateStart.format('MMMM'));
       dateStart.add(1,'month');
    }

var quotedAndCommaSeparated = "'" + timeValues.join("','") + "'";

    res.render('index',{months:quotedAndCommaSeparated});
    res.end();
  });
  io.on('connection',function(socket){



    var sendfinalstock=stocksdata.getallstocks(stock_data,yahooFinance,randomColor,io);


    socket.on('stock code',function(stockCode){
      yahooFinance.snapshot({symbol:stockCode,fields:['n']},function(err,snapshot){
        var sessionid=socket.id;
        console.log("CLIENT SESSION ID:::"+sessionid);
        if(snapshot.name==null)
        {
          //send it to specific user
           io.sockets.connected[sessionid].emit('stock code','stockerr');

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
                  stocksdata.getallstocks(stock_data,yahooFinance,randomColor,io);

                });
            }
            else {

                 io.sockets.connected[sessionid].emit('stock code', 'stockavail');

            }

          });




        }


      })

    });

  })




}
