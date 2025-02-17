// 모든 공백 문자를 제거하는 함수 ( ex : '   a b   c ' -> 'abc')
export const removeAllBlank = (str) => {
  return str.replace(/(\s*)/g, '');
};

// 문자열의 앞과 뒤의 공백문자를 제거하는 함수 ( ex : '   string  ' -> 'string')
export const getTrimmedText = (str) => {
  return str.trim();
};
