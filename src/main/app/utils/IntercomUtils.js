let intercomId;

export const intercomBoot = (appId, account, url) => {
  if (!CLIENT || !appId) {
    return;
  }

  intercomId = appId;
  const user = account.getUser();

  if (!account.isGuest()) {
    window.Intercom('boot', {
      app_id: intercomId,
      user_id: user.getId(),
      email: user.getEmail(),
      name: user.getFullName()
    });
  } else {
    window.Intercom('boot', {app_id: intercomId});
  }
  intercomUpdateVisibility(url);
};

const intercomUpdateVisibility = url => {
  if (url.indexOf('conversations') > -1) {
    intercomHide();
  } else {
    intercomShow();
  }
};

const intercomHide = () => {
  if (SERVER || !intercomId) {
    return;
  }

  document.body.classList.add('intercom-disabled');
};

const intercomShow = () => {
  if (SERVER || !intercomId) {
    return;
  }

  document.body.classList.remove('intercom-disabled');
};

const intercomOpenChat = () => {
  if (SERVER || !intercomId) {
    return;
  }

  window.Intercom('show');
};

const intercomGrabCreationAbandoned = () => {
  if (SERVER || !intercomId) {
    return;
  }

  window.Intercom('trackEvent', 'Grab creation abandoned');
};

export {
  intercomUpdateVisibility,
  intercomOpenChat,
  intercomGrabCreationAbandoned,
  intercomHide,
  intercomShow
};



// WEBPACK FOOTER //
// ./src/main/app/utils/IntercomUtils.js