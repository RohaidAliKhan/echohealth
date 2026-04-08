var TAB_KEYS = ['efficiency', 'provider', 'member', 'payment', 'tech'];

var swiperConfigs = [
  { el: '.swiper-efficiency', count: 3 },
  { el: '.swiper-provider',   count: 1 },
  { el: '.swiper-member',     count: 2 },
  { el: '.swiper-payment',    count: 4 },
  { el: '.swiper-tech',       count: 2 }
];

document.addEventListener('DOMContentLoaded', function () {
  const locomotiveScroll = new LocomotiveScroll();
  updateHeaderIcon('efficiency');
  initTabListeners();
  initSwipers();
  initSvgAnimations();
  initBtnAnimations();
  initContentRevealScroll();
});

function updateHeaderIcon(activeTabId) {
  TAB_KEYS.forEach(function (key) {
    var el = document.getElementById('icon-' + key);
    if (!el) return;
    el.style.display = key === activeTabId ? '' : 'none';
  });
}

function switchTab(val) {
  var el = document.getElementById('tab-' + val);
  if (el) {
    bootstrap.Tab.getOrCreateInstance(el).show();
  }
}

function initTabListeners() {
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach(function (btn) {
    btn.addEventListener('shown.bs.tab', function () {
      var tabId = btn.id.replace('tab-', '');
      var sel = document.getElementById('mobileTopic');
      if (sel) sel.value = tabId;
      updateHeaderIcon(tabId);
    });
  });
}

function isMobile() {
  return window.innerWidth < 768;
}

function createSwiperInstance(cfg) {
  var isSingle = cfg.count <= 1;

  return new Swiper(cfg.el, {
    slidesPerView: isSingle ? 1 : 2,
    spaceBetween: 16,
    loop: false,
    navigation: isSingle ? false : {
      nextEl: cfg.el + ' .swiper-button-next',
      prevEl: cfg.el + ' .swiper-button-prev'
    },
    pagination: isSingle ? false : {
      el: cfg.el + ' .swiper-pagination',
      type: 'progressbar'
    },
    breakpoints: {
      992: { slidesPerView: isSingle ? 1 : 2 }
    }
  });
}

function initSwipers() {
  if (isMobile()) return;

  swiperConfigs.forEach(function (cfg) {
    var el = document.querySelector(cfg.el);
    if (!el || el._swiperInited) return;
    el._swiperInited = true;
    createSwiperInstance(cfg);
  });
}

function initSvgAnimations() {
  gsap.utils.toArray('[data-svg-animation]').forEach(function (svg) {
    svg.querySelectorAll('path').forEach(function (path) {
      gsap.to(path, {
        x: gsap.utils.random(-24, 24),
        duration: gsap.utils.random(3, 6),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: gsap.utils.random(0, 2.5),
      });
    });
  });
}

function initBtnAnimations() {
  document.querySelectorAll('[data-btn-animation]').forEach(function (btn) {
    var textNode = btn.childNodes[0];
    var originalText = textNode.nodeValue.trim();

    var wrapper = document.createElement('span');
    wrapper.className = 'btn-text-wrapper';

    originalText.split('').forEach(function (char) {
      var charSpan = document.createElement('span');
      charSpan.className = 'btn-char';
      charSpan.textContent = char === ' ' ? '\u00A0' : char;
      wrapper.appendChild(charSpan);
    });

    textNode.replaceWith(wrapper);

    var chars = wrapper.querySelectorAll('.btn-char');
    var svg = btn.querySelector('svg');
    var isAnimating = false;

    gsap.set(chars, { y: 0, opacity: 1 });

    btn.addEventListener('mouseenter', function () {
      isAnimating = true;

      gsap.killTweensOf(chars);

      gsap.to(chars, {
        y: -8,
        opacity: 0,
        duration: 0.18,
        stagger: 0.025,
        ease: 'power2.in',
        onComplete: function () {
          if (!isAnimating) return;
          gsap.set(chars, { y: 8, opacity: 0 });
          gsap.to(chars, {
            y: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.025,
            ease: 'power2.out'
          });
        }
      });

      gsap.to(svg, {
        scale: 1.15,
        rotate: -10,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', function () {
      isAnimating = false;

      gsap.killTweensOf(chars);

      gsap.to(chars, {
        y: 8,
        opacity: 0,
        duration: 0.15,
        stagger: 0.02,
        ease: 'power2.in',
        onComplete: function () {
          gsap.set(chars, { y: -8, opacity: 0 });
          gsap.to(chars, {
            y: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.02,
            ease: 'power2.out'
          });
        }
      });

      gsap.to(svg, {
        scale: 1,
        rotate: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
}


function initContentRevealScroll(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = gsap.context(() => {

    document.querySelectorAll('[data-reveal-group]').forEach(groupEl => {
      // Config from attributes or defaults (group-level)
      const groupStaggerSec = (parseFloat(groupEl.getAttribute('data-stagger')) || 100) / 1000; // ms → sec
      const groupDistance = groupEl.getAttribute('data-distance') || '2em';
      const triggerStart = groupEl.getAttribute('data-start') || 'top 80%';

      const animDuration = 0.8;
      const animEase = "power4.inOut";

      // Reduced motion: show immediately
      if (prefersReduced) {
        gsap.set(groupEl, { clearProps: 'all', y: 0, autoAlpha: 1 });
        return;
      }

      // If no direct children, animate the group element itself
      const directChildren = Array.from(groupEl.children).filter(el => el.nodeType === 1);
      if (!directChildren.length) {
        gsap.set(groupEl, { y: groupDistance, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: groupEl,
          start: triggerStart,
          once: true,
          onEnter: () => gsap.to(groupEl, { 
            y: 0, 
            autoAlpha: 1, 
            duration: animDuration, 
            ease: animEase,
            onComplete: () => gsap.set(groupEl, { clearProps: 'all' })
          })
        });
        return;
      }

      // Build animation slots: item or nested (deep layers allowed)
      const slots = [];
      directChildren.forEach(child => {
        const nestedGroup = child.matches('[data-reveal-group-nested]')
          ? child
          : child.querySelector(':scope [data-reveal-group-nested]');

        if (nestedGroup) {
          const includeParent = child.getAttribute('data-ignore') === 'false' || nestedGroup.getAttribute('data-ignore') === 'false';
          slots.push({ type: 'nested', parentEl: child, nestedEl: nestedGroup, includeParent });
        } else {
          slots.push({ type: 'item', el: child });
        }
      });

      // Initial hidden state
      slots.forEach(slot => {
        if (slot.type === 'item') {
          // If the element itself is a nested group, force group distance (prevents it from using its own data-distance)
          const isNestedSelf = slot.el.matches('[data-reveal-group-nested]');
          const d = isNestedSelf ? groupDistance : (slot.el.getAttribute('data-distance') || groupDistance);
          gsap.set(slot.el, { y: d, autoAlpha: 0 });
        } else {
          // Parent follows the group's distance when included, regardless of nested's data-distance
          if (slot.includeParent) gsap.set(slot.parentEl, { y: groupDistance, autoAlpha: 0 });
          // Children use nested group's own distance (fallback to group distance)
          const nestedD = slot.nestedEl.getAttribute('data-distance') || groupDistance;
          Array.from(slot.nestedEl.children).forEach(target => gsap.set(target, { y: nestedD, autoAlpha: 0 }));
        }
      });

      // Extra safety: if a nested parent is included, re-assert its distance to the group's value
      slots.forEach(slot => {
        if (slot.type === 'nested' && slot.includeParent) {
          gsap.set(slot.parentEl, { y: groupDistance }); 
        }
      });

      // Reveal sequence
      ScrollTrigger.create({
        trigger: groupEl,
        start: triggerStart,
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          slots.forEach((slot, slotIndex) => {
            const slotTime = slotIndex * groupStaggerSec;

            if (slot.type === 'item') {
              tl.to(slot.el, { 
                y: 0, 
                autoAlpha: 1, 
                duration: animDuration, 
                ease: animEase,
                onComplete: () => gsap.set(slot.el, { clearProps: 'all' })
              }, slotTime);
            } else {
              // Optionally include the parent at the same slot time (parent uses group distance)
              if (slot.includeParent) {
                tl.to(slot.parentEl, {
                  y: 0,
                  autoAlpha: 1,
                  duration: animDuration,
                  ease: animEase,
                  onComplete: () => gsap.set(slot.parentEl, { clearProps: 'all' })
                }, slotTime);
              }
              // Nested children use nested stagger (ms → sec); fallback to group stagger
              const nestedMs = parseFloat(slot.nestedEl.getAttribute('data-stagger'));
              const nestedStaggerSec = isNaN(nestedMs) ? groupStaggerSec : nestedMs / 1000;
              Array.from(slot.nestedEl.children).forEach((nestedChild, nestedIndex) => {
                tl.to(nestedChild, { 
                  y: 0, 
                  autoAlpha: 1, 
                  duration: animDuration, 
                  ease: animEase,
                  onComplete: () => gsap.set(nestedChild, { clearProps: 'all' })
                }, slotTime + nestedIndex * nestedStaggerSec);
              });
            }
          });
        }
      });
    });

  });

  return () => ctx.revert();
}