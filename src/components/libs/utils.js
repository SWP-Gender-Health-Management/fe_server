export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
const slugify = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD') // bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '') // loại ký tự đặc biệt
    .replace(/\s+/g, '-') // khoảng trắng -> dấu gạch ngang
    .replace(/-+/g, '-') // nhiều dấu '-' liên tiếp -> 1 dấu
    .replace(/^-+|-+$/g, ''); // bỏ dấu '-' đầu/cuối
};

export default slugify;
