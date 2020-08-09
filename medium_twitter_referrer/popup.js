function getRandomString(length) {

    allowedChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var randomStr = ''
    for (var i = 0; i < length; i++) {

        randomStr += allowedChars[Math.floor(Math.random() * allowedChars.length)]

    }

    return randomStr

}

document.getElementById("re_login").addEventListener("click",function(){

    chrome.runtime.sendMessage({todo:"fillUserId"})
})
    
chrome.storage.sync.get('resetLoginDisabled',function(object){
            document.getElementById("re_login").disabled=object.resetLoginDisabled;

})
