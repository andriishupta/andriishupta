interface RevealOnceOptions {
  rootMargin?: string;
  threshold?: number;
  triggerSelector: string;
}

export const revealOnce = (
  selector: string,
  { rootMargin = "0px", threshold = 0.5, triggerSelector }: RevealOnceOptions,
) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const pendingTriggers = new Map(
    Array.from(document.querySelectorAll<HTMLElement>(selector)).flatMap(
      (group) => {
        if (
          group.dataset.revealReady === "true" ||
          group.dataset.revealActive === "true"
        ) {
          return [];
        }

        const trigger = group.querySelector<HTMLElement>(triggerSelector);
        return trigger ? [[trigger, group] as const] : [];
      },
    ),
  );

  if (pendingTriggers.size === 0) return;

  let observer: IntersectionObserver;

  const disconnect = () => {
    observer.disconnect();
    pendingTriggers.clear();
    window.removeEventListener("pagehide", disconnect);
  };

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const trigger = entry.target as HTMLElement;
        const group = pendingTriggers.get(trigger);
        if (!group) return;

        group.dataset.revealActive = "true";
        observer.unobserve(trigger);
        pendingTriggers.delete(trigger);
      });

      if (pendingTriggers.size === 0) disconnect();
    },
    { rootMargin, threshold },
  );

  pendingTriggers.forEach((group, trigger) => {
    group.dataset.revealReady = "true";
    observer.observe(trigger);
  });
  window.addEventListener("pagehide", disconnect, { once: true });
};
