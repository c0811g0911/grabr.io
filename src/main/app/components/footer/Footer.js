import React from 'react';
import {Link} from 'react-router';
import './_footer.scss';
import {FacebookSquareIcon} from '../../../images/FacebookSquareIcon';
import {TwitterIcon} from '../../../images/TwitterIcon';
import {VkIcon} from '../../../images/VkIcon';
import {PinterestIcon} from '../../../images/PinterestIcon';
import {InstagramIcon} from '../../../images/InstagramIcon';
import {AppStoreBadgeIcon} from '../../../images/AppStoreBadgeIcon';
import {GrabrLogoIcon} from '../../../images/GrabrLogoIcon';
import {AppStore} from '../../stores/AppStore';
import {FormattedMessage} from 'react-intl';
import {LANGUAGE_COOKIE, LANGUAGE_EN, LANGUAGE_RU} from '../../LanguageModel';
import {writeCookie} from '../../utils/CookieUtils';

const {func} = React.PropTypes;

export class Footer extends React.Component {

  static contextTypes = {
    getStore: func.isRequired
  };

  setLanguage = language => {
    writeCookie(LANGUAGE_COOKIE, language);
    window.location = '/';
  };

  render() {
    const {language} = this.context.getStore(AppStore).getState();

    return (
      <div className="bg-primary p-y-3 p-xs-x-1 p-md-x-0 ">
        <div className="container">
          <div className="row">

            <div className="col-xs-12 col-md-4 col-lg-3 offset-lg-1">
              <GrabrLogoIcon/>
              <div className="m-t-1">
                @ 2016 Grabr
              </div>
            </div>
            <div className="col-xs-12 col-md-2 m-t-1 m-md-t-0">
              <div className="flex-col flex-items-start">
                <Link to="/about" className="link-unstyled">
                  <FormattedMessage id="components.footer.about" />
                </Link>
                <Link to="/faq" className="link-unstyled">
                  <FormattedMessage id="components.footer.faq" />
                </Link>
                <Link to="https://grabr.io/blog" target="_blank" className="link-unstyled">
                  <FormattedMessage id="components.footer.blog" />
                </Link>
                <a href="mailto:press@grabr.io" className="link-unstyled">
                  <FormattedMessage id="components.footer.press"/>
                </a>
              </div>
            </div>
            <div className="col-xs-12 col-md-2 m-t-1 m-md-t-0">
              <div className="flex-col flex-items-start">
                <Link to="/terms" className="link-unstyled">
                  <FormattedMessage id="components.footer.terms" />
                </Link>
                <Link to="/privacy" className="link-unstyled">
                  <FormattedMessage id="components.footer.privacy" />
                </Link>
                <a href="mailto:partnerships@grabr.io" className="link-unstyled">
                  <FormattedMessage id="components.footer.partnerships" />
                </a>
              </div>
            </div>
            <div className="col-xs-12 col-md-4 col-lg-3 m-t-1 m-md-t-0">
              <div className="footer__social m-x-auto">
                <div className="flex-row flex-justify-between">
                  <button type="button" onClick={() => {this.setLanguage(LANGUAGE_EN)}} className="btn-unstyled">
                    <FormattedMessage id="components.footer.english" />
                  </button>
                  <button type="button" onClick={() => {this.setLanguage(LANGUAGE_RU)}} className="btn-unstyled">
                    <FormattedMessage id="components.footer.russian" />
                  </button>
                </div>
                <div className="flex-row flex-justify-between m-t-3">
                  <Link to={ language === 'ru'
                    ? 'https://www.facebook.com/grabr.russia'
                    : 'https://www.facebook.com/grabrinc' } target="_blank" className="link-unstyled">
                    <FacebookSquareIcon/>
                  </Link>
                  <a href="https://twitter.com/grabrinc" target="_blank" className="link-unstyled">
                    <TwitterIcon/>
                  </a>
                  <a href="https://vk.com/grabrinc" target="_blank" className="link-unstyled">
                    <VkIcon/>
                  </a>
                  <a href="https://www.pinterest.com/grabrinc/" target="_blank" className="link-unstyled">
                    <PinterestIcon/>
                  </a>
                  <a href="https://instagram.com/grabrinc" target="_blank" className="link-unstyled">
                    <InstagramIcon/>
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="row">
            <div className="col-xs-12 col-lg-10 offset-lg-1 flex-row flex-justify-center m-t-2 p-t-2 footer__foot">
              <Link to="https://itunes.apple.com/us/app/apple-store/id992182861?pt=117798974&ct=Mini_banner_footer&mt=8" target="_blank">
                <AppStoreBadgeIcon/>
              </Link>
            </div>
          </div>

        </div>


      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/footer/Footer.js