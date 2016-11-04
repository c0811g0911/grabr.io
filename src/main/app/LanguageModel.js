/**
 * Cookie key where active user language is stored.
 * @type {string}
 */
export const LANGUAGE_COOKIE = 'language';

export const LANGUAGE_EN = 'en';
export const LANGUAGE_RU = 'ru';
export const DEFAULT_LANGUAGE = LANGUAGE_EN;

import {messages as enMessages} from '../i18n/en';
import {messages as ruMessages} from '../i18n/ru';

export const LanguageActions = {
  TRANSLATIONS_REQUESTED: 'Language.translationsRequested',
  TRANSLATIONS_LOADING_FAILED: 'Language.translationsLoadingFailed',
  TRANSLATIONS_RECEIVED: 'Language.translationsReceived'
};

Object.freeze(LanguageActions);

export async function fetchTranslations(context, {language}) {
  context.dispatch(LanguageActions.TRANSLATIONS_REQUESTED, {language});
  try {
    let messages;
    switch (language) {
      case LANGUAGE_EN:
        messages = enMessages;
        break;

      case LANGUAGE_RU:
        messages = ruMessages;
        break;

      default:
        throw new Error('Unexpected language ' + language);
    }
    context.dispatch(LanguageActions.TRANSLATIONS_RECEIVED, {language, messages});
  } catch (error) {
    context.dispatch(LanguageActions.TRANSLATIONS_LOADING_FAILED, {language});
  }
}

/**
 * Get list of locales available for use.
 * @return {string[]} Supported languages.
 */
export function getLanguages() {
  return [LANGUAGE_EN, LANGUAGE_RU];
}

export function getLanguageFromPath(path) {
  return getLanguages().find(language => path.startsWith('/' + language));
}

export function getPathWithoutLanguage(path) {
  return path.replace(`/${getLanguageFromPath(path)}`, '');
}

export function createLanguageBasedPath(language, path) {
  const currentLanguage = getLanguageFromPath(path);
  if (currentLanguage) {
    path = path.substring(1 + currentLanguage.length);
  }
  return '/' + language + path;
}

/**
 * Detect language that should be responded to provided request.
 *
 * @param {Object} request HTTP request.
 * @return {?string} Detected language.
 */
export function getHttpRequestLanguage(request) {
  const {url: path} = request;
  const languages = getLanguages();

  // Extract from requested URL.
  let language = getLanguageFromPath(path);
  if (language) {
    return language;
  }

  // Read from cookie.
  language = request.cookies[LANGUAGE_COOKIE];
  if (languages.includes(language)) {
    return language;
  }

  // Detect from Accept-Language header.
  language = request.acceptsLanguages(...languages);
  if (language) {
    return language;
  }

  // Cannot detect language from request.
  return DEFAULT_LANGUAGE;
}



// WEBPACK FOOTER //
// ./src/main/app/LanguageModel.js