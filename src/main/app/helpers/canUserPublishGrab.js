export const canUserPublishGrab = ({grab, user}) => grab.consumer.id === user.id && grab.isDraft;



// WEBPACK FOOTER //
// ./src/main/app/helpers/canUserPublishGrab.js