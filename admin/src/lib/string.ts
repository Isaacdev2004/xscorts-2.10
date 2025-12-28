/* eslint-disable no-useless-escape */
export function isUrl(url: string): boolean {
  return url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) !== null;
}

export function capitalizeFirstLetter(str: string) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function formatResponString(text:string) {
  // Tách chuỗi thành các từ nhỏ bằng dấu '-'
  const words = text.split('-');

  // Viết hoa chữ cái đầu của mỗi từ và ghép lại
  const formattedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  // Ghép lại thành chuỗi với khoảng trắng giữa các từ
  return formattedWords.join(' ');
}
