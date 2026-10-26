/** Resolves a path under `public/assets/` against the app's base URL. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

/** Shorthand for an icon in `public/assets/icons/`. */
export const icon = (name: string) => asset(`icons/${name}.svg`);
