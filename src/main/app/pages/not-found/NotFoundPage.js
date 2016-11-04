import React from 'react';
import {Body, Head, Page} from '../../Page';
import {Footer} from '../../components/footer/Footer';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router/es6';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Picture} from '../../components/picture/Picture';
import './_not-found.scss';
import notFoundImage from '../../../images/png/error-4xx.png';
import {Alerts} from '../../components/_alerts/Alerts';
import {setStatusCode} from '../../actions/AppActionCreators';
import {HttpStatusCode} from '../../network/api/HttpStatusCode';

const {object, func} = React.PropTypes;

export class NotFoundPage extends React.Component {
  static displayName = 'NotFoundPage';

  static contextTypes = {
    router: object,
    executeAction: func
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.stopListening = this.context.router.listen(() => {
      this.context.executeAction(setStatusCode, {statusCode: HttpStatusCode.OK});
    });
  }

  componentWillUnmount() {
    this.stopListening();
  }

  render() {
    return <Page>
      <Head/>
      <Body>
      <div className="min-h-100 flex-col">
        <NavigationBar/>
        <div className="not-found flex-grow flex-col flex-justify-center m-b-2">
          <div className="container">
            <div className="row flex-justify-center">
              <div className="not-found__image w-100 m-t-3 m-b-1">
                <Picture model={{src: notFoundImage}}/>
              </div>
            </div>
            <div className="text-center">
              <h1 className="font-bold text-cyan">
                <FormattedMessage id="pages.not-found.title"/>
              </h1>
            </div>
            <div className="text-center">
              <p className="m-b-0 font-size-lg text-gray">
                <FormattedMessage id="pages.not-found.problem"/>
              </p>
            </div>
            <div className="text-center">
              <p className="m-b-0 font-size-lg text-gray">
                <FormattedMessage id="pages.not-found.solution"/>
              </p>
            </div>
            <div className="text-center">
              <p className="font-size-lg text-gray">
                <FormattedMessage id="pages.not-found.error-code"/>
              </p>
            </div>
            <div className="text-center">
              <p className="not-found__return-home font-size-lg font-bold text-dark-gray">
                <Link to="/">
                  <FormattedMessage id="pages.not-found.return-home"/>
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer/>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/not-found/NotFoundPage.js