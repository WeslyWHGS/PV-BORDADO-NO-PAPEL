// Atelier Digital — smart checkout + UTM capture
// Captures UTMs from URL -> cookies -> sessionStorage (3-layer fallback),
// then redirects to the VegaCheckout link with the preserved UTMs
// appended as query params.

(function () {
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'sck', 'src', 'xcod'];
  var CHECKOUT_URL = 'https://checkout.atelierdigital.site/VCCL1O8SD7PH';

  // Save UTMs to sessionStorage on page load (backup layer)
  (function () {
    var urlParams = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach(function (key) {
      if (urlParams.get(key)) sessionStorage.setItem(key, urlParams.get(key));
    });
  })();

  // Read UTMs from URL -> cookies -> sessionStorage
  function getUTMs() {
    var params = {};
    var urlParams = new URLSearchParams(window.location.search);

    UTM_KEYS.forEach(function (key) {
      if (urlParams.get(key)) params[key] = urlParams.get(key);
    });
    UTM_KEYS.forEach(function (key) {
      if (!params[key]) {
        var match = document.cookie.match(new RegExp('(?:^|; )' + key + '=([^;]*)'));
        if (match) params[key] = decodeURIComponent(match[1]);
      }
    });
    UTM_KEYS.forEach(function (key) {
      if (!params[key] && sessionStorage.getItem(key)) params[key] = sessionStorage.getItem(key);
    });

    return params;
  }

  // Smart checkout — redirects to VegaCheckout with UTMs preserved
  window.goToCheckout = function (e) {
    if (e && e.preventDefault) e.preventDefault();

    // Idempotency guard — prevent double fire
    if (window._goCheckoutFired) return;
    window._goCheckoutFired = true;

    var base = CHECKOUT_URL;

    var utms = getUTMs();
    var extra = Object.keys(utms).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(utms[k]);
    }).join('&');

    if (extra) base += (base.indexOf('?') === -1 ? '?' : '&') + extra;

    window.location.href = base;
  };
})();
