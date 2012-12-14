// Generated by CoffeeScript 1.4.0
(function() {
  var changeDom, checkDependencies, continueInit, getBestDisplayed, getOffset, init, nextHash, recoverScroll, setActive, setEvents, setNavBar, smoothScroll, tooltipElm, wrapper;

  nextHash = null;

  wrapper = null;

  tooltipElm = null;

  init = function() {
    if (checkDependencies()) {
      return window.addEventListener('load', continueInit, false);
    }
  };

  checkDependencies = function() {
    if (!('addEventListener' in window)) {
      return false;
    }
    if (!('querySelectorAll' in document)) {
      return false;
    }
    if (!('classList' in document.body)) {
      return false;
    }
    return true;
  };

  continueInit = function() {
    changeDom();
    return setEvents();
  };

  changeDom = function() {
    var elm, elms, _i, _len;
    elms = document.querySelectorAll('body > *');
    wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    for (_i = 0, _len = elms.length; _i < _len; _i++) {
      elm = elms[_i];
      if (elm.nodeName.toLowerCase() === 'nav') {
        continue;
      }
      wrapper.appendChild(elm);
    }
    return document.body.appendChild(wrapper);
  };

  setEvents = function() {
    var elm, linksWithHash, trans, _i, _j, _len, _len1, _ref, _results;
    window.addEventListener('scroll', setNavBar, false);
    setNavBar();
    linksWithHash = document.querySelectorAll('a[href*="#"]');
    for (_i = 0, _len = linksWithHash.length; _i < _len; _i++) {
      elm = linksWithHash[_i];
      elm.addEventListener('click', smoothScroll, false);
    }
    _ref = ['webkitTransitionEnd', 'oTransitionEnd', 'otransitionend', 'transitionend'];
    _results = [];
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      trans = _ref[_j];
      _results.push(document.addEventListener(trans, recoverScroll, false));
    }
    return _results;
  };

  setNavBar = function(e) {
    var bestDisplayed;
    bestDisplayed = getBestDisplayed();
    return setActive(bestDisplayed);
  };

  setActive = function(bestDisplayed) {
    var aElm, active;
    aElm = document.querySelector(".inline-menu a[href$='" + bestDisplayed.id + "']");
    active = document.querySelectorAll(".inline-menu .active");
    [].forEach.call(active, function(elm) {
      return elm.classList.remove('active');
    });
    aElm.parentNode.classList.add('active');
  };

  getBestDisplayed = function() {
    var bestDisplayed, elms, scroll;
    elms = document.getElementsByTagName('section');
    bestDisplayed = elms[0];
    scroll = window.scrollY + 5;
    [].forEach.call(elms, function(elm) {
      var top;
      top = getOffset(elm).top;
      if (top < scroll) {
        return bestDisplayed = elm;
      }
    });
    return bestDisplayed;
  };

  smoothScroll = function(e) {
    var diff, tgt, toOffset;
    nextHash = e.target.hash;
    tgt = document.querySelector(nextHash);
    if (!tgt) {
      return;
    }
    e.preventDefault();
    toOffset = Math.min(document.body.scrollHeight - window.innerHeight, getOffset(tgt).top);
    diff = document.body.scrollTop - toOffset;
    wrapper.classList.add('animate-scroll');
    wrapper.style.WebkitTransform = "translate(0, " + diff + "px)";
    wrapper.style.MozTransform = "translate(0, " + diff + "px)";
    wrapper.style.MsTransform = "translate(0, " + diff + "px)";
    wrapper.style.OTransform = "translate(0, " + diff + "px)";
    wrapper.style.transform = "translate(0, " + diff + "px)";
  };

  recoverScroll = function() {
    var toOffset;
    if (!((arguments[0].propertyName.indexOf('transform') >= 0) && (arguments[0].srcElement.classList.contains('wrapper')))) {
      return;
    }
    toOffset = document.body.scrollHeight - window.innerHeight;
    wrapper.classList.remove('animate-scroll');
    wrapper.style.WebkitTransform = null;
    wrapper.style.MozTransform = null;
    wrapper.style.MsTransform = null;
    wrapper.style.OTransform = null;
    wrapper.style.transform = null;
    return window.location.hash = nextHash;
  };

  getOffset = function(elm) {
    var _x, _y;
    _x = 0;
    _y = 0;
    while (elm.nodeName.toLowerCase() !== 'html') {
      _x += elm.offsetLeft;
      _y += elm.offsetTop;
      elm = elm.parentNode;
    }
    return {
      top: _y,
      left: _x
    };
  };

  init();

}).call(this);
