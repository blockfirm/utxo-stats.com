var $ = require('jquery');
var config = require('./config');

function positionToHeight(x, y) {
  return y * config.BLOCKS_PER_ROW + x + 1;
}

function isInsideBoundary(height, totalHeight, x, y, offsetX, offsetY) {
  if (x + offsetX < 0 || x + offsetX > 299) {
    return false;
  }

  if (height < 1 || height > totalHeight) {
    return false;
  }

  return true;
}

function flipMagnifier(element, pageY) {
  var windowHeight = $(window).height();
  var scrollTop = $(document).scrollTop();
  var magnifierHeight = 115;

  if (pageY + magnifierHeight - scrollTop >= windowHeight) {
    element.addClass('top');
  } else {
    element.removeClass('top');
  }
}

module.exports = function renderMagnifier(element, meta, block, max, colorFunction, valueFunction, event) {
  var canvas = element.find('canvas').get(0);
  var context = canvas.getContext('2d');
  var link = $('#block-link');
  var row = event.offsetY;
  var col = event.offsetX;
  var height = positionToHeight(event.offsetX, event.offsetY);

  app.height = height;
  app.value = valueFunction(block[height] || 0);

  link.attr('href', 'https://blockchain.info/search?search=' + height);

  element.css({
    top: event.pageY + 'px',
    left: event.pageX + 'px'
  });

  flipMagnifier(element, event.pageY);

  context.clearRect(0, 0, canvas.width, canvas.height);

  var offsetX, offsetY;

  for (var r = 0; r < 11; ++r) {
    for (var c = 0; c < 11; ++c) {
      offsetY = (r - 5) * config.BLOCKS_PER_ROW;
      offsetX = c - 5;
      value = block[height + offsetY + offsetX] || 0;

      // Don't render blocks outside the boundaries.
      if (!isInsideBoundary(height + offsetY + offsetX, meta.height, col, row, offsetX, offsetY)) {
        context.fillStyle = '#1f1f1f';
      } else {
        context.fillStyle = colorFunction(value, max);
      }

      context.fillRect(c*20, r*20, 20, 20);

      if (r === 5 && c === 5) {
        context.strokeStyle = '#ffffff';
        context.lineWidth = '2';
        context.strokeRect(c*20, r*20, 20, 20);
      }
    }
  }
};
