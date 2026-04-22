import type { ReactNode } from "react";

type BoxProps = {
  children: ReactNode;
};

/**
 * Neutral layout primitive (structure only — styling comes later).
 */
export function Box({ children }: BoxProps) {
  return <div>{children}</div>;
}
