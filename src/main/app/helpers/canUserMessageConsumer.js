export const canUserMessageConsumer = ({grab, user}) => grab.consumer.id !== user.id && !user.isGuest;



// WEBPACK FOOTER //
// ./src/main/app/helpers/canUserMessageConsumer.js