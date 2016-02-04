$('.nav-toggle').on('click', function (event){
  event.preventDefault();
  $('.wrapper').toggleClass('open');
});