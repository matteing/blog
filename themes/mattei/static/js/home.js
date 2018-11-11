function bgUrl(image) {
    return 'url(/assets/img/' + image + ')';
};

document.addEventListener('DOMContentLoaded', function() {
    var imageAmount = 7;
    // set initial image
    var container = $('#image-showcase');
    var image = 0;
    container.css('background-image', bgUrl("background" + image + ".jpg"));
    setInterval(function() {
        image++;
        if (image > imageAmount) {
            image = 0
        }
        container.css('background-image', bgUrl("background" + image + ".jpg"));
    }, 6000)
});

$(document).ready(function() {
    var scroll_start = 0;
    var startchange = $('#hero-title');
    var offset = startchange.offset();
    var navbar = $("#navbar");
    if (startchange.length) {
        $(document).scroll(function() {
            scroll_start = $(this).scrollTop();
            if (scroll_start > offset.top) {
                navbar.addClass('navbar-dark')
            } else {
                navbar.removeClass('navbar-dark')
            }
        });
    }
});