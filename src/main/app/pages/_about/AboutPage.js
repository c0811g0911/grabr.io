import React from 'react';
import {AppStore} from '../../stores/AppStore';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {Alerts} from '../../components/_alerts/Alerts';
import './_about.scss';

import headerImageUrl from './images/AboutUs_Image.png';
import artemImageUrl from './images/artem.jpg';
import dariaImageUrl from './images/daria.jpg';
import moscowImageUrl from './images/Icon_Moscow.svg';
import sanFraciscoImageUrl from './images/Icon_SanFrancisco.svg';
import globeImageUrl from './images/globe.svg';
import pinImageUrl from './images/pin.svg';
import planeImageUrl from './images/plane.svg';
import {trackPageView} from '../../utils/trackPageView';

const {func, object} = React.PropTypes;

export class AboutPage extends React.Component {
  static displayName = 'AboutPage';

  static contextTypes = {
    getStore: func.isRequired,
    intl: object.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: '/about'});
  }

  renderFounder(founder) {
    return <article className="founder">
      <section className="photo">
        <img src={founder.imageUrl}/>
      </section>
      <section className="info">
        <h3><FormattedMessage id={`pages.about.team.${ founder.key }.name`}/></h3>
        <h4><FormattedMessage id={`pages.about.team.${ founder.key }.position`}/></h4>
        <ul>
          <li>
            <img src={globeImageUrl}/>
            <strong><FormattedMessage id="pages.about.team.countries"/></strong>&nbsp;{founder.countries}
          </li>
          <li>
            <img src={pinImageUrl}/>
            <strong><FormattedMessage id={`pages.about.team.${ founder.key }.cities`}/></strong>&nbsp;{founder.cities}
          </li>
          <li>
            <img src={planeImageUrl}/>
            <strong><FormattedMessage id="pages.about.team.miles"/></strong>&nbsp;{founder.miles}
          </li>
        </ul>
      </section>
    </article>;
  }

  render() {
    return (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.about.document_title'})}
          </title>
        </Head>
        <Body>
          <div>
            <NavigationBar/>
            <div className="container-fluid w-100 m-md-b-3 m-md-t-3 m-t-2">
              <h1 className="text-center font-size-xl m-b-2">
                <FormattedMessage id="pages.about.page_header"/>
              </h1>
              <div className="row">
                <div className="col-xs-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2
                                    panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0 p-t-3"
                >
                  <div className="static-content about-page">
                    <h2 className="text-center"><FormattedMessage id="pages.about.idea.title"/></h2>
                    {(locale => {
                      // fixme: provide appropriate `ru` translation!
                      switch (locale) {
                        case 'ru':
                          return [<p><FormattedMessage id="pages.about.idea.text"/></p>];
                        case 'en':
                          return [
                            <p key="1"><FormattedMessage id="pages.about.idea.text_1"/></p>,
                            <p key="2"><FormattedMessage id="pages.about.idea.text_2"/></p>,
                            <p key="3"><FormattedMessage id="pages.about.idea.text_3"/></p>,
                            <p key="4"><FormattedMessage id="pages.about.idea.text_4"/></p>
                          ];
                      }
                    })(this.context.getStore(AppStore).getState().language)}
                    <div className="image"><img src={headerImageUrl}/></div>
                    <h2 className="text-center"><FormattedMessage id="pages.about.mission.title"/></h2>
                    <p><FormattedMessage id="pages.about.mission.text_1"/></p>
                    <p><FormattedMessage id="pages.about.mission.text_2"/></p>
                    <h2 className="text-center"><FormattedMessage id="pages.about.team.title"/></h2>
                    <p><FormattedHTMLMessage id="pages.about.team.text"/></p>
                    <section className="founders">
                      {this.renderFounder({
                        key: 'daria',
                        imageUrl: dariaImageUrl,
                        countries: 76,
                        cities: 7,
                        miles: '1,000,000'
                      })}
                      {this.renderFounder({
                        key: 'artem',
                        imageUrl: artemImageUrl,
                        countries: 54,
                        cities: 5,
                        miles: '445,000'
                      })}
                    </section>
                    <section className="teammates">
                      <h3><FormattedMessage id="pages.about.team.teammates"/></h3>
                      <p><FormattedMessage id="pages.about.team.include"/></p>
                    </section>
                    <div className="offices">
                      <div className="office">
                        <div className="image"><img src={sanFraciscoImageUrl}/></div>
                        <FormattedMessage id="pages.about.contacts.address.usa"/>
                      </div>
                      <div className="office">
                        <div className="image"><img src={moscowImageUrl}/></div>
                        <FormattedMessage id="pages.about.contacts.address.moscow"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer/>
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }

}



// WEBPACK FOOTER //
// ./src/main/app/pages/_about/AboutPage.js