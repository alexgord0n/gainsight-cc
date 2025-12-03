<script>
document.addEventListener('DOMContentLoaded', function () {
  // Only run on homepage. Adjust if your home path is different.
  if (window.location.pathname !== '/') {
    return;
  }

  var widget = document.querySelector(
    '.widget-container--featured_topics[data-idx="6"] .featured-topics'
  );
  if (!widget) {
    return;
  }

  var list = widget.querySelector('.featured-topics__list');
  if (!list) {
    return;
  }

  var cards = list.querySelectorAll('.featured-topic');
  if (!cards || cards.length === 0) {
    return;
  }

  var wholeVisible = 2;      // fully visible cards
  var cardWidthPercent = 40; // must match CSS flex-basis above

  list.style.display = 'flex';
  list.style.willChange = 'transform';

  Array.prototype.forEach.call(cards, function (card) {
    card.style.flex = '0 0 ' + cardWidthPercent + '%';

    // Extra safety: hide description/meta if CSS gets overridden
    var desc = card.querySelector('.card-widget-text');
    if (desc) {
      desc.style.display = 'none';
    }

    var meta = card.querySelector('.post-meta__container');
    if (meta) {
      meta.style.display = 'none';
    }

    // Add "View" button
    var titleBlock = card.querySelector('.featured-topic__title');
    var mainLink = card.querySelector('.featured-topic__url-link');
    var existingBtn = card.querySelector('.featured-topic__view-btn');

    if (titleBlock && mainLink && !existingBtn) {
      var btn = document.createElement('a');
      btn.className = 'featured-topic__view-btn';
      btn.textContent = 'View';
      btn.href = mainLink.href;
      titleBlock.appendChild(btn);
    }
  });

  // Create arrows
  var prev = document.createElement('button');
  prev.type = 'button';
  prev.innerHTML = '&#10094;'; // <
  prev.className = 'ft-carousel__arrow ft-carousel__arrow--prev';

  var next = document.createElement('button');
  next.type = 'button';
  next.innerHTML = '&#10095;'; // >
  next.className = 'ft-carousel__arrow ft-carousel__arrow--next';

  widget.appendChild(prev);
  widget.appendChild(next);

  var currentIndex = 0;
  var total = cards.length;
  var maxIndex = Math.max(0, total - wholeVisible); // last slide index

  function updateSlider() {
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    var offset = cardWidthPercent * currentIndex;
    list.style.transform = 'translateX(-' + offset + '%)';

    var atStart = currentIndex === 0;
    var atEnd = currentIndex === maxIndex;

    prev.disabled = atStart;
    next.disabled = atEnd;

    if (atStart) {
      prev.classList.add('ft-carousel__arrow--disabled');
    } else {
      prev.classList.remove('ft-carousel__arrow--disabled');
    }

    if (atEnd) {
      next.classList.add('ft-carousel__arrow--disabled');
    } else {
      next.classList.remove('ft-carousel__arrow--disabled');
    }
  }

  prev.addEventListener('click', function () {
    currentIndex -= 1;
    updateSlider();
  });

  next.addEventListener('click', function () {
    currentIndex += 1;
    updateSlider();
  });

  updateSlider();
});
</script>
