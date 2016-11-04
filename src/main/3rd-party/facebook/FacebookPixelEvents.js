function debug(...args) {
  logger.warn('analytics/facebook-pixel', ...args);
}

async function fbq() {
  switch (true) {
    case !window:
      throw '`Facebook pixel` is enabled for browsers only';
    case !window.fbq:
      throw '`window.fbq` does not exist';
    default:
      return window.fbq;
  }
}

export async function track(eventName, parameters) {
  try {
    const fbq$ = await fbq();
    return fbq$('track', eventName, parameters);
  } catch (error) {
    debug(error);
  }
}

export async function trackCustom(eventName, parameters) {
  try {
    const fbq$ = await fbq();
    return fbq$('trackCustom', eventName, parameters);
  } catch (error) {
    debug(error);
  }
}

export async function facebookPixelTrackCompleteRegistration() {
  return track('CompleteRegistration', {});
}

export async function facebookPixelTrackGrabCreationOpened({
  item: {
    id,
    name: content_name,
    quantity: num_items
  },
  total: {
    amount: value,
    currency
  }
}) {
  return track('InitiateCheckout', {
    value,
    currency,
    content_name,
    content_type: 'product',
    content_ids: id ? [`${ id }`] : [],
    num_items
  });
}

export async function facebookPixelTrackAddPaymentInfo() {
  return track('AddPaymentInfo', {});
}

export async function facebookPixelTrackAcceptOffer({
  item: {
    id,
    name: content_name,
    quantity: num_items
  },
  total: {
    amount: value,
    currency
  }
}) {
  return track('Purchase', {
    value,
    currency,
    content_name,
    content_type: 'product',
    content_ids: [`${ id }`],
    num_items
  });
}

export async function facebookPixelTrackGrabCreationFinished({
  grab: {
    id: grab_id
  },
  item: {
    id: item_id,
    name: content_name,
    quantity: num_items
  },
  total: {
    amount: value,
    currency
  }
}) {
  return trackCustom('GrabCreationFinished', {
    grab_id,
    value,
    currency,
    content_name,
    content_type: 'product',
    content_ids: [`${ item_id }`],
    num_items
  });
}

export async function facebookPixelTrackMakeOfferFinished({
  grab: {
    id: grab_id
  },
  offer: {
    amount: value,
    currency
  }
}) {
  return trackCustom('MakeOfferFinished', {
    grab_id,
    value,
    currency
  });
}



// WEBPACK FOOTER //
// ./src/main/3rd-party/facebook/FacebookPixelEvents.js