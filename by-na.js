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
      const S = window.SplitText || (G && G.utils && G.utils.checkPrefix && window.SplitText);
      if (G && S) return cb(G, S);
      if (performance.now() - start < 5000) requestAnimationFrame(check);
    };
    check();
  };

  waitForGSAP((gsap, SplitText) => {
    gsap.registerPlugin(SplitText);

    const DUR = 0.35;
    const STAG = 0.01;
    const EASE = "power3.inOut";
    const EMOJIS = ["⚡", "🧠", "✨", "😌", "😏", "🚀", "🖤"];

    if (!document.getElementById("na-hover-styles")) {
      const s = document.createElement("style");
      s.id = "na-hover-styles";
      s.innerHTML = `[data-not-another]{position:relative;overflow:visible!important;z-index:auto}.na-wrap{position:relative;overflow:hidden;display:inline-block;vertical-align:top;pointer-events:none;z-index:2}.na-clone{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;user-select:none}.na-pop{position:absolute;pointer-events:none;user-select:none;font-size:28px;line-height:1;will-change:transform,opacity}`;
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

      const txt = target.innerText;
      target.innerHTML = "";
      
      const wrap = document.createElement("div");
      wrap.className = "na-wrap";
      
      const o = document.createElement("div");
      o.innerText = txt; 
      
      const c = document.createElement("div");
      c.className = "na-clone"; 
      c.innerText = txt;

      wrap.append(o, c);
      target.appendChild(wrap);

      const splitO = new SplitText(o, { type: "chars", charsClass: "char" });
      const splitC = new SplitText(c, { type: "chars", charsClass: "char" });

      gsap.set(splitC.chars, { yPercent: 100 });

      const tl = gsap.timeline({ paused: true });
      tl.to(splitO.chars, { yPercent: -100, duration: DUR, ease: EASE, stagger: STAG })
        .to(splitC.chars, { yPercent: 0, duration: DUR, ease: EASE, stagger: STAG }, "<");

      let active = false, mX = 0, mY = 0, timer, rect;

      const loop = () => {
        if (!active) return;
        spawn(link, mX, mY);
        timer = setTimeout(loop, Math.random() * 200 + 100);
      };

      link.addEventListener("mouseenter", (e) => {
        active = true;
        tl.play();
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
        tl.reverse();
        clearTimeout(timer);
      });
    });
  });
})();
