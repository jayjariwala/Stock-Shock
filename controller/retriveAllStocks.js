var moment = require('moment');
var currentdate=moment().format('YYYY-MM-DD');
var yearback = moment().subtract(11,'months').calendar();
var formatedyearback=moment(yearback).format('YYYY-MM-DD');

module.exports =
{
  getallstocks : function(stock_data,yahooFinance,randomColor,io)
  {
    var retrivedstocks =[];
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

          io.emit('user connection',sendfinalstock);

         });



        })

  }


}
