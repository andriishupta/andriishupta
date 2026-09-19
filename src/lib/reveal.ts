interface RevealOnceOptions {
  rootMargin?: string;
}

export const revealOnce = (
  selector: string,
  { rootMargin = "0px 0px -16% 0px" }: RevealOnceOptions = {},
) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const pendingGroups = new Set(
    Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
      (group) =>
        group.dataset.revealReady !== "true" &&
        group.dataset.revealActive !== "true",
    ),
  );

  if (pendingGroups.size === 0) return;

  let observer: IntersectionObserver;

  const disconnect = () => {
    observer.disconnect();
    pendingGroups.clear();
    window.removeEventListener("pagehide", disconnect);
  };

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const group = entry.target as HTMLElement;
        group.dataset.revealActive = "true";
        observer.unobserve(group);
        pendingGroups.delete(group);
      });

      if (pendingGroups.size === 0) disconnect();
    },
    { rootMargin },
  );

  pendingGroups.forEach((group) => {
    group.dataset.revealReady = "true";
    observer.observe(group);
  });
  window.addEventListener("pagehide", disconnect, { once: true });
};
