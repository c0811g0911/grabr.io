import React from 'react';
import classNames from 'classnames';
import {GenericScrollBox} from 'react-scroll-box';
import {AppStoreBadgeIcon} from '../../../images/AppStoreBadgeIcon';
import {Input} from 'react-text-input';
import {NotSoldItemsIcon} from './NotSoldItemsIcon';
import {UniqueItemsIcon} from './UniqueItemsIcon';
import {ExpensiveItemsIcon} from './ExpensiveItemsIcon';
import {ConfidenceIcon} from './ConfidenceIcon';
import {OptionsIcon} from './OptionsIcon';
import {RewardIcon} from './RewardIcon';
import {VisaIcon} from './VisaIcon';
import {MasterCardIcon} from './MasterCardIcon';
import {PayPalIcon} from './PayPalIcon';
import {DiscoverIcon} from './DiscoverIcon';
import {StripeIcon} from './StripeIcon';
import {AmericanExpressIcon} from './AmericanExpressIcon';
import {CompletedGrabCard} from '../../components/completed-grab-card/CompletedGrabCard';
import {FacebookSquareIcon} from '../../../images/FacebookSquareIcon';
import URI from 'urijs';
import {Link} from 'react-router/es6';
import {shuffle} from 'lodash';
import {recent} from './recent';
import {
  mixpanelClickLandingPasteUrlUrlInput,
  mixpanelClickLandingStartOrderUrlInput,
  mixpanelClickLandingStartOrderWhyShop,
  mixpanelClickLandingRecentDeliveryRequestsEarnMoney,
  mixpanelClickLandingStartOrderRecentlyCompletedGrabs,
  mixpanelClickLandingDeliverOrderRecentlyCompletedGrabs,
  mixpanelPageViewLanding
} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {AppStore} from '../../stores/AppStore';
import {loginFacebook} from '../../actions/LoginActionCreators';
import './_landing.scss';
import {FormattedMessage} from 'react-intl';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {pushHistoryState} from '../../actions/HistoryActionCreators';
import fbImage from '../../../images/fb.png';
import {LANGUAGE_RU} from '../../LanguageModel';
import {trackPageView} from '../../utils/trackPageView';

const {func, object} = React.PropTypes;

export class LandingPage extends React.Component {

  static contextTypes = {
    getStore: func.isRequired,
    executeAction: func.isRequired,
    intl: object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      recentGrabs: shuffle(recent).slice(0, 3)
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.isDesktop()) {
      this.startSlideshow();
    }
    this.setState({
      recentGrabs: this.state.recentGrabs.map(data => ({
        ...data,
        travelerSrc: require(`./images/recent/${ data.id }/traveler.jpeg`),
        consumerSrc: require(`./images/recent/${ data.id }/consumer.jpeg`),
        itemSrc: require(`./images/recent/${ data.id }/item.jpeg`)
      }))
    });
    mixpanelPageViewLanding();
    trackPageView(this.context, {path: `/`});
  }

  componentWillUpdate(nextProps, nextState) {
    const width = this.getSliderWidth();
    this.refs.phoneSlider.scrollTo(nextState.step * width, 0, 500, (percent, elapsed, min, max, duration) => -(max -
                                                                                                               min) *
                                                                                                             (elapsed /= duration) *
                                                                                                             (elapsed -
                                                                                                              2) + min);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  isDesktop = () => {
    return window.innerWidth > 900; // FIXME magic number
  };

  getSliderWidth = () => {
    return this.refs.phoneSlider.viewport.offsetWidth;
  };

  startSlideshow = () => {
    return this.timeout = setTimeout(() => {
      // FIXME magic number of slides
      this.setState({step: (this.state.step + 1) % 4});
      this.timeout = this.startSlideshow();
    }, 2000);
  };

  scrollTo = i => {
    clearTimeout(this.timeout);
    this.setState({step: i});
  };

  render() {
    return (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'meta.title'})}
          </title>
          <meta name="description" content={this.context.intl.formatMessage({id: 'meta.description'})}/>
          <meta property="og:type" content="website"/>
          <meta property="og:site_name" content="Grabr"/>
          <meta property="og:title" content={this.context.intl.formatMessage({id: 'meta.title'})}/>
          <meta property="og:description" content={this.context.intl.formatMessage({id: 'meta.description'})}/>
          <meta property="og:url" content="https://grabr.io"/>
          <meta property="og:image" content={fbImage}/>
        </Head>
        <Body>
          <div>
            <NavigationBar/>
            <main className="landing">

              <section className="landing__section landing__section--header-banner flex-col">
                <div className="flex-grow flex-col flex-justify-center flex-items-center">

                  <div className="container w-100 m-t-3">
                    <div className="row">
                      <div className="col-xs-12 text-xs-center
                                  col-md-10 offset-md-1
                                  col-lg-8 offset-lg-2">
                        <h2>
                          <FormattedMessage id="pages.landing.intro.title" />
                        </h2>
                      </div>
                    </div>
                    <div className="row">
                      <div className="text-xs-center col-md-10 offset-md-1">
                        <p className="font-size-lg m-b-2 p-x-1">
                          <FormattedMessage id="pages.landing.intro.lead" />
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12
                                  col-md-10 offset-md-1
                                  col-lg-8 offset-lg-2">
                        <div className="p-x-1">
                          <form className="input-group hidden-xs-down p-t-1" onSubmit={event => {
                            event.preventDefault();
                            mixpanelClickLandingStartOrderUrlInput();
                            const {value} = this.state;
                            const urlOrTitle = new URI(value).is('absolute') ? 'url' : 'title';
                            const url = URI.expand('/grabs/new{?q*}', {q: {[urlOrTitle]: value}}).href();
                            this.context.executeAction(pushHistoryState, [url]);
                          }}>
                            <Input type="text" className="form-control landing__search" onChange={event => {
                              this.setState({value: event.target.value});
                            }} onPaste={() => {
                              mixpanelClickLandingPasteUrlUrlInput();
                            }} placeholder={this.context.intl.formatMessage({id: 'pages.landing.intro.placeholder'})}/>
                            <span className="input-group-btn">
                            <button className="btn btn-primary p-x-3" type="submit">
                              <FormattedMessage id="pages.landing.intro.action" />
                            </button>
                          </span>
                          </form>
                          <Link to="/grabs/new" className="btn btn-block btn-primary hidden-sm-up">
                            <FormattedMessage id="pages.landing.intro.action" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="flex-col flex-items-center m-y-2">
                  <a href="https://itunes.apple.com/us/app/apple-store/id992182861?pt=117798974&ct=Mini_banner_mid&mt=8"
                     className="d-block m-b-2">
                    <AppStoreBadgeIcon className="font-size-sm"/>
                  </a>
                  <a href="#howitworks">
                    <FormattedMessage id="pages.landing.intro.how_link" />
                  </a>
                </div>
              </section>

              <section className="landing__section bg-white flex-col">
                <div className="container w-100 flex-grow flex-col flex-justify-between">
                  <div className="row">
                    <div className="col-xs-12 text-xs-center">
                      <div className="p-xs-a-1 p-md-a-3">
                        <h2>
                          <FormattedMessage id="pages.landing.why.title" />
                        </h2>
                        <p className="text-muted font-size-lg">
                          <FormattedMessage id="pages.landing.why.lead" />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row text-xs-center">
                    <div className="col-xs-12 col-md-4 m-xs-b-2 m-md-b-0">
                      <NotSoldItemsIcon />
                      <p className="m-xs-t-1 m-md-t-3 font-size-xl">
                        <FormattedMessage id="pages.landing.why.items.0.title" />
                      </p>
                      <If condition={this.context.getStore(AppStore).getState().language === LANGUAGE_RU}>
                        <p className="d-block font-size-sm text-muted p-x-1">
                          <FormattedMessage id="pages.landing.why.items.0.lead"/>
                        </p>
                      </If>
                    </div>
                    <div className="col-xs-12 col-md-4 m-xs-b-2 m-md-b-0">
                      <UniqueItemsIcon />
                      <p className="m-xs-t-1 m-md-t-3 font-size-xl">
                        <FormattedMessage id="pages.landing.why.items.1.title" />
                      </p>
                      <If condition={this.context.getStore(AppStore).getState().language === LANGUAGE_RU}>
                        <p className="d-block font-size-sm text-muted p-x-1">
                          <FormattedMessage id="pages.landing.why.items.1.lead"/>
                        </p>
                      </If>
                    </div>
                    <div className="col-xs-12 col-md-4 m-xs-b-2 m-md-b-0">
                      <ExpensiveItemsIcon />
                      <p className="m-xs-t-1 m-md-t-3 font-size-xl">
                        <FormattedMessage id="pages.landing.why.items.2.title" />
                      </p>
                      <If condition={this.context.getStore(AppStore).getState().language === LANGUAGE_RU}>
                        <p className="d-block font-size-sm text-muted p-x-1">
                          <FormattedMessage id="pages.landing.why.items.2.lead"/>
                        </p>
                      </If>
                    </div>
                  </div>
                  <div className="row p-xs-b-1 p-xs-x-1 p-md-b-3 p-sm-x-1">
                    <div className="col-xs-12
                                col-sm-8 offset-sm-2
                                col-md-6 offset-md-3">
                      <Link to="/grabs/new" className="btn btn-primary btn-block" onClick={() => {
                        mixpanelClickLandingStartOrderWhyShop();
                      }}>
                        <FormattedMessage id="pages.landing.why.action" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              <section className="landing__section flex-col flex-justify-between">
                <div className="container w-100 flex-rigid">
                  <div className="row text-xs-center p-a-1">
                    <Choose>
                      <When condition={this.context.getStore(AppStore).getState().language === 'ru'}>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="https://daily.afisha.ru/news/1641-v-rossii-zapuskaetsya-servis-grabr/"
                             className="landing__partner landing__partner--afisha"/>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="http://www.interviewrussia.ru/news/v-rossii-zarabotal-servis-grabr_"
                             className="landing__partner landing__partner--interview"/>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="https://www.buro247.ru/lifestyle/expert/3-faundery-ru-istorii-rossiyskikh-predprinimateley.html"
                             className="landing__partner landing__partner--buro"/>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="http://www.kommersant.ru/doc/3034655"
                             className="landing__partner landing__partner--kommersant"/>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="http://www.sncmedia.ru/news/kak-zarabotat-v-puteshestvii-grabr-pomozhet/"
                             className="landing__partner landing__partner--snc"/>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="https://www.cntraveller.ru/news/cervis-grarbr-zarabotal-v-rossii"
                             className="landing__partner landing__partner--traveler"/>
                        </div>
                      </When>
                      <Otherwise>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="https://techcrunch.com/2016/07/19/grabr-launches-peer-to-peer-marketplace-for-international-shipping/"
                             className="landing__partner landing__partner--tc"/>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="http://www.forbes.com/sites/grantmartin/2016/04/21/new-apps-allow-passengers-to-sell-unused-checked-luggage-space-grabr-airmule/#798640c337f2"
                             className="landing__partner landing__partner--forbes"/>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="http://www.infomoney.com.br/minhas-financas/consumo/noticia/5352902/site-permite-comprar-qualquer-lugar-mundo-com-ajuda-viajantes"
                             className="landing__partner landing__partner--bloomberg"/>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="https://www.cntraveller.ru/news/cervis-grarbr-zarabotal-v-rossii"
                             className="landing__partner landing__partner--traveler"/>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="http://www.psfk.com/2016/07/p2p-marketplace-enlists-travelers-to-pick-up-and-drop-off-goods.html"
                             className="landing__partner landing__partner--psfk"/>
                        </div>
                        <div className="col-xs-6 col-sm-4 col-md-2">
                          <a href="http://www.inc.com/christine-lagorio/grabr-launches-anything-delivery-peer-network.html"
                             className="landing__partner landing__partner--inc"/>
                        </div>
                      </Otherwise>
                    </Choose>
                  </div>
                </div>
                <div id="howitworks" className="bg-primary flex-grow flex-col flex-justify-center">
                  <div className="container w-100">
                    <div className="row flex-items-center">
                      <div className="col-xs-12
                                  col-md-5 offset-md-1 flex-row flex-justify-center">
                        <div className="landing__phone m-xs-y-3">
                          <div className="landing__phone-toggle flex-col flex-justify-between hidden-sm-down">
                            {[0, 1, 2, 3].map(i => <button key={i} className={classNames({
                              'landing__phone-toggle-button': true,
                              'landing__phone-toggle-button--selected': this.state.step === i
                            })} onClick={() => {
                              this.scrollTo(i);
                            }}/>)}
                          </div>
                          <GenericScrollBox ref="phoneSlider"
                                            className="landing__phone-screen scroll-box--wrapped"
                                            propagateWheelScroll={true}
                                            scrollableY={false}
                                            hideScrollBarX={true}
                                            hideScrollBarY={true}
                                            captureWheel={false}
                                            captureKeyboard={false}>
                            <div className="scroll-box__viewport">
                              <div className="flex-row">
                                <div className="landing__phone-screenshot landing__phone-screenshot--1 flex-rigid"/>
                                <div className="landing__phone-screenshot landing__phone-screenshot--2 flex-rigid"/>
                                <div className="landing__phone-screenshot landing__phone-screenshot--3 flex-rigid"/>
                                <div className="landing__phone-screenshot landing__phone-screenshot--4 flex-rigid"/>
                              </div>
                            </div>
                          </GenericScrollBox>
                        </div>
                      </div>
                      <div className="col-xs-12
                                  col-sm-8 offset-sm-2
                                  col-md-5 offset-md-0
                                  p-xs-x-2 p-md-x-0 m-b-2">
                        <h2 className="m-md-b-3 text-xs-center text-md-left">
                          <FormattedMessage id="pages.landing.how.title" />
                        </h2>
                        <div className="flex-row flex-items-center">
                          <h2 className="landing__how-grabr-works-step flex-rigid text-xs-center">
                            1
                          </h2>
                          <p className="m-l-1">
                            <FormattedMessage id="pages.landing.how.items.0" />
                          </p>
                        </div>
                        <div className="flex-row flex-items-center">
                          <h2 className="landing__how-grabr-works-step flex-rigid text-xs-center">
                            2
                          </h2>
                          <p className="m-l-1">
                            <FormattedMessage id="pages.landing.how.items.1" />
                          </p>
                        </div>
                        <div className="flex-row flex-items-center">
                          <h2 className="landing__how-grabr-works-step flex-rigid text-xs-center">
                            3
                          </h2>
                          <p className="m-l-1">
                            <FormattedMessage id="pages.landing.how.items.2" />
                          </p>
                        </div>
                        <div className="flex-row flex-items-center">
                          <h2 className="landing__how-grabr-works-step flex-rigid text-xs-center">
                            4
                          </h2>
                          <p className="m-l-1">
                            <FormattedMessage id="pages.landing.how.items.3" />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary">
                  <div className="container w-100 flex-rigid">
                    <div className="row">
                      <div className="col-xs-6 col-sm-4 col-md-2 flex-row flex-items-center flex-justify-center">
                        <VisaIcon className="flex-rigid"/>
                      </div>
                      <div className="col-xs-6 col-sm-4 col-md-2 flex-row flex-items-center flex-justify-center">
                        <MasterCardIcon className="flex-rigid"/>
                      </div>
                      <div className="col-xs-6 col-sm-4 col-md-2 flex-row flex-items-center flex-justify-center">
                        <PayPalIcon className="flex-rigid"/>
                      </div>
                      <div className="col-xs-6 col-sm-4 col-md-2 flex-row flex-items-center flex-justify-center">
                        <DiscoverIcon className="flex-rigid"/>
                      </div>
                      <div className="col-xs-6 col-sm-4 col-md-2 flex-row flex-items-center flex-justify-center">
                        <StripeIcon className="flex-rigid"/>
                      </div>
                      <div className="col-xs-6 col-sm-4 col-md-2 flex-row flex-items-center flex-justify-center">
                        <AmericanExpressIcon className="flex-rigid"/>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="landing__section bg-white flex-col">
                <div className="container w-100 flex-grow flex-col flex-justify-between">
                  <div className="row">
                    <div className="col-xs-12 text-xs-center">
                      <div className="p-xs-a-1 p-md-a-3">
                        <h2>
                          <FormattedMessage id="pages.landing.earn.title" />
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="row text-xs-center m-md-b-3">
                    <div className="col-xs-12 col-md-4 m-xs-b-2 m-md-b-0">
                      <ConfidenceIcon />
                      <p className="m-xs-t-1 m-md-t-3 font-size-xl">
                        <FormattedMessage id="pages.landing.earn.items.0.title" />
                      </p>
                      <p className="d-block font-size-sm text-muted p-x-1">
                        <FormattedMessage id="pages.landing.earn.items.0.lead" />
                      </p>
                    </div>
                    <div className="col-xs-12 col-md-4 m-xs-b-2 m-md-b-0">
                      <OptionsIcon />
                      <p className="m-xs-t-1 m-md-t-3 font-size-xl">
                        <FormattedMessage id="pages.landing.earn.items.1.title" />
                      </p>
                      <p className="d-block font-size-sm text-muted p-x-1">
                        <FormattedMessage id="pages.landing.earn.items.1.lead" />
                      </p>
                    </div>
                    <div className="col-xs-12 col-md-4 m-xs-b-2 m-md-b-0">
                      <RewardIcon />
                      <p className="m-xs-t-1 m-md-t-3 font-size-xl">
                        <FormattedMessage id="pages.landing.earn.items.2.title" />
                      </p>
                      <p className="d-block font-size-sm text-muted p-x-1">
                        <FormattedMessage id="pages.landing.earn.items.2.lead" />
                      </p>
                    </div>
                  </div>
                  <div className="row p-xs-b-1 p-xs-x-1 p-md-b-3 p-sm-x-1">
                    <div className="col-xs-12
                                col-sm-8 offset-sm-2
                                col-md-6 offset-md-3">
                      <Link to="/travel" className="btn btn-primary btn-block" onClick={() => {
                        mixpanelClickLandingRecentDeliveryRequestsEarnMoney();
                      }}>
                        <FormattedMessage id="pages.landing.earn.action" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              <section className="landing__section bg-primary flex-col">
                <div className="container flex-grow flex-col flex-justify-between flex-rigid w-100">
                  <div className="row m-xs-y-1 m-md-y-3">
                    <div className="col-xs-10 offset-xs-1 text-xs-center">
                      <h2>
                        <FormattedMessage id="pages.landing.recent.title" />
                      </h2>
                      <p>
                        <FormattedMessage id="pages.landing.recent.lead" />
                      </p>
                    </div>
                  </div>
                  <div className="row m-xs-b-1 m-md-b-3 p-xs-x-1 p-sm-x-0">
                    <div className="col-xs-12
                                col-sm-6
                                col-md-4
                                flex-row">
                      <CompletedGrabCard className="flex-grow" data={this.state.recentGrabs[0]}/>
                    </div>
                    <div className="hidden-xs-down
                                col-sm-6
                                col-md-4
                                flex-row">
                      <CompletedGrabCard className="flex-grow" data={this.state.recentGrabs[1]}/>
                    </div>
                    <div className="hidden-sm-down
                                col-md-4
                                flex-row">
                      <CompletedGrabCard className="flex-grow" data={this.state.recentGrabs[2]}/>
                    </div>
                  </div>
                  <div className="row p-xs-b-1 p-md-b-3">
                    <div className="col-xs-12
                                col-sm-8 offset-sm-2
                                col-md-4 offset-md-2">
                      <div className="p-xs-x-1 p-sm-x-0 m-xs-b-1 m-md-b-0">
                        <Link to="/grabs/new" className="btn btn-block btn-primary" onClick={() => {
                          mixpanelClickLandingStartOrderRecentlyCompletedGrabs();
                        }}>
                          <FormattedMessage id="pages.landing.recent.actions.0" />
                        </Link>
                      </div>
                    </div>
                    <div className="col-xs-12
                                col-sm-8 offset-sm-2
                                col-md-4 offset-md-0">
                      <div className="p-xs-x-1 p-sm-x-0">
                        <Link to="/travel" className="btn btn-block btn-outline" onClick={() => {
                          mixpanelClickLandingDeliverOrderRecentlyCompletedGrabs();
                        }}>
                          <FormattedMessage id="pages.landing.recent.actions.1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <a name="traveler" className="landing__become-traveller"/>
              <section className="landing__section landing__section--footer-banner flex-col flex-justify-center">
                <div className="container w-100 p-y-1">
                  <div className="row m-xs-b-3">
                    <div className="col-xs-12
                                col-md-8 offset-md-2
                                col-lg-6 offset-lg-3">
                      <h2 className="text-xs-center p-x-1">
                        <FormattedMessage id="pages.landing.outro.title" />
                      </h2>
                    </div>
                  </div>
                  <div className="row m-xs-b-1">
                    <div className="col-xs-12
                                col-sm-8 offset-sm-2
                                col-md-4 offset-md-4">
                      <div className="p-xs-x-1 p-sm-x-0">
                        <button className="btn btn-block btn--facebook" onClick={() => {
                          this.context.executeAction(loginFacebook);
                        }}>
                          <FacebookSquareIcon className="m-r-1"/>
                          <FormattedMessage id="pages.landing.outro.actions.0" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12
                                col-sm-8 offset-sm-2
                                col-md-4 offset-md-4">
                      <div className="p-xs-x-1 p-sm-x-0">
                        <Link to="/signup" className="btn btn-block btn-primary">
                          <FormattedMessage id="pages.landing.outro.actions.1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </main>
            <Footer/>
          </div>
        </Body>
      </Page>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/landing/LandingPage.js