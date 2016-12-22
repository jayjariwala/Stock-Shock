

$(document).ready(function(){


})

function stockeffect()
{
  console.log("it is being called");
  $('#graph').hide();
  $('.confirm').hide();
  $('.code_buttons').css("height","50px");
}

function enable(value)
{
  console.log("Enable is being called"+value);
$('.con'+value).show();
$('.code'+value).css("height","80px");
}
