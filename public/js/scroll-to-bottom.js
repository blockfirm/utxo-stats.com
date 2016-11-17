var $ = require('jquery');

module.exports = function scrollToBottom() {
  setTimeout(function () {
    var scrollTop = $(document).height() - $(window).height();

    $('html, body').scrollTop(scrollTop);

    // Force event in case no scrolling took place.
    $(document).scroll();
  });
};
