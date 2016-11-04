import {getMixpanel, getMixpanelClickPage} from './MixpanelGetters';

async function track(event_name, properties = {}) {
  try {
    const mixpanel = getMixpanel();
    return new Promise(resolve => {
      mixpanel.track(event_name, properties, resolve);
    });
  } catch (error) {
    logger.warn('src/main/3rd-party/mixpanel', error);
  }
}

function click(properties = {}) {
  return track('Click', properties);
}


// Grab events
//
export function mixpanelTrackGrabCreationFinished(type, url, itemId, itemTitle) {
  return track('Grab Creation Finished', {
    type,
    url,
    'item id': itemId,
    'item title': itemTitle
  });
}

export function mixpanelTrackGrabPublishFinished(type, url, itemId, itemTitle) {
  return track('Grab Publish Finished', {
    type,
    url,
    'item id': itemId,
    'item title': itemTitle
  });
}

// Item events
//
export function mixpanelTrackItemCreationFinished(type, url) {
  return track('Item Creation Finished', {type, url});
}

// Landing events
//
export function mixpanelClickLandingShopHeader() {
  return click({
    Page: 'Landing',
    Target: 'Shop',
    Location: 'Header'
  });
}

export function mixpanelClickLandingTravelHeader() {
  return click({
    Page: 'Landing',
    Target: 'Travel',
    Location: 'Header'
  });
}

export function mixpanelClickLandingPasteUrlUrlInput() {
  return click({
    Page: 'Landing',
    Target: 'Paste url',
    Location: 'Url input'
  });
}

export function mixpanelClickLandingStartOrderUrlInput() {
  return click({
    Page: 'Landing',
    Target: 'Start order',
    Location: 'Url input'
  });
}

export function mixpanelClickLandingStartOrderWhyShop() {
  return click({
    Page: 'Landing',
    Target: 'Start order',
    Location: 'Why shop'
  });
}

export function mixpanelClickLandingRecentDeliveryRequestsEarnMoney() {
  return click({
    Page: 'Landing',
    Target: 'Recent delivery requests',
    Location: 'Earn money'
  });
}

export function mixpanelClickLandingStartOrderRecentlyCompletedGrabs() {
  return click({
    Page: 'Landing',
    Target: 'Start order',
    Location: 'Recently completed grabs'
  });
}

export function mixpanelClickLandingDeliverOrderRecentlyCompletedGrabs() {
  return click({
    Page: 'Landing',
    Target: 'Deliver order',
    Location: 'Recently completed grabs'
  });
}

function pageView(page) {
  return track('Page view', {page});
}

function resourceView(page, id, title) {
  return track('Page view', {
    page,
    'Resource id': id,
    'Resource type': page,
    'Resource title': title
  });
}

// Pageview events
//
export function mixpanelPageViewCollection(id, title) {
  return resourceView('collection', id, title);
}

export function mixpanelPageViewGrab(id, title) {
  return resourceView('grab', id, title);
}

export function mixpanelPageViewItem(id, title) {
  return resourceView('item', id, title);
}

export function mixpanelPageViewOffer(id) {
  return resourceView('offer', id);
}

export function mixpanelPageViewCollections() {
  return pageView('collections');
}

export function mixpanelPageViewLanding() {
  return pageView('landing');
}

export function mixpanelPageViewLogin() {
  return pageView('login');
}

export function mixpanelPageViewReferral() {
  return pageView('referral');
}

export function mixpanelPageViewInvitation() {
  return pageView('invitation');
}

export function mixpanelPageViewShop() {
  return pageView('shop');
}

export function mixpanelPageViewTravel() {
  return pageView('travel');
}

export function mixpanelPageViewGrabCreationStep1() {
  return pageView('grab creation step 1');
}

export function mixpanelPageViewGrabCreationStep2() {
  return pageView('grab creation step 2');
}

export function mixpanelPageViewGrabCreationStep3() {
  return pageView('grab creation step 3');
}

export function mixpanelPageViewOfferCreation() {
  return pageView('offer creation');
}

export function mixpanelPageViewBecomeTraveler() {
  return pageView('become traveler');
}

// Misc events
//
function mixpanelClickGrabCard(target) {
  const mixpanelClickPage = getMixpanelClickPage();
  if (!mixpanelClickPage) {
    debugger;
  }
  return click({
    Page: mixpanelClickPage,
    Target: target,
    Location: 'Grab card'
  });
}

export function mixpanelClickGrabCardImage() {
  return mixpanelClickGrabCard('Image');
}

export function mixpanelClickGrabCardMakeOffer() {
  return mixpanelClickGrabCard('Make Offer');
}

export function mixpanelClickGrabCardTitle() {
  return mixpanelClickGrabCard('Title');
}

export function mixpanelClickGrabCardUser() {
  return mixpanelClickGrabCard('User');
}

export function mixpanelClickAllShopNavigationBarMenu() {
  return click({
    Page: 'All',
    Target: 'Shop',
    Location: 'Navigation bar menu'
  });
}

export function mixpanelClickAllTravelNavigationBarMenu() {
  return click({
    Page: 'All',
    Target: 'Travel',
    Location: 'Navigation bar menu'
  });
}

export function mixpanelClickAllInviteFriendsNavigationBarMenu() {
  return click({
    Page: 'All',
    Target: 'Invite friends',
    Location: 'Navigation bar menu'
  });
}

export function mixpanelClickOrderCreationInviteFriendsOrderCreation() {
  return click({
    Page: 'Order creation',
    Target: 'Invite friends',
    Location: 'Order creation'
  });
}

export function mixpanelClickGrabMakeOfferGrabPage() {
  return click({
    Page: 'Grab',
    Target: 'Make Offer',
    Location: 'Grab page'
  });
}

export function mixpanelClickItemRequestItemItemPage() {
  return click({
    Page: 'Item',
    Target: 'Request item',
    Location: 'Item page'
  });
}

// Share events
//
export function mixpanelTrackShare(page, media) {
  return track('Share', {page, media});
}

// Session events
//
export function mixpanelTrackLoginFinished(new_user, provider) {
  return track('Login Finished', {new_user, provider});
}

export function mixpanelTrackLoggedOut() {
  return track('Logged out');
}

// Shop events
//
export function mixpanelClickShopShopHeader() {
  return click({
    Page: 'Shop',
    Target: 'Shop',
    Location: 'Header'
  });
}

export function mixpanelClickShopTravelHeader() {
  return click({
    Page: 'Shop',
    Target: 'Travel',
    Location: 'Header'
  });
}

export function mixpanelClickShopPasteUrlUrlInput() {
  return click({
    Page: 'Shop',
    Target: 'Paste url',
    Location: 'Url input'
  });
}

export function mixpanelClickShopStartOrderUrlInput() {
  return click({
    Page: 'Shop',
    Target: 'Start order',
    Location: 'Url input'
  });
}

export function mixpanelClickShopViewMoreGrabsViewMoreGrabs() {
  return click({
    Page: 'Shop',
    Target: 'View more grabs',
    Location: 'View more grabs'
  });
}

export function mixpanelClickShopLifestylebar(banner) {
  const {lead: {en: Target}} = banner;
  return click({
    Page: 'Shop',
    Target,
    Location: 'Lifestylebar'
  });
}

export function mixpanelClickShopCollections(collection) {
  const {title: {en: Target}} = collection;
  return click({
    Page: 'Shop',
    Target,
    Location: 'Collections'
  });
}

// Travel events
//
export function mixpanelClickTravelShopHeader() {
  return click({
    Page: 'Travel',
    Target: 'Shop',
    Location: 'Header'
  });
}

export function mixpanelClickTravelTravelHeader() {
  return click({
    Page: 'Travel',
    Target: 'Travel',
    Location: 'Header'
  });
}

export function mixpanelClickTravelFindGrabsFilterGrabRequests() {
  return click({
    Page: 'Travel',
    Target: 'Find grabs',
    Location: 'Filter grab requests'
  });
}

export function mixpanelClickTravelDestinations(city) {
  const {translations: {en: Target}} = city;
  return click({
    Page: 'Travel',
    Target,
    Location: 'Destinations'
  });
}



// WEBPACK FOOTER //
// ./src/main/3rd-party/mixpanel/MixpanelEvents.js