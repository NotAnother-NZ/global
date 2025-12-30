(() => {
  document.addEventListener("DOMContentLoaded", () => {
    try {
      const o = encodeURIComponent(window.location.origin);
      document.querySelectorAll("[data-not-another]").forEach((e) => {
        const n = e.getAttribute("data-not-another") || "client-footer";
        e.href = `https://na.studio/?utm_source=${o}&utm_medium=referral&utm_campaign=${encodeURIComponent(n)}&utm_content=na13`;
        e.target = "_blank";
      });
    } catch (e) {}
  });

  const waitForGSAP = (cb) => {
    const start = performance.now();
    const check = () => {
      const G = window.gsap;
      if (G) return cb(G);
      if (performance.now() - start < 5000) requestAnimationFrame(check);
    };
    check();
  };

  waitForGSAP((gsap) => {
    const EMOJIS = ["⚡", "🧠", "✨", "😌", "😏", "🚀", "🖤"];

    if (!document.getElementById("na-hover-styles")) {
      const s = document.createElement("style");
      s.id = "na-hover-styles";
      s.innerHTML = `[data-not-another]{position:relative;overflow:visible!important;z-index:auto}.na-txt{position:relative;z-index:2;display:inline-block}.na-pop{position:absolute;pointer-events:none;user-select:none;font-size:28px;line-height:1;will-change:transform,opacity}`;
      document.head.appendChild(s);
    }

    const spawn = (parent, x, y) => {
      const el = document.createElement("div");
      el.innerText = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      el.className = "na-pop";
      el.style.zIndex = Math.random() > 0.5 ? 3 : 1;
      
      const rX = (Math.random() * 30) - 15;
      const rY = (Math.random() * 30) - 15;
      el.style.left = `${x + rX}px`;
      el.style.top = `${y + rY}px`;
      
      parent.appendChild(el);

      gsap.fromTo(el, 
        { scale: 0, rotation: 0 }, 
        {
          scale: 1,
          y: -50 - Math.random() * 30,
          rotation: (Math.random() * 60) - 30,
          opacity: 0,
          duration: 1,
          ease: "power1.out",
          onComplete: () => { if(el.parentNode) el.parentNode.removeChild(el); }
        }
      );
    };

    document.querySelectorAll("[data-not-another]").forEach((link) => {
      const target = link.querySelector("div");
      if (!target) return;

      if (!target.classList.contains("na-txt")) {
        target.classList.add("na-txt");
      }

      let active = false, mX = 0, mY = 0, timer, rect;

      const loop = () => {
        if (!active) return;
        spawn(link, mX, mY);
        timer = setTimeout(loop, Math.random() * 200 + 100);
      };

      link.addEventListener("mouseenter", (e) => {
        active = true;
        rect = link.getBoundingClientRect();
        mX = e.clientX - rect.left;
        mY = e.clientY - rect.top;
        loop();
      });

      link.addEventListener("mousemove", (e) => {
        if (!active) return;
        if (!rect) rect = link.getBoundingClientRect(); 
        mX = e.clientX - rect.left;
        mY = e.clientY - rect.top;
      });

      link.addEventListener("mouseleave", () => {
        active = false;
        clearTimeout(timer);
      });
    });
  });
})();
