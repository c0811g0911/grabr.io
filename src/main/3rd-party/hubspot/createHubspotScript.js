export function createHubspotScript(hubspotId) {
  return `!function(e,t,a,n){if(!e.getElementById(a)){var s=e.createElement(t),c=e.getElementsByTagName(t)[0];s.id=a,s.src="//js.hs-analytics.net/analytics/"+Math.ceil(new Date/n)*n+"/${hubspotId}.js",c.parentNode.insertBefore(s,c)}}(document,"script","hs-analytics",3e5);`;
}



// WEBPACK FOOTER //
// ./src/main/3rd-party/hubspot/createHubspotScript.js