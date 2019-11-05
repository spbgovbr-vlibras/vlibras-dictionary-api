import debug from 'debug';

export const serverInfo = debug('vlibras-dictionary-api:info');
export const serverError = debug('vlibras-dictionary-api:error');
export const databaseError = debug('vlibras-dictionary-db:error');
export const indexerError = debug('vlibras-dictionary-indexer:error');
