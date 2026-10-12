(function () {
  // Footer year
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Animated counters
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || "";
    var start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * p).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.dataset.count + (c.dataset.suffix || ""); });
  }

  // Service tabs
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        document.getElementById(t.getAttribute("aria-controls")).classList.toggle("on", on);
      });
    });
  });

  // Project filter
  var chips = document.querySelectorAll(".chip");
  var projects = document.querySelectorAll(".project");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      projects.forEach(function (p) { p.classList.toggle("hidden", !(f === "all" || p.dataset.cat === f)); });
    });
  });

  // Project modal
  var dlg = document.getElementById("dlg");
  if (dlg) {
    projects.forEach(function (p) {
      p.addEventListener("click", function () {
        document.getElementById("dlg-title").textContent = p.dataset.title;
        document.getElementById("dlg-desc").textContent = p.dataset.desc;
        document.getElementById("dlg-meta").textContent = p.dataset.meta;
        dlg.showModal();
      });
    });
    document.getElementById("dlg-close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  // Contact form
  var form = document.getElementById("contact-form");
  if (form) {
    var rules = {
      name: function (v) { return v.trim().length >= 2 ? "" : "Enter your full name."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email, like name@company.com."; },
      topic: function (v) { return v ? "" : "Choose a topic."; },
      message: function (v) { return v.trim().length >= 10 ? "" : "Write at least 10 characters."; }
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      Object.keys(rules).forEach(function (id) {
        var input = document.getElementById(id);
        var msg = rules[id](input.value);
        document.getElementById(id + "-err").textContent = msg;
        input.classList.toggle("bad", !!msg);
        if (msg) ok = false;
      });
      var status = document.getElementById("status");
      if (ok) {
        status.textContent = "Message sent. Our team will reply within two working days.";
        form.reset();
      } else {
        status.textContent = "";
      }
    });
  }

  // Scroll reveal
  var targets = document.querySelectorAll(
    ".head, .card, .stat, .tl, details, .split > *, .info > div, .cta-band .wrap, .tabs, .panelx.on"
  );
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) {
      // stagger siblings, capped so long lists don't wait
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--d", Math.min(i, 5) * 0.08 + "s");
      el.classList.add("reveal");
      ro.observe(el);
    });
  }
})();