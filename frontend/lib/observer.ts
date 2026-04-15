interface ObserveProps {
  target: HTMLElement;
  onEntry: () => void;
  onLeave: () => void;
}

export const observe = ({ target, onEntry, onLeave }: ObserveProps) => {
  if (!target) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onEntry();
        } else {
          onLeave();
        }
      });
    },
    {
      root: null,
      threshold: 0.5, // 50% visível
    },
  );

  if (target) observer.observe(target);
};
