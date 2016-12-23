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

  /*  var retrivedstocks =[];
    stock_data.find({},function(err,allstocks){
        allstocks.forEach(function(each){
          retrivedstocks.push(each.stock_code);
        })

    yahooFinance.historical({
          symbols:retrivedstocks,
          from:formatedyearback,
          to:currentdate,
          period:'m'
        },function(err,stockhis){

var sendfinalstock =[];
console.log("The value of final array is"+sendfinalstock.length)



          retrivedstocks.forEach(function(allstocks){
            var stockprice=[];
            var sobj=stockhis[allstocks];
            sobj.forEach(function(data){
              stockprice.push(data.close);
            })

        var color = randomColor({
         luminosity: 'bright',
         format: 'rgb'
      });
      var newcolor= color.replace('rgb','rgba');
      var ncolor=(newcolor.replace(')','')).concat(',0.4)');
      var jcolor=ncolor.concat(',0.1)');
      var borderColor=ncolor.concat(',1)');



        console.log(color);
            var stockobj={
              label: allstocks,
              fill: true,
              lineTension: 0.1,
              backgroundColor: jcolor,
              borderColor: borderColor,
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "rgba(239,107,1,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(255,255,255,1)",
              pointHoverBorderColor: borderColor,
              pointHoverBorderWidth: 5,
              pointRadius: 5,
              pointHitRadius: 15,
              data: stockprice,
              spanGaps: true,
            }

            sendfinalstock.push(stockobj);
            console.log("The length of the object is"+allstocks);


          });

*/
//          console.log("THIS IS FINAL BOSS"+sendfinalstock);

      //    console.log(">>>>>PRINT AN OBJECT"+sendfinalstock);

      //    io.emit('user connection',sendfinalstock);

//        });
//    })

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
                  stocksdata.getallstocks(stock_data,yahooFinance,randomColor,io);
                /*  stock_data.find({},function(err,allstocks){

                      allstocks.forEach(function(each){

                        retrivedstocks.push(each.stock_code);
                      })
                      console.log(retrivedstocks.toString());
                  yahooFinance.historical({
                        symbols:retrivedstocks,
                        from:formatedyearback,
                        to:currentdate,
                        period:'m'
                      },function(err,stockhis){
                        console.log("what is this?"+stockhis);
                      });
                  }) */
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
