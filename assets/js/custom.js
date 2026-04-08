var TAB_KEYS = ['efficiency', 'provider', 'member', 'payment', 'tech'];

function updateHeaderIcon(activeTabId) {
  TAB_KEYS.forEach(function (key) {
    var el = document.getElementById('icon-' + key);
    if (!el) return;
    el.style.display = key === activeTabId ? '' : 'none';
  });
}

/* Switch tab from mobile dropdown */
function switchTab(val) {
  var el = document.getElementById('tab-' + val);
  if (el) {
    bootstrap.Tab.getOrCreateInstance(el).show();
  }
}

/* Listen for Bootstrap tab changes */
document.querySelectorAll('[data-bs-toggle="tab"]').forEach(function (btn) {
  btn.addEventListener('shown.bs.tab', function () {
    var tabId = btn.id.replace('tab-', '');

    /* sync mobile dropdown */
    var sel = document.getElementById('mobileTopic');
    if (sel) sel.value = tabId;

    /* swap icon */
    updateHeaderIcon(tabId);
  });
});

/* ============================================================
   Swiper init
   ============================================================ */
var swiperConfigs = [
  { el: '.swiper-efficiency', count: 3 },
  { el: '.swiper-provider',   count: 1 },
  { el: '.swiper-member',     count: 2 },
  { el: '.swiper-payment',    count: 4 },
  { el: '.swiper-tech',       count: 2 }
];

function isMobile() {
  return window.innerWidth < 768;
}

function initSwipers() {
  if (isMobile()) return;

  swiperConfigs.forEach(function (cfg) {
    var el = document.querySelector(cfg.el);
    if (!el || el._swiperInited) return;
    el._swiperInited = true;

    var isSingle = cfg.count <= 1;

    new Swiper(cfg.el, {
      slidesPerView: isSingle ? 1 : 2,
      spaceBetween: 16,
      loop: false,
      navigation: isSingle ? false : {
        nextEl: cfg.el + ' .swiper-button-next',
        prevEl: cfg.el + ' .swiper-button-prev'
      },
      pagination: isSingle ? false : {
        el: cfg.el + ' .swiper-pagination',
        clickable: true
      },
      breakpoints: {
        992: { slidesPerView: isSingle ? 1 : 2 }
      }
    });
  });
}

initSwipers();

/* Set default active icon on page load */
updateHeaderIcon('efficiency');