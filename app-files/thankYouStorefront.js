
// Get app public config value from Ecwid

var config = Ecwid.getAppPublicConfig('custom-thank-you');
config = JSON.parse(config);

//console.log(config);

// If the app is enabled in storefront

if(config.enabled == true) {

if (config.storeUrl.substring(0,7) == "http://" || config.storeUrl.substring(0,8) == "https://") {
	console.log("Link has a protocol");
}	else {
	console.log("Link does not have protocol specified. Fixing...");
	config.storeUrl = "//" + config.storeUrl;
}

Ecwid.OnPageLoaded.add(function(){
var confirmationPageURL = config.storeUrl;

if (
  typeof(Ecwid) == 'object'
  && typeof(Ecwid.OnPageLoad) == 'object'
) {
  Ecwid.OnPageLoad.add(function(page) {

// If Thank you page is opened, redirect customer to set URL in the app
    
    if (
      typeof(page) == 'object'
      && 'ORDER_CONFIRMATION' == page.type
    ) {
      setTimeout( 
      	function(){
      		window.top.location.href = confirmationPageURL;
      	}, config.delay);
    }
  });
}

})

} 