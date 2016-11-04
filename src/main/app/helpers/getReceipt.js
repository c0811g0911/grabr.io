export const getReceipt = (offer, grab) => {
  return {
    consumer: {
      currency: offer.bidCurrency,
      itemPrice: grab.itemPrice * grab.quantity,
      bid: offer.bid,
      discount: offer.discount,
      applicationFee: offer.applicationFee,
      total: offer.total
    },
    grabber: {
      currency: offer.bid,
      itemPrice: grab.itemPrice * grab.quantity,
      bid: offer.bid,
      total: offer.itemsAndBid
    }
  };
};


// WEBPACK FOOTER //
// ./src/main/app/helpers/getReceipt.js