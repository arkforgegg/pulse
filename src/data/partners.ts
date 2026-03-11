import { brandsRow1, brandsRow2, type Brand } from "./brands";

const partners: Brand[] = [...brandsRow1, ...brandsRow2];

const ROWS_DESKTOP = 5;
function chunk<T>(arr: T[], count: number): T[][] {
  const size = Math.ceil(arr.length / count);
  const rows: T[][] = [];
  for (let i = 0; i < count; i++) {
    rows.push(arr.slice(i * size, (i + 1) * size));
  }
  return rows.filter((r) => r.length > 0);
}

export const partnersRows: Brand[][] = chunk(partners, ROWS_DESKTOP);

export { partners };
