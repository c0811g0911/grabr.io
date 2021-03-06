export function createFacebookScript(facebookAppId) {
  return `window.fbAsyncInit = function() {
      FB.init({
        appId      : '${facebookAppId}',
        xfbml      : true,
        version    : 'v2.3'
      });
    };
  
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  `;
}



// WEBPACK FOOTER //
// ./src/main/3rd-party/facebook/createFacebookScript.js