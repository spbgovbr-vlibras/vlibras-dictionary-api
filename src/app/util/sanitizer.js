const toUpperCaseSanitizer = function toUpperCaseCustomSanitizer(value) {
  return typeof value === 'string'
    ? value.toUpperCase()
    : value;
};

const signIntensifierSanitizer = function signIntensifierCustomSanitizer(value) {
  return typeof value === 'string'
    ? value.replace(/([A-ZÁÉÍÓÚÀÂÊÔÃÕÜÇa-záéíóúàâêôãõüç]+)(\([-+]\))/, '$1')
    : value;
};

const signContextSanitizer = function signContextCustomSanitizer(value) {
  return typeof value === 'string'
    ? value.replace(/([A-ZÁÉÍÓÚÀÂÊÔÃÕÜÇa-záéíóúàâêôãõüç]+)&([{A-ZÁÉÍÓÚÀÂÊÔÃÕÜÇa-záéíóúàâêôãõüç}]+)/, '$1')
    : value;
};

export {
  toUpperCaseSanitizer,
  signIntensifierSanitizer,
  signContextSanitizer,
};
