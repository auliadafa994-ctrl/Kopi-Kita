import type { ReactNode, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number };
function icon(content: ReactNode) {
  return function Icon({ size = 18, ...props }: Props) {
    return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{content}</svg>;
  };
}
export const ArrowDown = icon(<><path d="M12 4v15" /><path d="m6 13 6 6 6-6" /></>);
export const ArrowRight = icon(<><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>);
export const ArrowUpRight = icon(<><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>);
export const Check = icon(<path d="m5 12 4 4L19 6" />);
export const Coffee = icon(<><path d="M4 9h14v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" /><path d="M18 10h1a3 3 0 1 1 0 6h-1" /><path d="M8 3c-1 1 1 2 0 3M12 3c-1 1 1 2 0 3" /></>);
export const Heart = icon(<path d="M20.8 8.6c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2z" />);
export const Menu = icon(<><path d="M4 6h16M4 12h16M4 18h16" /></>);
export const Minus = icon(<path d="M5 12h14" />);
export const Moon = icon(<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z" />);
export const Plus = icon(<><path d="M12 5v14M5 12h14" /></>);
export const Search = icon(<><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>);
export const ShoppingBag = icon(<><path d="M5 8h14l1 13H4L5 8z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>);
export const Sun = icon(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>);
export const Trash2 = icon(<><path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m4 4v7m6-7v7" /></>);
export const Truck = icon(<><path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z" /><circle cx="7.5" cy="19" r="1.5" /><circle cx="18" cy="19" r="1.5" /></>);
export const X = icon(<><path d="m18 6-12 12M6 6l12 12" /></>);
