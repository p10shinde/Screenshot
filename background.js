function takeit(){
    
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
        // You can add that image HTML5 canvas, or Element.
        return image;
        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        //     chrome.tabs.sendMessage(tabs[0].id, {action: "add_ss", data: image}, function(response) {});  
        //     // console.log(image)
        // });
        
    });
}

chrome.runtime.onMessage.addListener(function(request, sender) {
    if(request.action == "captureManually"){
        captureAndSend();
    }
});


function captureAndSend(){
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "captureManuallyResponse", status: status, data: image}, function(response) {});  
        });
    });
}

function hidePluginTemp(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "hidePluginTemp"}, function(response) {});
    });
}


var toggle = false;
var status = 'off';
var the_tab_id = '';

function set_status() {
    toggle = !toggle;
    status = 'off';
    if(toggle) { status = 'on'; }
}

function toggle_extension(tab){
    // alert('toggle ' + status + ' for ' + tab.id)
    // Set icon
    chrome.browserAction.setIcon({  path : "icons/icon_"+status+"-19.png", tabId:tab.id });
    // Pass variable & execute script
    // chrome.tabs.executeScript({ code: 'var extension_status = "'+status+'"' });
    // chrome.tabs.executeScript({ file: 'inject.js' });
    // Set the tab id
    the_tab_id = tab.id;
    // chrome.tabs.captureVisibleTab(null, {}, function (image) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "toggle_extension", status: status, data: ''}, function(response) {});  
        });
    // });
    
}

function addDom(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "add_dom"}, function(response) {});  
    });
}

function my_listener(tabId, changeInfo, tab) {
    // If updated tab matches this one
    if (changeInfo.status == "complete"){
        if (status == 'on') {
            toggle_extension(tab);
            addDom();
            hidePluginTemp();
            setTimeout(function(){
                captureAndSend();
            },50);
        }
    }
}

chrome.browserAction.onClicked.addListener(function(tab) {
    set_status();
    toggle_extension(tab);
    addDom();
    
});

chrome.tabs.onUpdated.addListener(my_listener);