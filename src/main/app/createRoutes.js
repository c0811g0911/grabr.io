import React from 'react';
import {setLanguage} from './actions/AppActionCreators';
import {IndexRoute, Route} from 'react-router/es6';
import {getLanguages} from './LanguageModel';
import {HttpStatusCode} from './network/api/HttpStatusCode';
import {AboutPage} from './pages/_about/AboutPage';
import {NotFoundPage} from './pages/not-found/NotFoundPage';
import {ErrorPage} from './pages/error/ErrorPage';
import {AppStore} from './stores/AppStore';
import {ItemPage} from './pages/item/ItemPage';
import {FaqPage} from './pages/_faq/FaqPage';
import {TermsPage} from './pages/_terms/TermsPage';
import {PrivacyPage} from './pages/_privacy/PrivacyPage';
import {EmailPage} from './pages/_email/EmailPage';
import {PhonePage} from './pages/_phone/PhonePage';
import {PersonalSettingsPage} from './pages/_personal-settings/PersonalSettingsPage';
import {PayoutPage} from './pages/_payout/PayoutPage';
import {PaymentSettingsPage} from './pages/_payment-settings/PaymentSettingsPage';
import {LocalStore} from './stores/LocalStore';
import {LandingPage} from './pages/landing/LandingPage';
import {ShopPage} from './pages/shop/ShopPage';
import {GrabNewPage} from './pages/_grab-new/GrabNewPage';
import {SharePage} from './pages/share/SharePage';
import {CouponsPage} from './pages/coupons/CouponsPage';
import {GrabEditPage} from './pages/_grab-edit/GrabEditPage';
import {BecomeTravelerPage} from './pages/_become-traveler/BecomeTravelerPage';
import {LoginPage} from './pages/_login/LoginPage';
import {SignupPage} from './pages/_signup/SignupPage';
import {PasswordResetPage} from './pages/_password-reset/PasswordResetPage';
import {NotificationsPage} from './pages/_notifications/NotificationsPage';
import {OfferNewPage} from './pages/_offer-new/OfferNewPage';
import {OfferPage} from './pages/offer/OfferPage';
import {ConversationsPage} from './pages/_conversations/ConversationsPage';
import {ConversationPage} from './pages/_conversation/ConversationPage';
import {ConversationNewPage} from './pages/_conversation-new/ConversationNewPage';
import {UserPage} from './pages/_user/UserPage';
import {ReviewsPage} from './pages/_reviews/ReviewsPage';
import {TravelPage} from './pages/travel/TravelPage';
import {CollectionsPage} from './pages/collections/CollectionsPage';
import {CollectionPage} from './pages/collection/CollectionPage';
import {InvitationPage} from './pages/invitation/InvitationPage';
import {GrabPage} from './pages/grab/GrabPage';
import {SettingsPage} from './pages/_settings/SettingsPage';
import {IdentificationPage} from './pages/_identification/IdentificationPage';
import {ItinerarySubscriptionsPage} from './pages/_itinerary-subscriptions/ItinerarySubscriptionsPage';
import {SmsNotificationsPage} from './pages/_sms-notifications/SmsNotificationsPage';
import {RequestTimeoutPage} from './pages/request-timeout/RequestTimeoutPage';
import {AdminBannerListPage} from './pages/_admin-banner-list/AdminBannerListPage';
import {AdminBannerNewPage} from './pages/_admin-banner-new/AdminBannerNewPage';
import {AdminBannerEditPage} from './pages/_admin-banner-edit/AdminBannerEditPage';
import {AdminGrabListPage} from './pages/_admin-grab-list/AdminGrabListPage';
import {AdminUserListPage} from './pages/_admin-user-list/AdminUserListPage';
import {AdminCollectionListPage} from './pages/_admin-collection-list/AdminCollectionListPage';
import {AdminCollectionNewPage} from './pages/_admin-collection-new/AdminCollectionNewPage';
import {AdminCollectionEditPage} from './pages/_admin-collection-edit/AdminCollectionEditPage';
import {AdminTagListPage} from './pages/_admin-tag-list/AdminTagListPage';
import {AdminTagNewPage} from './pages/_admin-tag-new/AdminTagNewPage';
import {AdminTagEditPage} from './pages/_admin-tag-edit/AdminTagEditPage';
import {AdminPromotionListPage} from './pages/_admin-promotion-list/AdminPromotionListPage';
import {AdminPromotionNewPage} from './pages/_admin-promotion-new/AdminPromotionNewPage';
import {AdminPromotionEditPage} from './pages/_admin-promotion-edit/AdminPromotionEditPage';
import {AdminItemListPage} from './pages/_admin-item-list/AdminItemListPage';
import {AdminItemNewUrlPage} from './pages/_admin-item-new-url/AdminItemNewUrlPage';
import {AdminItemNewPage} from './pages/_admin-item-new/AdminItemNewPage';
import {AdminItemEditPage} from './pages/_admin-item-edit/AdminItemEditPage';
import {TravelFilteredPage} from './pages/travel/TravelFilteredPage';
import {AccountStore} from './stores/AccountStore';
import {GrabNewSuccessPage} from './pages/_grab-new/GrabNewSuccessPage';
import {confirmEmail} from './actions/ProfileActionCreators';


// Create routes to render depending on state of the application.
export function createRoutes(context) {
  const state = context.getStore(AppStore).getState();
  const {statusCode} = state;
  const isLoggedIn = context.getStore(LocalStore).isLoggedIn();
  const isTraveler = context.getStore(AccountStore).isTraveler();
  const isAdmin = context.getStore(AccountStore).isAdmin();

  switch (statusCode) {

    case HttpStatusCode.INTERNAL_SERVER_ERROR:
      return <Route path="*" component={ErrorPage}/>;

    case HttpStatusCode.NOT_FOUND:
      return <Route path="*" component={NotFoundPage}/>;

    case HttpStatusCode.REQUEST_TIMEOUT:
      return <Route path="*" component={RequestTimeoutPage}/>;

    default:
      // Page r outes are rendered after locale segment, ex. `/en/:pageRoute`
      const pageRoutes = (
        <Route>
          <Choose>
            <When condition={isLoggedIn}>
              <IndexRoute component={ShopPage}/>
            </When>
            <Otherwise>
              <IndexRoute component={LandingPage}/>
            </Otherwise>
          </Choose>

          <Route path="shop" component={ShopPage}/>

          <Route path="terms" component={TermsPage}/>
          <Route path="about" component={AboutPage}/>
          <Route path="faq" component={FaqPage}/>
          <Route path="privacy" component={PrivacyPage}/>

          <If condition={isLoggedIn && !isTraveler}>
            <Route path="traveler" component={BecomeTravelerPage}/>
          </If>

          <If condition={!isLoggedIn}>
            <Route path="login" component={LoginPage}/>
            <Route path="signup" component={SignupPage}/>
            <Route path="password/reset" component={PasswordResetPage}/>
            <Route path="invitation/:referralCode" component={InvitationPage}/>
          </If>

          <Route path="share" component={SharePage} onEnter={redirectToLogin}/>
          <Route path="coupons" component={CouponsPage} onEnter={redirectToLogin}/>
          <Route path="notifications" component={NotificationsPage} onEnter={redirectToLogin}/>

          <Route path="conversations">
            <IndexRoute component={ConversationsPage} onEnter={redirectToLogin}/>
            <Route path=":id" component={ConversationPage} onEnter={redirectToLogin}/>
          </Route>
          <Route path="grabs/:grabId/conversations/new" component={ConversationNewPage} onEnter={redirectToLogin}/>

          <Route path="items/:id" component={ItemPage}/>

          <Route path="grabs">
            <Route path="new">
              <IndexRoute component={GrabNewPage}/>
              <Route path="success" component={GrabNewSuccessPage}/>
            </Route>
            <Route path=":id" component={GrabPage}/>
            <Route path=":id/offer/new" component={OfferNewPage}/>

            <If condition={isLoggedIn}>
              <Route path=":id/edit" component={GrabEditPage}/>
              <Route path=":grabId/offer/:offerId/payment" component={OfferPage}/>
            </If>
          </Route>

          <Route path="collections">
            <IndexRoute component={CollectionsPage}/>
            <Route path=":id" component={CollectionPage}/>
          </Route>

          <Route path="users">
            <Route path=":id" component={UserPage}/>
            <Route path=":id/reviews/:type" component={ReviewsPage}/>
          </Route>

          <Route path="travel">
            <IndexRoute component={TravelPage}/>

            <Route path="to/:toId" component={TravelFilteredPage}/>
            <Route path="from/:fromId" component={TravelFilteredPage}/>
            <Route path="from/:fromId/to/:toId" component={TravelFilteredPage}/>
            <Route path="to/:toId/from/:fromId" component={TravelFilteredPage}/>
          </Route>

          <Route path="email/confirmation" onEnter={(nextState, replace, callback) => {
            const {token} = nextState.location.query;
            return context.executeAction(confirmEmail, {token})
                          .then(() => {
                            replace('/settings/email');
                            callback();
                          })
                          .catch(callback);
          }}/>

          <Route path="settings" onEnter={redirectToLogin}>
            <IndexRoute component={SettingsPage}/>
            <Route path="personal" component={PersonalSettingsPage}/>
            <Route path="email" component={EmailPage}/>
            <Route path="phone" component={PhonePage}/>
            <Route path="payout" component={PayoutPage}/>
            <Route path="payment" component={PaymentSettingsPage}/>
            <Route path="identification" component={IdentificationPage}/>
            <Route path="traveler-notifications" component={ItinerarySubscriptionsPage}/>
            <Route path="sms-notifications" component={SmsNotificationsPage}/>
          </Route>

          <If condition={isAdmin}>
            <Route path="admin">
              <IndexRoute component={AdminGrabListPage}/>

              <Route path="grabs">
                <IndexRoute component={AdminGrabListPage}/>
              </Route>

              <Route path="users">
                <IndexRoute component={AdminUserListPage}/>
              </Route>

              <Route path="items">
                <IndexRoute component={AdminItemListPage}/>
                <Route path="new" component={AdminItemNewPage}/>
                <Route path="new/url" component={AdminItemNewUrlPage}/>
                <Route path=":id/edit" component={AdminItemEditPage}/>
              </Route>

              <Route path="banners">
                <IndexRoute component={AdminBannerListPage}/>
                <Route path="new" component={AdminBannerNewPage}/>
                <Route path=":id/edit" component={AdminBannerEditPage}/>
              </Route>

              <Route path="collections">
                <IndexRoute component={AdminCollectionListPage}/>
                <Route path="new" component={AdminCollectionNewPage}/>
                <Route path=":id/edit" component={AdminCollectionEditPage}/>
              </Route>

              <Route path="tags">
                <IndexRoute component={AdminTagListPage}/>
                <Route path="new" component={AdminTagNewPage}/>
                <Route path=":id/edit" component={AdminTagEditPage}/>
              </Route>

              <Route path="promotions">
                <IndexRoute component={AdminPromotionListPage}/>
                <Route path="new" component={AdminPromotionNewPage}/>
                <Route path=":id/edit" component={AdminPromotionEditPage}/>
              </Route>
            </Route>
          </If>
        </Route>
      );

      return <Route path="/">
        <IndexRoute onEnter={(history, replace) => replace(state.language)}/>
        {getLanguages().map(language => <Route key={language}
                                               path={language}
                                               onEnter={() => context.executeAction(setLanguage, {language})}>
          {pageRoutes}
        </Route>)}
      </Route>;
  }

  function redirectToLogin(state, replace) {
    if (!isLoggedIn) {
      replace('/login?redirect=' + encodeURIComponent(state.location.pathname));
    }
  }
}



// WEBPACK FOOTER //
// ./src/main/app/createRoutes.js