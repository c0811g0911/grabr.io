import {SequenceStore} from './SequenceStore';

export class AllCities extends SequenceStore {
  static storeName = 'AllCitiesStore';
  static sequenceName = 'ALL_CITIES';
  static type = 'city';
  static handlers = {};
}

export class AllCountriesStore extends SequenceStore {
  static storeName = 'AllCountriesStore';
  static sequenceName = 'ALL_COUNTRIES';
  static type = 'country';
  static handlers = {};
}

export class BannersStore extends SequenceStore {
  static storeName = 'BannersStore';
  static sequenceName = 'BANNERS';
  static type = 'banner';
  static handlers = {};
}

export class CollectionItemsStore extends SequenceStore {
  static storeName = 'CollectionItemsStore';
  static sequenceName = 'COLLECTION_ITEMS';
  static type = 'item';
  static handlers = {};
}

export class CollectionsPageStore extends SequenceStore {
  static storeName = 'CollectionsPageStore';
  static sequenceName = 'COLLECTIONS_PAGE';
  static type = 'collection';
  static handlers = {};
}

export class CollectionTagsStore extends SequenceStore {
  static storeName = 'CollectionTagsStore';
  static sequenceName = 'COLLECTION_TAGS';
  static type = 'tag';
  static handlers = {};
}

export class EditorsCollectionsStore extends SequenceStore {
  static storeName = 'EditorsCollectionsStore';
  static sequenceName = 'EDITORS_COLLECTIONS';
  static type = 'collection';
  static handlers = {};
}

export class FromCitySuggest extends SequenceStore {
  static storeName = 'FromCitySuggestStore';
  static sequenceName = 'FROM_CITY_SUGGEST';
  static type = 'city';
  static handlers = {};
}

export class GrabsWithMessagesStore extends SequenceStore {
  static storeName = 'GrabsWithMessagesStore';
  static sequenceName = 'GRABS_WITH_MESSAGES';
  static type = 'grab';
  static handlers = {};
}

export class ItemCategoriesStore extends SequenceStore {
  static storeName = 'ItemCategoriesStore';
  static sequenceName = 'ITEM_CATEGORIES';
  static type = 'category';
  static handlers = {};
}

export class MyActiveGrabsStore extends SequenceStore {
  static storeName = 'MyActiveGrabsStore';
  static sequenceName = 'MY_ACTIVE_GRABS';
  static type = 'grab';
  static handlers = {};
}

export class MyConversationListStore extends SequenceStore {
  static storeName = 'MyConversationListStore';
  static sequenceName = 'MY_CONVERSATION_LIST';
  static type = 'conversation';
  static handlers = {};
}

export class MyCouponsStore extends SequenceStore {
  static storeName = 'MyCouponsStore';
  static sequenceName = 'MY_COUPONS';
  static type = 'coupon';
  static handlers = {};
}

export class MyDraftGrabsStore extends SequenceStore {
  static storeName = 'MyDraftGrabsStore';
  static sequenceName = 'MY_DRAFT_GRABS';
  static type = 'grab';
  static handlers = {};
}

export class MyFinishedGrabsStore extends SequenceStore {
  static storeName = 'MyFinishedGrabsStore';
  static sequenceName = 'MY_FINISHED_GRABS';
  static type = 'grab';
  static handlers = {};
}

export class MyItinerarySubscriptionsStore extends SequenceStore {
  static storeName = 'MyItinerarySubscriptionsStore';
  static sequenceName = 'MY_ITINERARY_SUBSCRIPTIONS';
  static type = 'itinerary_subscription';
  static handlers = {};
}

export class MyNotificationsStore extends SequenceStore {
  static storeName = 'MyNotificationsStore';
  static sequenceName = 'MY_NOTIFICATIONS';
  static type = 'notification';
  static handlers = {};
}

export class MyPendingGrabsStore extends SequenceStore {
  static storeName = 'MyPendingGrabsStore';
  static sequenceName = 'MY_PENDING_GRABS';
  static type = 'grab';
  static handlers = {};
}

export class ParticipantStore extends SequenceStore {
  static storeName = 'ParticipantStore';
  static sequenceName = 'PARTICIPANT';
  static type = 'user';
  static handlers = {};
  static defaultValue = {};
}

export class PopularCities extends SequenceStore {
  static storeName = 'PopularCitiesStore';
  static sequenceName = 'POPULAR_CITIES';
  static type = 'city';
  static handlers = {};
}

export class PublishedGrabsStore extends SequenceStore {
  static storeName = 'PublishedGrabsStore';
  static sequenceName = 'PUBLISHED_GRABS';
  static type = 'grab';
  static handlers = {};
}

export class RecentGrabsStore extends SequenceStore {
  static storeName = 'RecentGrabsStore';
  static sequenceName = 'RECENT_GRABS';
  static type = 'grab';
  static handlers = {};
}

export class ReferralStore extends SequenceStore {
  static storeName = 'ReferralStore';
  static sequenceName = 'REFERRAL';
  static type = 'user';
  static handlers = {};
  static defaultValue = {};
}

export class RelatedGrabsStore extends SequenceStore {
  static storeName = 'RelatedGrabsStore';
  static sequenceName = 'RELATED_GRABS';
  static type = 'grab';
  static handlers = {};
}

export class ShopItemsStore extends SequenceStore {
  static storeName = 'ShopItemsStore';
  static sequenceName = 'SHOP_ITEMS';
  static type = 'item';
  static handlers = {};
}

export class ShopPageCuratedCollectionsStore extends SequenceStore {
  static storeName = 'ShopPageCuratedCollectionsStore';
  static sequenceName = 'SHOP_PAGE_CURATED_COLLECTIONS';
  static type = 'collection';
  static handlers = {};
}

export class ShopPageFeaturedCollectionsStore extends SequenceStore {
  static storeName = 'ShopPageFeaturedCollectionsStore';
  static sequenceName = 'SHOP_PAGE_FEATURED_COLLECTIONS';
  static type = 'collection';
  static handlers = {};
}

export class ShopPagePartnerCollectionsStore extends SequenceStore {
  static storeName = 'ShopPagePartnerCollectionsStore';
  static sequenceName = 'SHOP_PAGE_PARTNER_COLLECTIONS';
  static type = 'collection';
  static handlers = {};
}

export class SimilarItemsStore extends SequenceStore {
  static storeName = 'SimilarItemsStore';
  static sequenceName = 'SIMILAR_ITEMS';
  static type = 'item';
  static handlers = {};
}

export class ToCitySuggest extends SequenceStore {
  static storeName = 'ToCitySuggestStore';
  static sequenceName = 'TO_CITY_SUGGEST';
  static type = 'city';
  static handlers = {};
}

export class TopItemsStore extends SequenceStore {
  static storeName = 'TopItemsStore';
  static sequenceName = 'TOP_ITEMS';
  static type = 'item';
  static handlers = {};
}

export class TravelerCountriesStore extends SequenceStore {
  static storeName = 'TravelerCountriesStore';
  static sequenceName = 'TRAVELER_COUNTRIES';
  static type = 'country';
  static handlers = {};
}

export class TravelSpecificRouteRecentlyAddedGrabs extends SequenceStore {
  static storeName = 'TravelSpecificRouteRecentlyAddedGrabsStore';
  static sequenceName = 'TRAVEL_SPECIFIC_ROUTE_RECENTLY_ADDED_GRABS';
  static type = 'grab';
  static handlers = {};
}

export class UserReviewsStore extends SequenceStore {
  static storeName = 'UserReviewsStore';
  static sequenceName = 'USER_REVIEWS';
  static type = 'review';
  static handlers = {};
}

export const sequenceStores = [
  AllCities,
  AllCountriesStore,
  BannersStore,
  CollectionItemsStore,
  CollectionsPageStore,
  CollectionTagsStore,
  EditorsCollectionsStore,
  FromCitySuggest,
  GrabsWithMessagesStore,
  ItemCategoriesStore,
  MyActiveGrabsStore,
  MyConversationListStore,
  MyCouponsStore,
  MyDraftGrabsStore,
  MyFinishedGrabsStore,
  MyItinerarySubscriptionsStore,
  MyNotificationsStore,
  MyPendingGrabsStore,
  ParticipantStore,
  PopularCities,
  PublishedGrabsStore,
  RecentGrabsStore,
  ReferralStore,
  RelatedGrabsStore,
  ShopItemsStore,
  ShopPageCuratedCollectionsStore,
  ShopPageFeaturedCollectionsStore,
  ShopPagePartnerCollectionsStore,
  SimilarItemsStore,
  ToCitySuggest,
  TopItemsStore,
  TravelerCountriesStore,
  TravelSpecificRouteRecentlyAddedGrabs,
  UserReviewsStore
];



// WEBPACK FOOTER //
// ./src/main/app/stores/SequenceStores.js