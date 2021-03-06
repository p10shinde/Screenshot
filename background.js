chrome.runtime.onMessage.addListener(function(request, sender) {
    if(request.action == "captureManually"){
        captureAndSend();
    }else if(request.action == "capture_status"){
        status = request.data;
    }
});


function captureAndSend(){
    chrome.tabs.captureVisibleTab(null, {format:'jpeg',quality : 100}, function (image) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            for (var i=0; i<tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, {action: "captureManuallyResponse", status: status, data: image}, function(response) {});  
            }
        });
    });
}

function hidePluginTemp(){
    chrome.tabs.query({/*active: true, */currentWindow: true}, function(tabs){
        for (var i=0; i<tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {action: "hidePluginTemp"}, function(response) {});
        }
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
//    the_tab_id = tab.id;
    the_tab_id = tab.windowId;
    // chrome.tabs.captureVisibleTab(null, {}, function (image) {
        chrome.tabs.query({/*active: true,*/ currentWindow: true}, function(tabs){
            for (var i=0; i<tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, {action: "toggle_extension", status: status, data: ''}, function(response) {});  
            }
        });
    // });
    
}
function addDom(){
    chrome.tabs.query({/*active: true, */currentWindow: true}, function(tabs){
        for (var i=0; i<tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {action: "add_dom"}, function(response) {});  
        }
    });
}

function my_listener(tabId, changeInfo, tab) {
    // If updated tab matches this one
    if (changeInfo.status == "complete"){
        if (status == 'on' && tab.url.search('chrome://') != 0 && (the_tab_id == '' || the_tab_id == tab.windowId)) {
            toggle_extension(tab);
            addDom();
//            hidePluginTemp();
//            setTimeout(function(){
//                captureAndSend();
//            },50);
        }
    }
}

chrome.browserAction.onClicked.addListener(function(tab) {
    if(tab.title != "New Tab"){
        if(tab.status == "complete"){
            set_status();
            toggle_extension(tab);
            addDom();
        }else{
            alert('Please wait while page loads...')
        }
    }else{
        alert('Not Allowed');
    }
    
});

chrome.tabs.onUpdated.addListener(my_listener);

//listen for new tab to be activated
chrome.tabs.onActivated.addListener(function(activeInfo) {
    toggle_extension({id: activeInfo.tabId});
});

// chrome.windows.onRemoved(function(ext){console.log(ext)})