// Генерирует dist/tokens.css из экспорта переменных Figma (tokens/figma-variables.json).
// Запуск: node scripts/build-tokens.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = JSON.parse(readFileSync(join(root, "tokens/figma-variables.json"), "utf8"));
const { Primitives, Color, Spacing, Radius } = src.variables;

// "var(--color-bg-canvas)" -> "--color-bg-canvas"
const cssName = (v) => v.css.replace(/^var\((--[^)]+)\)$/, "$1");
const primByName = Object.fromEntries(
  Object.entries(Primitives.vars).map(([name, v]) => [name, cssName(v)])
);

const lines = [];
const out = (s = "") => lines.push(s);

out("/* Сгенерировано scripts/build-tokens.mjs из Figma. Не править вручную. */");
out("");
out(":root {");
out("  /* Примитивы */");
for (const [, v] of Object.entries(Primitives.vars)) out(`  ${cssName(v)}: ${v.values.Value.hex};`);
out("");
out("  /* Отступы и радиусы */");
for (const v of Object.values(Spacing.vars)) out(`  ${cssName(v)}: ${v.values.Value}px;`);
for (const v of Object.values(Radius.vars)) out(`  ${cssName(v)}: ${v.values.Value}px;`);
out("");
out("  /* Семантические цвета · светлая тема */");
for (const v of Object.values(Color.vars)) out(`  ${cssName(v)}: var(${primByName[v.values.Light.alias]});`);
out("  color-scheme: light;");
out("}");
out("");

const dark = Object.values(Color.vars).map((v) => `  ${cssName(v)}: var(${primByName[v.values.Dark.alias]});`);
out("/* Тёмная тема: явный выбор */");
out(':root[data-theme="dark"] {');
dark.forEach((l) => out(l));
out("  color-scheme: dark;");
out("}");
out("");
out("/* Тёмная тема: системная настройка, если тема не выбрана явно */");
out("@media (prefers-color-scheme: dark) {");
out('  :root:not([data-theme="light"]) {');
dark.forEach((l) => out("  " + l));
out("    color-scheme: dark;");
out("  }");
out("}");
out("");

const weight = { Regular: 400, Medium: 500, "Semi Bold": 600, Bold: 700 };
out("/* Текстовые стили */");
for (const t of src.textStyles) {
  const cls = "ds-text-" + t.name.toLowerCase().replace(/\//g, "-");
  out(`.${cls} {`);
  out(`  font-family: "${t.family}", system-ui, -apple-system, "Segoe UI", sans-serif;`);
  out(`  font-size: ${t.size}px;`);
  out(`  line-height: ${t.lineHeight}px;`);
  out(`  font-weight: ${weight[t.style]};`);
  out(`  letter-spacing: ${(t.letterSpacing / 100).toFixed(3)}em;`);
  if (t.textCase === "UPPER") out("  text-transform: uppercase;");
  if (t.name.startsWith("Numeric")) out("  font-variant-numeric: tabular-nums;");
  out("}");
}

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/tokens.css"), lines.join("\n") + "\n");
console.log(`tokens.css: ${Object.keys(Color.vars).length} семантических цветов, ${src.textStyles.length} текстовых стилей`);
