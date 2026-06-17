import { BRAND_NAME, BRAND_TAGLINE } from '../lib/config';
import { BrandIcon } from './SafiriIcons';

export function Brand({
  className = 'brand',
  href = '#home',
}: {
  className?: string;
  href?: string;
}) {
  return (
    <a className={className} href={href} aria-label={`${BRAND_NAME} home`}>
      <span className="brand-mark">
        <BrandIcon />
      </span>
      <span>
        <strong>{BRAND_NAME}</strong>
        <small>{BRAND_TAGLINE}</small>
      </span>
    </a>
  );
}
