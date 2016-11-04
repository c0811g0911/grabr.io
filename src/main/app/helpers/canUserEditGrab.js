export const canUserEditGrab = ({grab, user}) => grab.consumer.id === user.id && (grab.isPending || grab.isDraft);



// WEBPACK FOOTER //
// ./src/main/app/helpers/canUserEditGrab.js