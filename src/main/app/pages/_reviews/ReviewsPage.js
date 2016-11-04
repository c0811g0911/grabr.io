import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Rating} from '../../components/_rating/Rating';
import {Row} from '../../components/_row/Row';
import {UserPreview} from '../../components/_user-preview/UserPreview';
import {FormattedMessage} from 'react-intl';
import {UserStore, ReviewStore} from '../../stores/DataStores';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {loadUserReviews} from '../../actions/UserActionCreators';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';
import {UserReviewsStore} from '../../stores/SequenceStores';

const {func, object} = React.PropTypes;

export const ReviewsPage = connectToStores(class extends React.Component {
  static displayName = 'ReviewsPage';

  static propTypes = {
    params: object.isRequired,
    user: object.isRequired
  };

  static contextTypes = {
    getStore: func.isRequired,
    executeAction: func.isRequired,
    routingProps: object
  };

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    const {id, type} = this.props.params;

    if (!this.context.getStore(UserReviewsStore).isLoaded()) {
      this.context.executeAction(loadUserReviews, {id, type});
    }
  }

  componentDidMount() {
    const {id, type} = this.props.params;
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/users/${id}/reviews/${type}`});
  }

  componentWillUnmount() {
    this.context.executeAction(context => {
      context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: UserReviewsStore.sequenceName})
    });
  }

  renderReviews() {
    const {areReviewsLoaded, reviews} = this.props;

    if (!areReviewsLoaded) {
      return null;
    }

    if (reviews && reviews.length > 0) {
      return reviews.map(review => {
        return <Row key={review.get('id')}>
          <div className="grabr-review">
            <UserPreview user={review.get('reviewer')}/>
            <p>{review.get('comment')}</p>
            <Rating value={review.get('rating')}/>
          </div>
        </Row>;
      });
    } else {
      return <div className="grabr-placeholder">
        <FormattedMessage id="pages.reviews.placeholder"/>
      </div>;
    }
  }

  render() {
    const {user, params: {type}} = this.props;
    const reviewType = type === 'traveler' ? 'grabber' : type;

    return (
      <Page>
        <Head>
          <title>{user.getFullName()}</title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="container-fluid flex-grow w-100 m-md-b-3 m-t-2">
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2
                                        panel panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
                >
                  <div className="grabr-profile">
                    <UserPreview user={user} onlyAvatar={true}/>
                    <h1>{user.get('first_name')} {user.get('last_name')}</h1>
                    <section className="reviews-page">
                      <header>
                        <h3><FormattedMessage id="pages.reviews.title"/></h3>
                        <Rating count={user.get(reviewType + '_rating_count')} value={user.get(reviewType + '_rating')}/>
                      </header>
                      <ul>
                        {this.renderReviews()}
                      </ul>
                    </section>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }

}, [UserReviewsStore, ReviewStore, UserStore], ({getStore}, {params: {id}}) => {
  return {
    user: getStore(UserStore).get(id),
    reviews: getStore(UserReviewsStore).get(),
    areReviewsLoaded: getStore(UserReviewsStore).isLoaded()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_reviews/ReviewsPage.js