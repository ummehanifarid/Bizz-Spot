// Dark mode toggle — remembers choice in localStorage
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("mohalla-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  $(function () {
    $(".theme-toggle").on("click", function () {
      const current = root.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("mohalla-theme", next);
    });

    // Highlight the current page in the nav
    const path = window.location.pathname.split("/").pop() || "index.html";
    $(".nav-links a").each(function () {
      const href = $(this).attr("href");
      if (href === path) $(this).addClass("active");
    });
  });
})();
