// fixme: WTF?! Why is React here?
import React from 'react';
import {Actions} from '../actions/Constants';
import {Confirm} from '../components/_confirm/Confirm';

export async function openModal(context, {contentCreator}) {
  context.dispatch(Actions.OPEN_MODAL, {contentCreator});
}

export async function closeModal(context) {
  context.dispatch(Actions.CLOSE_MODAL);
}

export async function closeAllModals(context) {
  context.dispatch(Actions.CLOSE_ALL_MODALS);
}



// WEBPACK FOOTER //
// ./src/main/app/actions/ModalActionCreators.js