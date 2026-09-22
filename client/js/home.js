$(function () {
  function animateCount($el, target) {
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      $el.text(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  $.ajax({
    url: `${API_BASE_URL}/api/businesses/stats`,
    method: "GET",
    timeout: 15000,
  })
    .done(function (data) {
      animateCount($("#stat-businesses"), data.total || 0);
      animateCount($("#stat-cities"), data.cities || 0);
      animateCount($("#stat-categories"), data.categories || 0);
    })
    .fail(function () {
      $("#stat-businesses, #stat-cities, #stat-categories").text("—");
    });
});
