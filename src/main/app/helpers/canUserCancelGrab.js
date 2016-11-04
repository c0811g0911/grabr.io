export const canUserCancelGrab = ({grab, user}) => grab.consumer.id === user.id && grab.isPending;



// WEBPACK FOOTER //
// ./src/main/app/helpers/canUserCancelGrab.js