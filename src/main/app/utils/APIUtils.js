import request from 'superagent';
import _ from 'lodash';
import {getMessageBus} from '../utils/MessageBus';
import './FingerprintUtils';

function stringifyQuery(query) {
  const queries = _.reduce(query, (memo, param, key) => {
    if (_.isObject(param)) {
      _.forEach(param, (value, subKey) => {
        if (value !== undefined) {
          memo.push(`${ key }[${ subKey }]=${ value }`);
        }
      });
    } else {
      memo.push(`${ key }=${ param }`);
    }
    return memo;
  }, []);

  return queries.join('&');
}

async function sendRequest(method, query, options) {
  return new Promise((resolve, reject) => {
    const url = `${ options.apiRoot }${ options.endpoint }`;

    const req = request[method](url);
    const version = options.version || 1;
    req._withCredentials = true;

    if (!options.type) {
      req.set('Content-Type', 'application/json');
      req.set('Accept', `application/json;version=${ version }`);
    } else {
      req.attach('file', query.file);
    }

    req.set('Accept-Language', options.lang || 'en');
    req.set('Grabr-Platform', 'web');

    if (options.fingerprint) {
      req.set('Grabr-Device', options.fingerprint);
    }
    if (options.xForwardedFor) {
      req.set('X-Forwarded-For', options.xForwardedFor);
    }
    if (options.authToken) {
      req.set('Authorization', `Token ${ options.authToken }`);
    }
    if (options.range) {
      req.set('Range-Unit', 'items');
      req.set('Range', `${ options.range }`);
    }

    if (query) {
      if (['post', 'put', 'patch', 'del'].indexOf(method) !== -1) {
        if (options.type != 'form') {
          req.send(query);
        } else {
          req.send();
        }
      } else {
        req.query(stringifyQuery(query)).send();
      }
    }

    req.end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

let MessageBus;

function initMessageBus(authToken, apiRoot) {
  MessageBus = getMessageBus();

  MessageBus.baseUrl = apiRoot + '/poll/';
  MessageBus.callbackInterval = 500;
  MessageBus.authToken = authToken;
  MessageBus.start();
}

export async function get(endpoint, query, options = {}) {
  logger.debug('GETTING ' + endpoint);

  return sendRequest('get', query, Object.assign(options, {endpoint}));
}

export async function post(endpoint, query, options = {}) {
  return sendRequest('post', query, Object.assign(options, {endpoint}));
}

export async function del(endpoint, query, options = {}) {
  return sendRequest('del', query, Object.assign(options, {endpoint}));
}

export async function patch(endpoint, query, options = {}) {
  return sendRequest('patch', query, Object.assign(options, {endpoint}));
}

export async function put(endpoint, query, options = {}) {
  return sendRequest('put', query, Object.assign(options, {endpoint}));
}

export async function subscribeMessageBus(channel, callback, authToken, apiRoot) {
  if (!MessageBus) {
    initMessageBus(authToken, apiRoot);
  }

  const subscribe = function (res) {
    MessageBus.unsubscribe(channel, subscribe);
    MessageBus.subscribe(channel, callback, res[channel]);
  };

  MessageBus.subscribe(channel, subscribe, -1);
}



// WEBPACK FOOTER //
// ./src/main/app/utils/APIUtils.js