const premiumURLs = [
  'https://medium.com/*',
  'https://towardsdatascience.com/*',
  'https://hackernoon.com/*',
  'https://medium.freecodecamp.org/*',
  'https://psiloveyou.xyz/*',
  'https://betterhumans.coach.me/*',
  'https://codeburst.io/*',
  'https://theascent.pub/*',
  'https://*.medium.com/*',
  'https://medium./*',
  'https://uxdesign.cc/*',
  'https://levelup.gitconnected.com/*',
  'https://itnext.io/*',
  'https://entrepreneurshandbook.co/*',
  'https://proandroiddev.com/*',
  'https://blog.prototypr.io/*',
  'https://thebolditalic.com/*',
  'https://blog.usejournal.com/*',
  'https://blog.angularindepth.com/*',
  'https://blog.bitsrc.io/*',
  'https://blog.devartis.com/*',
  'https://blog.maddevs.io/*',
  'https://blog.getambassador.io/*',
  'https://uxplanet.org/*',
  'https://instagram-engineering.com/*',
  'https://calia.me/*',
  'https://productcoalition.com/*',
  'https://engineering.opsgenie.com/*',
  'https://android.jlelse.eu/*',
  'https://robinhood.engineering/*',
  'https://blog.hipolabs.com/*',
  'https://ux.shopify.com/*',
  'https://onezero.medium.com/*'
];

var menuItem={
  "id":"free",
  "title":"Free This Article"
};
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create(menuItem);
    
});


function getRandomString(length) {

  allowedChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var randomStr = ''
  for (var i = 0; i < length; i++) {

    randomStr += allowedChars[Math.floor(Math.random() * allowedChars.length)]

  }

  return randomStr

}

function removeReferrer(headers) {
  return headers.filter(({ name }) => name.toLowerCase() != "referer");
}

function addTwitterReferrer(headers, name, value) {
  headers.push({ name, value });
  return headers;
}
chrome.webRequest.onBeforeSendHeaders.addListener(

  function (details) {

    if (details.requestHeaders) {
      var newHeaders = removeReferrer(details.requestHeaders);
      newHeaders = addTwitterReferrer(newHeaders, 'Referer', "https://t.co/$" + getRandomString(12));

      return { requestHeaders: newHeaders };
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: premiumURLs, },
  ['blocking', 'requestHeaders', 'extraHeaders']
);

function func(tabUrl,uidVal) {
  var url= tabUrl
  var details = { 'url': url, 'value':uidVal , 'name': 'uid' }
  chrome.cookies.set(details, function (cookie) {

  })
}

function getUserId(tabURL){

  var details = { 'url': tabURL, 'name': 'uid' }
  chrome.cookies.get(details,function(cookie){

    return cookie.value
  })
  
}
var tabUrL='';
chrome.contextMenus.onClicked.addListener(function(clickedData,tab){

  try {
    if(clickedData.menuItemId == "free"){
      tabUrL=tab.url;
      if("lo_".indexOf(tab.url)>=0){
        chrome.storage.sync.set({"actual_uid":getUserId(tab.url)})
      }
      func(tab.url,"lo_" + getRandomString(12));
      sendMsgToEnableButton();
      chrome.tabs.reload()
    }
  } catch (error) {
    
  }
  

})

function uid_spoof(){

  chrome.storage.sync.get('actual_uid',function(object){
      
    if(object.actual_uid && tabUrL!=''){
        func(tabUrL,object.actual_uid)
    }
  })
}
  sendMsgToDisbleButton();
function sendMsgToEnableButton(){
  chrome.storage.sync.set({"resetLoginDisabled":false})
  // chrome.runtime.sendMessage({"todo":"enableButton"})
}
function sendMsgToDisbleButton(){
  chrome.storage.sync.set({"resetLoginDisabled":true})
  // chrome.runtime.sendMessage({"todo":"disableButton"})
}
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){

  try {
    if(request.todo=="fillUserId"){
      uid_spoof();
      chrome.tabs.reload()
      sendMsgToDisbleButton();
    }  
  } catch (error) {
    
  }
    
})