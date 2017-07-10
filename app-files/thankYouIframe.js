
var loadedConfig = {
	storeUrl: "",
	enabled: "",
	delay: ""
};

var initialConfig = {
	storeUrl: "",
	enabled: false,
	delay: 0
};

// For getting store information from Ecwid REST API
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


// Executes when we have a new user install the app. It creates and sets the default data using Ecwid JS SDK and Application storage
function createUserData() {

	var theUrl = 'https://app.ecwid.com/api/v3/' + storeId + '/profile?token=' + accessToken;

	var storeProfile = httpGet(theUrl);
	storeProfile = JSON.parse(storeProfile);

	initialConfig.storeUrl = storeProfile.generalInfo.storeUrl;
	initialConfig.enabled = false;
	initialConfig.delay = 0;


	var data = '{"storeUrl": "'+ initialConfig.storeUrl + '", "enabled": '+ initialConfig.enabled +', "delay":'+ initialConfig.delay +'}';

	EcwidApp.setAppPublicConfig(data, function(){
		console.log('Public config saved!');
	});

	document.getElementById('storeUrl').value = initialConfig.storeUrl;
	document.getElementById('delay').value = initialConfig.delay;
	document.getElementById('enabled').checked = initialConfig.enabled;
	document.querySelector("tr:nth-child(2)").style.visibility = 'hidden';

	// Setting flag to determine that we already created and saved defaults for this user
	var appExists = {
		exists: 'yes'
	};

	console.log(data);

	EcwidApp.setAppStorage(appExists, function(){
	  console.log('Data saved!');
	});

}




// Executes if we have a user who logs in to the app not the first time. We load their preferences from Application storage with Ecwid JS SDK and display them in the app iterface
function getUserData() {

	EcwidApp.getAppStorage('public', function(config){
		config = JSON.parse(config);

		loadedConfig.storeUrl = config.storeUrl;
		loadedConfig.enabled = config.enabled;
		loadedConfig.delay = config.delay;

		console.log(loadedConfig);
	});

	setTimeout(function(){

		document.getElementById('storeUrl').value = loadedConfig.storeUrl;
		document.getElementById('storeUrl').disabled = !loadedConfig.enabled;
		document.getElementById('delay').value = loadedConfig.delay;
		document.getElementById('enabled').checked = loadedConfig.enabled;

		if (loadedConfig.enabled) {
			document.querySelector("tr:nth-child(2)").style.visibility = 'visible';
		} else {
			document.querySelector("tr:nth-child(2)").style.visibility = 'hidden';
		}

	}, 1000);

}




// Executes when Save button is pressed. Gets all elements' values and saves them to Application storage via Ecwid JS SDK
function saveUserData() {

	var d = document.getElementById("save");
	d.className += " btn-loading";

	setTimeout(function(){
		d.className = "btn btn-primary btn-large";
	},500)

	var saveData = {
		storeUrl: loadedConfig.storeUrl,
		enabled: loadedConfig.enabled,
		delay: loadedConfig.delay
	}

	saveData.storeUrl = document.getElementById('storeUrl').value;
	saveData.enabled = document.getElementById('enabled').checked;
	saveData.delay = parseInt(document.getElementById('delay').value);

	if (isNaN(saveData.delay)) {
		saveData.delay = 0;
	}

	var dataToSave = '{"storeUrl": "'+ saveData.storeUrl + '", "enabled": '+ saveData.enabled +', "delay":'+ saveData.delay +'}';

	EcwidApp.setAppPublicConfig(dataToSave, function(){
		console.log('Public config saved!');
	});

}

// Main app function to determine if the user is new or just logs into the app
EcwidApp.getAppStorage('exists', function(value){

  if (value != null) {
  		getUserData();
  }
  else {
  		createUserData();
  }
})