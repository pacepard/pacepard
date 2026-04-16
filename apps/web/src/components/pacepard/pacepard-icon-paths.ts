/**
 * Deterministic shuffle of `/public/icons` PNGs (no runtime randomness).
 * Lives in a plain module so RSC and `'use client'` files can both import it.
 */
export const PACEPARD_ICON_PNGS = [
    '/icons/decision.png',
    '/icons/converse.png',
    '/icons/task.png',
    '/icons/report.png',
    '/icons/feedback.png',
    '/icons/guage.png',
    '/icons/tree.png',
    '/icons/cal.png',
    '/icons/move.png',
    '/icons/star.png',
    '/icons/scale.png',
    '/icons/check.png',
    '/icons/list.png',
    '/icons/comp.png',
    '/icons/set.png',
    '/icons/settings.png',
    '/icons/secure.png',
    '/icons/edu.png',
    '/icons/coin.png',
    '/icons/time.png',
] as const;

export function pickIconAt(index: number): string {
    return PACEPARD_ICON_PNGS[index % PACEPARD_ICON_PNGS.length]!;
}
