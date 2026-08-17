import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  selector: string;
  x?: number;
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const revealOnScroll = (
  root: HTMLElement,
  {
    selector,
    x = 0,
    y = 16,
    stagger = 0.08,
    duration = 0.56,
    start = "top 84%",
  }: RevealOptions,
) => {
  if (root.dataset.motionReady === "true") return;
  root.dataset.motionReady = "true";

  const items = gsap.utils.toArray<HTMLElement>(selector, root);
  if (items.length === 0 || prefersReducedMotion()) return;

  gsap.fromTo(
    items,
    { autoAlpha: 0, x, y },
    {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration,
      stagger,
      ease: "power3.out",
      clearProps: "opacity,transform,visibility",
      scrollTrigger: {
        trigger: root,
        start,
        once: true,
      },
    },
  );
};

export { gsap };
