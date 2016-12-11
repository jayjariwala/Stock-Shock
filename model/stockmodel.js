var mongoose= require('mongoose');

module.exports =
{

getConnection : function()
{
  return mongoose.connect('mongodb://test:test@ds133158.mlab.com:33158/stock_shock');
},
createSchema : function(mongoose)
{
  var Schema=mongoose.Schema;
    var stockSchema= new Schema({
      s_id:String,
      stock_code:String,
      stock_name:String,
      Stock_values: Object
    });

  return user=mongoose.model('user_stock',stockSchema);
}

}
