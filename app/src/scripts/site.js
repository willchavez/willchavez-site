      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
      const portrait = document.querySelector(".portrait");
      const cursor = document.querySelector(".cursor");

      portrait.addEventListener("click", () => {
        if (reduceMotion.matches) return;
        portrait.classList.add("tilt");
        setTimeout(() => portrait.classList.remove("tilt"), 800);
      });

      document.querySelectorAll("li:has(.emoji)").forEach((line) => {
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
      addEventListener("resize", () => allLinks.forEach(markWrap));

      allLinks.forEach((link) => {
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

      function playCursorAnimation(event) {
        if (reduceMotion.matches) return;
        const rect = cursor.getBoundingClientRect();
        const x = event.clientX || rect.left + rect.width / 2;
        const y = event.clientY || rect.top + rect.height / 2;
        // shuffle the marks so each click spawns them in a different order
        const marks = ["✦", "//", "↗", "◼", "~"];
        for (let i = marks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [marks[i], marks[j]] = [marks[j], marks[i]];
        }
        marks.forEach((mark, index) => {
          const stamp = document.createElement("i");
          stamp.className = "stamp";
          stamp.textContent = mark;
          stamp.style.left = `${x + (index - 2) * 17}px`;
          stamp.style.top = `${y + Math.sin(index) * 14}px`;
          stamp.style.animationDelay = `${index * 0.05}s`;
          document.body.append(stamp);
          setTimeout(() => stamp.remove(), 1200);
        });
      }

      cursor?.addEventListener("click", playCursorAnimation);
      cursor?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          playCursorAnimation(event);
        }
      });
