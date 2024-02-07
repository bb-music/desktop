/** 合并 className */
export function cls(...classList: Array<string | undefined | boolean>) {
  return classList.filter((i) => !!i).join(' ');
}
