// Get app public config value from Ecwid
var customThankYouConfig = Ecwid.getAppPublicConfig('custom-thank-you');
customThankYouConfig = JSON.parse(customThankYouConfig);
console.log(customThankYouConfig);

// If the app is enabled in storefront
if(customThankYouConfig.enabled == true) {

    if (customThankYouConfig.storeUrl.substring(0,7) == "http://" || customThankYouConfig.storeUrl.substring(0,8) == "https://") {
        console.log("Link has a protocol");
    }   else {
        console.log("Link does not have protocol specified. Fixing...");
        customThankYouConfig.storeUrl = "//" + customThankYouConfig.storeUrl;
    }

    if (
      typeof(Ecwid) == 'object'
      && typeof(Ecwid.OnPageLoad) == 'object'
    ) {
      Ecwid.OnPageLoad.add(function(page) {
        // If Thank you page is opened, redirect customer to set URL in the app
        if (
          typeof(page) == 'object'
          && (page.type == 'ORDER_CONFIRMATION' || page.type == 'CHECKOUT_RESULT') // if offline or online payment method was used
        ) {
          setTimeout( 
            function(){
                window.top.location.href = customThankYouConfig.storeUrl;
            }, customThankYouConfig.delay);
        }
      });
    }
}