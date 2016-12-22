

$(document).ready(function(){


})

function stockeffect()
{
  console.log("it is being called");
  $('#graph').hide();
  $('.confirm').hide();
  $('.code_buttons').css("height","50px");


  $('.rmv').click(function(){
    $('.confirm').show();
    $('.code_buttons').css("height","80px");
  })
}
