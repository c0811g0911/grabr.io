export function createFacebookPixelScript(facebookPixelId) {
  return `!function(e,n,t,a,c,o,s){e.fbq||(c=e.fbq=function(){c.callMethod?c.callMethod.apply(c,arguments):c.queue.push(arguments)},e._fbq||(e._fbq=c),c.push=c,c.loaded=!0,c.version="2.0",c.queue=[],o=n.createElement(t),o.async=!0,o.src=a,s=n.getElementsByTagName(t)[0],s.parentNode.insertBefore(o,s))}(window,document,"script","//connect.facebook.net/en_US/fbevents.js"),fbq("init","${facebookPixelId}"),fbq("track","PageView");`;
}




// WEBPACK FOOTER //
// ./src/main/3rd-party/facebook/createFacebookPixelScript.js