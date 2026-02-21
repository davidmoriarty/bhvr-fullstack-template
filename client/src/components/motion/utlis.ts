// src/components/animations/utils.ts
export const vars = (
	v: Record<`--${string}`, string | number>,
): React.CSSProperties => v;
