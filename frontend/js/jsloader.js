

$(document).ready(function(){
  console.log("print this");

  $('.confirm').hide();
  $('.code_buttons').css("height","50px");

  $('.rmv').click(function(){
    $('.confirm').show();
    $('.code_buttons').css("height","80px");
  })
})
