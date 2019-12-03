export const VALIDATION_VALUES = {
  dictionaryVersions: ['2018.3.0', '2018.3.1'],
  dictionaryPlatforms: ['ANDROID', 'IOS', 'LINUX', 'WINDOWS', 'WEBGL', 'STANDALONE'],
  dictionaryRegions: [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ],
};

export const VALIDATION_ERRORS = {
  dictionaryVersions: `'version' is not in valid values ${VALIDATION_VALUES.dictionaryVersions}.`,
  dictionaryPlatforms: `'platform' is not in valid values ${VALIDATION_VALUES.dictionaryPlatforms}.`,
  dictionaryRegions: `'region' is not in valid values ${VALIDATION_VALUES.dictionaryRegions}.`,
  dictionarySign: '\'sign\' cannot be empty.',
};
