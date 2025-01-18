const unidecode = require('unidecode');

export const convertToSlug = (text: string): string => {
    const unidecodeText = unidecode(text.trim());
    const slug: string = unidecodeText.replace(/\s+/g, "-")//s: là khoảng trắng
    return slug;
}