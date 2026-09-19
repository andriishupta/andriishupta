interface RevealOnceOptions {
  rootMargin?: string;
  threshold?: number;
}

const groupSelector = "[data-reveal-group]";
const itemSelector = "[data-reveal-item]";

export const revealOnce = ({
  rootMargin = "0px",
  threshold = 0.5,
}: RevealOnceOptions = {}) => {
  if (
    typeof window.IntersectionObserver !== "function" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const pendingTriggers = new Map(
    Array.from(document.querySelectorAll<HTMLElement>(groupSelector)).flatMap(
      (group) => {
        if (
          group.hasAttribute("data-reveal-ready") ||
          group.hasAttribute("data-reveal-active")
        ) {
          return [];
        }

        const trigger = group.querySelector<HTMLElement>(itemSelector);
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

        group.setAttribute("data-reveal-active", "");
        observer.unobserve(trigger);
        pendingTriggers.delete(trigger);
      });

      if (pendingTriggers.size === 0) disconnect();
    },
    { rootMargin, threshold },
  );

  pendingTriggers.forEach((group, trigger) => {
    group.setAttribute("data-reveal-ready", "");
    observer.observe(trigger);
  });
  window.addEventListener("pagehide", disconnect, { once: true });
};
