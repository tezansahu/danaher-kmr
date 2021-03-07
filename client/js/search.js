$('.nav-item-hidden').addClass('hover').click(function(){
    $(this).addClass('hover').fadeIn();
});

$('div.searchbar').click(function() {
    $('.nav-item-hidden').toggleClass('hover').show();
}).hover(function() {
    $('.nav-item-hidden.hover').fadeIn();
}, function() {
    $('.nav-item-hidden.hover').fadeOut();
});