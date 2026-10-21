/**
 * Readable, stable class names for component CSS modules, shared by the docs site and the library build:
 * Button.module.css `.button` -> `dt-button`, `.solid` -> `dt-button-solid`.
 * Exported HTML / CSS and published packages ship these same names, so apps can target them.
 */
export function generateScopedName(local: string, filename: string): string {
  const file = filename.split(/[\\/]/).pop() ?? '';
  const component = file.replace(/\.module\.css.*$/, '').toLowerCase();
  return local.toLowerCase() === component ? `dt-${component}` : `dt-${component}-${local}`;
}
