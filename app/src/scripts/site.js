const enhanced = new WeakSet();
function enhancePage() {
      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
      const titleSlot = document.querySelector(".work-title-slot");
      if (titleSlot && !enhanced.has(titleSlot) && !reduceMotion.matches) {
        enhanced.add(titleSlot);
        const titles = ["Design Technologist", "User Experience Engineer", "Design Engineer", "Design Developer", "UI Engineer", "Creative Technologist"];
        const pause = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
        void (async () => {
          let current = titleSlot.querySelector(".work-title-current");
          for (let step = 1; step <= titles.length; step += 1) {
            await pause(step === 1 ? 2000 : 1000);
            if (!titleSlot.isConnected) return;
            const next = document.createElement("span");
            next.className = "work-title-current work-title-enter";
            next.textContent = titles[step % titles.length];
            current.classList.add("work-title-exit");
            titleSlot.append(next);
            await pause(450);
            if (!titleSlot.isConnected) return;
            current.remove();
            next.classList.remove("work-title-enter");
            current = next;
          }
        })();
      }
      const portrait = document.querySelector(".portrait");

      if (portrait && !enhanced.has(portrait)) {
      enhanced.add(portrait);
      portrait.addEventListener("click", () => {
        if (reduceMotion.matches) return;
        portrait.classList.add("tilt");
        setTimeout(() => portrait.classList.remove("tilt"), 800);
      });

      }
      document.querySelectorAll("li:has(.emoji)").forEach((line) => {
        if (enhanced.has(line)) return;
        enhanced.add(line);
        line.addEventListener("click", () => {
          if (reduceMotion.matches) return;
          line.classList.add("revealed");
          setTimeout(() => line.classList.remove("revealed"), 800);
        });
      });

      const allLinks = document.querySelectorAll("a");
      // Chrome can't paint the ::before fill on links that wrap across lines,
      // so those get a "wrapped" class that swaps in a background-drawn fill.
      const markWrap = (link) => link.classList.toggle("wrapped", link.getClientRects().length > 1);
      allLinks.forEach(markWrap);


      allLinks.forEach((link) => {
        if (enhanced.has(link)) return;
        enhanced.add(link);
        // Record where the pointer entered/left the link as a 0..1 fraction of
        // the relevant line box (links can wrap, so pick the rect under the
        // pointer). The CSS transform-origin uses it as the bloom origin.
        const setOrigin = (event) => {
          if (event.clientX == null) return;
          let rect = null;
          for (const r of link.getClientRects()) {
            if (event.clientY >= r.top && event.clientY <= r.bottom) { rect = r; break; }
          }
          rect = rect || link.getBoundingClientRect();
          if (!rect.width) return;
          const o = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
          link.style.setProperty("--o", o.toFixed(4));
        };
        link.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") { markWrap(link); setOrigin(event); } });
        link.addEventListener("pointerleave", (event) => { if (event.pointerType === "mouse") setOrigin(event); });
        link.addEventListener("pointerdown", (event) => {
          markWrap(link);
          setOrigin(event); // touch tap: fill flashes from the tapped point
          link.classList.add("pressed");
        });
        ["pointerup", "pointerleave", "pointercancel"].forEach((event) =>
          link.addEventListener(event, () => link.classList.remove("pressed"))
        );
      });

}
document.addEventListener("astro:page-load", enhancePage);
addEventListener("resize", () => document.querySelectorAll("a").forEach((link) =>
  link.classList.toggle("wrapped", link.getClientRects().length > 1)
));
