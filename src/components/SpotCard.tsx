import type { ReactNode } from 'react';

export function SpotCard({
  image,
  className,
  children,
}: {
  image?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={['category-spot-card', className].filter(Boolean).join(' ')}>
      {image ? <img src={image} alt="" /> : null}
      <div className="category-spot-card__body">{children}</div>
    </article>
  );
}
