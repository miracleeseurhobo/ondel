// Gradient shimmer text — adapted from BIAsia/gradient-shimmer: a bright band
// swept across the text via background-clip:text + an animated band gradient.
// CSS-driven (see .gradient-shimmer in index.css); reduced motion renders the
// text solid. Text stays selectable/screen-readable.
export default function GradientShimmerText({ children, className = '' }) {
  return <span className={`gradient-shimmer ${className}`}>{children}</span>
}
