import {CalendarIcon} from '../../../images/CalendarIcon';
import {ChevronLeftIcon} from '../../../images/ChevronLeftIcon';
import {ChevronRightIcon} from '../../../images/ChevronRightIcon';
import classNames from 'classnames';
import {CollectionTag} from '../../components/collection-tag/CollectionTag';
import {CollectionTagCard} from '../../components/collection-tag-card/CollectionTagCard';
import {connectToStores} from 'fluxible-addons-react';
import {FacebookSquareIcon} from '../../../images/FacebookSquareIcon';
import {GenericScrollBox} from 'react-scroll-box';
import {getImageUrl} from '../../utils/ImageUtils';
import {FormattedMessage} from 'react-intl';
import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {AppStore} from '../../stores/AppStore';
import {ItemCard} from '../../components/item-card/ItemCard';
import {Link} from 'react-router/es6';
import {Picture} from '../../components/picture/Picture';
import React from 'react';
import {renderDate} from '../../helpers/renderDate';
import {TwitterIcon} from '../../../images/TwitterIcon';
import URI from 'urijs';
import {CollectionItemsStore, CollectionTagsStore} from '../../stores/SequenceStores';
import {CollectionShape, shapeCollection} from '../../models/CollectionModel';
import {CollectionStore, TagStore} from '../../stores/DataStores';
import {ItemShape, shapeItem} from '../../models/ItemModel';
import {shapeTag, TagShape} from '../../models/TagModel';
import {uniq, without} from 'lodash/array';
import './_collection.scss';

const {arrayOf, func, object, number} = React.PropTypes;

function stringifyTagIds(tagIds) {
  return uniq(tagIds).sort(($1, $2) => $1 - $2).toString();
}

export const Collection = connectToStores(class extends React.Component {
  static displayName = 'Collection';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    collection: CollectionShape.isRequired,
    items: arrayOf(ItemShape).isRequired,
    tags: arrayOf(TagShape).isRequired,
    id: number.isRequired,
    paginator: object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showArrowLeft: false,
      showArrowRight: false
    };
  }

  componentDidMount() {
    this.onViewportScroll(this.refs.tagScrollBox);
  }

  onViewportScroll = scrollBox => {
    if (scrollBox.scrollX === 0) {
      this.setState({showArrowLeft: false});
    } else if (!this.state.showArrowLeft) {
      this.setState({showArrowLeft: true});
    }

    if (scrollBox.scrollX === scrollBox.scrollMaxX) {
      this.setState({showArrowRight: false});
    } else if (!this.state.showArrowRight) {
      this.setState({showArrowRight: true});
    }
  };

  onScrollPageLeft = () => {
    this.refs.tagScrollBox.scrollBy(-this.refs.tagScrollBox.viewport.offsetWidth, 0, 400);
  };

  onScrollPageRight = () => {
    this.refs.tagScrollBox.scrollBy(this.refs.tagScrollBox.viewport.offsetWidth, 0, 400);
  };


  render() {
    const {getStore} = this.context;
    const {collection, id, items, tagIds, tags, paginator} = this.props;
    const {description = {}, images: [topImage = {}, bgImage = {}], partnership, title = {}} = collection;

    const tagStore = getStore(TagStore);
    const appStore = getStore(AppStore);

    const tagCardsBlock = <div>
      {tags.filter(tag => tagIds.indexOf(tag.id) === -1)
           .map((tag, key) => <div key={key} className="d-inline-block v-align-top m-r-2">
             <Link className="d-block link-undecorated flex-rigid" to={URI.expand('/collections{/id}{?tagIds}', {
               id, tagIds: stringifyTagIds([tag.id, ...tagIds])
             }).href()}>
               <CollectionTagCard tag={tag}/>
             </Link>
           </div>)}
    </div>;

    let partnershipExpirationBlock;
    let partnershipMainSiteBlock;
    let partnershipFacebookBlock;
    let partnershipTwitterBlock;

    const {expiration, partner} = partnership;
    if (partner) {
      if (partner.links.site) {
        partnershipMainSiteBlock = <a href={partner.links.site} className="collection__banner-social">
          {new URI(partner.links.site).hostname()}
        </a>;
      }
      if (partner.links.facebook) {
        partnershipFacebookBlock = <a href={partner.links.facebook} className="collection__banner-social">
          <FacebookSquareIcon />
        </a>;
      }
      if (partner.links.twitter) {
        partnershipTwitterBlock = <a href={partner.links.twitter} className="collection__banner-social">
          <TwitterIcon />
        </a>;
      }
    }
    if (expiration) {
      partnershipExpirationBlock =
        <div className="d-inline-block balloon bg-primary text-uppercase font-size-uppercase-xs m-b-3">
          <CalendarIcon className="m-r-1"/>
          Available until {renderDate(expiration.moment)}
        </div>;
    }

    return (
      <div className="collection m-b-3">

        <div className="collection__banner w-100 flex-row m-b-1">
          <Picture model={{src: getImageUrl(bgImage.url, {size: 'huge'})}} className="collection__banner-bg-picture"/>

          <div className="container w-100 flex-grow flex-row">
            <div className="row flex-grow w-100">
              <div className="flex-col p-t-3 p-b-1 w-100
                          col-xs-12
                          col-md-10 offset-md-1
                          col-lg-8 offset-lg-2">

                <div className="flex-grow flex-row flex-items-center flex-justify-center">
                  <div className="text-xs-center p-xs-x-1 p-sm-x-0">
                    <Picture model={{src: partner && partner.image ? partner.image.url : topImage.url}}
                             className="collection__banner-picture m-b-2"/>
                    <h1 className="m-b-1">
                      {appStore.getTranslation(title)}
                    </h1>
                    <p className="text-uppercase font-size-uppercase-xs">
                      <FormattedMessage id="pages.collection.items" values={{itemsCount: collection.items.count}}/>
                    </p>
                    <div className="flex-row flex-items-center flex-justify-center font-size-xs m-b-2">
                      {partnershipMainSiteBlock}
                      {partnershipFacebookBlock}
                      {partnershipTwitterBlock}
                    </div>
                    <p className="m-b-3 font-size-lg">
                      {appStore.getTranslation(description)}
                    </p>
                    {partnershipExpirationBlock}
                  </div>
                </div>

                <div className="flex-rigid w-100">
                  <div className="collection__banner-tag-list text-nowrap text-xs-center p-xs-x-1 p-sm-x-0">
                    {tagIds.map(tagId => shapeTag(tagStore.get(tagId))).map((tag, key) => {
                      const newTagIds = without(tagIds, tag.id);
                      const search = stringifyTagIds(newTagIds);
                      const removeHref = new URI(`/collections/${id}`).setSearch('tagIds', search).href();
                      return <div key={key} className="d-inline-block v-align-top">
                        <CollectionTag key={key} tag={tag} removeHref={removeHref} className="font-size-xs"/>
                      </div>;
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        <div className="container">

          <div className="d-block text-uppercase-header text-xs-center m-b-1 m-x-1">
            <FormattedMessage id="pages.collection.tags"/>
          </div>

          <div className="collection__tag-card-list-touch hidden-md-up text-nowrap text-xs-center m-b-1 p-xs-l-1 p-sm-l-0">
            {tagCardsBlock}
          </div>

          <div className="collection__tag-card-list hidden-sm-down text-nowrap text-xs-center m-b-1">
            <GenericScrollBox className="collection__tag-card-list-scroll-box scroll-box--wrapped"
                              ref="tagScrollBox"
                              propagateWheelScroll={true}
                              hideScrollBarX={true}
                              scrollableY={false}
                              onViewportScroll={this.onViewportScroll}>
              <div className="scroll-box__viewport">
                {tagCardsBlock}
              </div>
            </GenericScrollBox>
            <div className={classNames('collection__tag-card-list-chevron-left flex-row flex-items-center', {'hidden-xs-up': !this.state.showArrowLeft})}
                 onClick={this.onScrollPageLeft}>
              <ChevronLeftIcon />
            </div>
            <div className={classNames('collection__tag-card-list-chevron-right flex-row flex-items-center flex-justify-end', {'hidden-xs-up': !this.state.showArrowRight})}
                 onClick={this.onScrollPageRight}>
              <ChevronRightIcon />
            </div>
          </div>

          <InfiniteScroll wrapper="div"
                          hasMore={paginator.hasMore()}
                          isSyncing={paginator.isSyncing()}
                          onScroll={() => {
                            paginator.loadMore();
                          }}
                          moreButton={true}
                          count={items.length}>
            <section className="row p-x-1 p-sm-x-0">
              {items.map((item, key) => <div key={key} className="col-xs-6 col-md-4 col-lg-3 m-b-1">
                <ItemCard item={item}/>
              </div>)}
            </section>
          </InfiniteScroll>

        </div>
      </div>
    );
  }
}, [CollectionStore, CollectionItemsStore, CollectionTagsStore], ({getStore}, {id, tagIds}) => ({
  collection: shapeCollection(getStore(CollectionStore).get(id)),
  id: Number(id),
  items: getStore(CollectionItemsStore).get().map(shapeItem),
  tags: getStore(CollectionTagsStore).get().map(shapeTag)
}));



// WEBPACK FOOTER //
// ./src/main/app/pages/collection/Collection.js