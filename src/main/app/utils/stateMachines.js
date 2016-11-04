import React from 'react';
import {openModal, closeModal, closeAllModals} from '../actions/ModalActionCreators';
import {loadAccount} from '../actions/ProfileActionCreators';
import {pushHistoryState} from '../actions/HistoryActionCreators';
import {Login} from '../components/_login/Login';
import {Phone} from '../components/_phone/Phone';
import {Email} from '../components/_email/Email';
import {PaymentForm} from '../components/_payment-form/PaymentForm';

const fsm = transitions => initialState => {
  let currentState = initialState;
  return [
    event => {
      if (event.reset) {
        currentState = event.state || {};
        return;
      }

      transitions.forEach(transition => {
        let {when, received, then} = transition;

        if (when(currentState) && received(event)) {
          let [nextState, action] = then(currentState, event);
          action(currentState, event, nextState);
          currentState = nextState;
        }
      });
    }, () => currentState
  ];
};

const [changeState, getState] = fsm([
  {
    when: ({page}) => true,
    received: ({type}) => type === 'email_open',
    then: (state, {data}) => [
      {...state, page: 'email', data, isModal: true}, (_, {context, copy, defaultNewsletter, showContinueButton}) => {
        context.executeAction(loadAccount, {});
        context.executeAction(openModal, {
          contentCreator: () => <Email copy={copy}
                                       showContinueButton={showContinueButton}
                                       defaultNewsletter={defaultNewsletter}/>
        });
      }
    ]
  }, {
    when: ({page}) => true,
    received: ({type}) => type === 'finish',
    then: () => [
      {}, ({callback, isModal}, {context, redirectUrl}) => {
        if (isModal) {
          context.executeAction(closeModal);
        } else if (!callback) {
          context.executeAction(pushHistoryState, [redirectUrl || '/settings']);
        }
        if (callback) {
          callback();
        }
      }
    ]
  }, {
    when: ({page}) => true,
    received: ({type}) => type === 'cancel',
    then: () => [
      {}, ({isModal}, {context, redirectUrl}) => {
        if (isModal) {
          context.executeAction(closeModal);
        } else {
          context.executeAction(pushHistoryState, [redirectUrl || '/settings']);
        }
      }
    ]
  }, {
    when: ({page}) => true,
    received: ({type}) => type === 'phone_open',
    then: (state, {callback}) => [
      {...state, page: 'phone', callback, isModal: true}, (_, {context, copy}) => {
        context.executeAction(loadAccount, {}, () => {
          context.executeAction(openModal, {
            contentCreator: () => <Phone copy={copy}/>
          });
        });
      }
    ]
  }, {
    when: ({page}) => true,
    received: ({type}) => type === 'payment_open',
    then: (state, {callback}) => [
      {...state, page: 'payment', callback, isModal: true}, (_, {context}) => {
        context.executeAction(loadAccount, {}, () => {
          context.executeAction(openModal, {
            contentCreator: () => <PaymentForm />
          });
        });
      }
    ]
  }, {
    when: ({page}) => true,
    received: ({type}) => type === 'payment_finish',
    then: () => [
      {}, ({callback}, {}) => {
        if (callback) {
          callback();
        }
      }
    ]
  }, {
    when: () => true,
    received: ({type}) => type === 'login_start',
    then: (state, {callback, redirectUrl}) => [
      {callback, redirectUrl}, () => {
      }
    ]
  }, {
    when: () => true,
    received: ({type}) => type === 'login_open',
    then: (state, {callback, redirectUrl}) => [
      {page: 'login', callback, redirectUrl}, (state, {context, copy}) => {
        context.executeAction(openModal, {
          contentCreator: () => <Login copy={copy}/>
        });
      }
    ]
  }, {
    when: () => true,
    received: ({type}) => type === 'login_finish',
    then: state => [
      state, ({callback, redirectUrl}, {context, executeCallback}) => {
        context.executeAction(closeAllModals);
        if (redirectUrl) {
          context.executeAction(pushHistoryState, [redirectUrl]);
        }
        if (callback && executeCallback) {
          callback();
        }
        if (!callback && !redirectUrl) {
          context.executeAction(pushHistoryState, ['/']);
        }
      }
    ]
  }, {
    when: () => true,
    received: ({type}) => type === 'become_a_traveler_redirect',
    then: (state, {callback}) => [
      {page: 'become_a_traveler', callback}, (state, {context, copy}) => {
        context.executeAction(pushHistoryState, ['/traveler?copy=' + copy]);
      }
    ]
  }
])({});

export {changeState, getState};



// WEBPACK FOOTER //
// ./src/main/app/utils/stateMachines.js