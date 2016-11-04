export const canUserMakeOffer = ({grab, user}) => grab.consumer.id !== user.id && grab.isPending && !grab.hasMyOffer;



// WEBPACK FOOTER //
// ./src/main/app/helpers/canUserMakeOffer.js