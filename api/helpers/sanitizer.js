const toUpperCaseSanitizer = function toUpperCaseCustomSanitizer(value) {
	return typeof value === 'string' ? value.toUpperCase() : value;
}

export default toUpperCaseSanitizer;