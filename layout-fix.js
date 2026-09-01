(() => {
  "use strict";

  const FIT_LEVELS = ["normal", "compact", "tight", "emergency"];
  let raf = 0;

  function phaseName() {
    const raw = (document.getElementById("stageName")?.textContent || "problem").trim().toLowerCase();
    return raw.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "problem";
  }

  function clearScale(slide) {
    slide.style.transform = "";
    slide.style.transformOrigin = "";
    slide.style.width = "";
  }

  function fits(slide) {
    return slide.scrollHeight <= slide.clientHeight + 2 && slide.scrollWidth <= slide.clientWidth + 2;
  }

  function fitCurrentSlide() {
    const stage = document.querySelector(".stage");
    const slide = document.getElementById("slide");
    if (!stage || !slide) return;

    stage.dataset.phase = phaseName();
    stage.dataset.overflow = "0";
    clearScale(slide);

    let chosen = FIT_LEVELS[0];
    for (const level of FIT_LEVELS) {
      stage.dataset.fit = level;
      void slide.offsetHeight;
      chosen = level;
      if (fits(slide)) break;
    }

    stage.dataset.fit = chosen;
    void slide.offsetHeight;

    if (!fits(slide)) {
      const heightRatio = slide.clientHeight / Math.max(slide.scrollHeight, 1);
      const widthRatio = slide.clientWidth / Math.max(slide.scrollWidth, 1);
      const scale = Math.max(0.84, Math.min(1, heightRatio, widthRatio));
      if (scale < 0.999) {
        slide.style.transformOrigin = "top left";
        slide.style.transform = `scale(${scale.toFixed(3)})`;
        slide.style.width = `${(100 / scale).toFixed(2)}%`;
      }
      stage.dataset.overflow = "scaled";
      console.warn("Clover Lesson 8: slide required final scale", {
        phase: stage.dataset.phase,
        fit: chosen,
        scale,
        scrollHeight: slide.scrollHeight,
        clientHeight: slide.clientHeight
      });
    }
  }

  function scheduleFit() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => requestAnimationFrame(fitCurrentSlide));
  }

  function init() {
    const slide = document.getElementById("slide");
    const stageName = document.getElementById("stageName");
    if (!slide) return;

    new MutationObserver(scheduleFit).observe(slide, {
      childList: true,
      subtree: true,
      characterData: true
    });
    if (stageName) {
      new MutationObserver(scheduleFit).observe(stageName, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
    window.addEventListener("resize", scheduleFit, { passive: true });
    scheduleFit();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
