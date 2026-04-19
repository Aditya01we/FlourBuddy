export const OTP = () => Math.floor(1000 + Math.random() * 9000).toString();
const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
export const validateEmail = text => reg.test(text);

export const formatAmount = amount =>
  `\u20B9 ${parseInt(amount)
    .toFixed(0)
    .replace(/(\d)(?=(\d\d)+\d$)/g, '$1,')}`;

export const formatNumber = str => str.replace(/,/g, '').replace('\u20B9 ', '');
export const textInPrice = price => `\u20B9 ${price}`;
export const htmlParse = str => {
  str = str.replace(/\r\n|\n|\r/gm, '');
  str = str.replace(/\&nbsp;/gm, '');
  str = str.replace(/\<p>\<\/p\>/gm, '');
  return str;
};
