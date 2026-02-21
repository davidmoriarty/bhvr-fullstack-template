// client/src/components/motion/types.ts
export type CSSVars = { [key: `--${string}`]: string | number };
export type CSSPropertiesWithVars = React.CSSProperties & CSSVars;
