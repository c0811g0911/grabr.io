import {SequenceStore} from './SequenceStore';

export class AdminBannerListStore extends SequenceStore {
  static storeName = 'AdminBannerListStore';
  static sequenceName = 'ADMIN_BANNER_LIST';
  static type = 'banner';
  static handlers = {};
}

export class AdminCollectionListStore extends SequenceStore {
  static storeName = 'AdminCollectionListStore';
  static sequenceName = 'ADMIN_COLLECTION_LIST';
  static type = 'collection';
  static handlers = {};
}

export class AdminCollectionSuggestionListStore extends SequenceStore {
  static storeName = 'AdminCollectionSuggestionListStore';
  static sequenceName = 'ADMIN_COLLECTION_SUGGESTION_LIST';
  static type = 'collection';
  static handlers = {};
}

export class AdminGrabListStore extends SequenceStore {
  static storeName = 'AdminGrabListStore';
  static sequenceName = 'ADMIN_GRAB_LIST';
  static type = 'grab';
  static handlers = {};
}

export class AdminItemListStore extends SequenceStore {
  static storeName = 'AdminItemListStore';
  static sequenceName = 'ADMIN_ITEM_LIST';
  static type = 'item';
  static handlers = {};
}

export class AdminPromotionListActiveStore extends SequenceStore {
  static storeName = 'AdminPromotionListActiveStore';
  static sequenceName = 'ADMIN_PROMOTION_LIST_ACTIVE';
  static type = 'promotion';
  static handlers = {};
}

export class AdminPromotionListExpiredStore extends SequenceStore {
  static storeName = 'AdminPromotionListExpiredStore';
  static sequenceName = 'ADMIN_PROMOTION_LIST_EXPIRED';
  static type = 'promotion';
  static handlers = {};
}

export class AdminPromotionListStore extends SequenceStore {
  static storeName = 'AdminPromotionListStore';
  static sequenceName = 'ADMIN_PROMOTION_LIST';
  static type = 'promotion';
  static handlers = {};
}

export class AdminTagListStore extends SequenceStore {
  static storeName = 'AdminTagListStore';
  static sequenceName = 'ADMIN_TAG_LIST';
  static type = 'tag';
  static handlers = {};
}

export class AdminTagSuggestionListStore extends SequenceStore {
  static storeName = 'AdminTagSuggestionListStore';
  static sequenceName = 'ADMIN_TAG_SUGGESTION_LIST';
  static type = 'tag';
  static handlers = {};
}

export class AdminUserListStore extends SequenceStore {
  static storeName = 'AdminUserListStore';
  static sequenceName = 'ADMIN_USER_LIST';
  static type = 'user';
  static handlers = {};
}

export class AdminUserSuggestionListStore extends SequenceStore {
  static storeName = 'AdminUserSuggestionListStore';
  static sequenceName = 'ADMIN_USER_SUGGESTION_LIST';
  static type = 'user';
  static handlers = {};
}

export const adminSequenceStores = [
  AdminBannerListStore,
  AdminCollectionListStore,
  AdminCollectionSuggestionListStore,
  AdminGrabListStore,
  AdminItemListStore,
  AdminPromotionListActiveStore,
  AdminPromotionListExpiredStore,
  AdminPromotionListStore,
  AdminTagListStore,
  AdminTagSuggestionListStore,
  AdminUserListStore,
  AdminUserSuggestionListStore
];



// WEBPACK FOOTER //
// ./src/main/app/stores/AdminSequenceStores.js