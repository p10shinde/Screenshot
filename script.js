// chrome.runtime.sendMessage({message: 'Hello'});

function getToolsElement(){
	var elTools = document.createElement('div');
	elTools.id = 'ss_tools';

	var toolList = document.createElement('ul');
	toolList.id = "toolList";
	var buttonList = ['fa-play-circle','fa-stop-circle', 'fa-camera', 'fa-file-word'];
	var buttonListClasses = ['far','far', 'fas', 'fas'];
	var buttonIds = ['startCapture','stopCapture', 'captureManually', 'exportToWord'];
	buttonList.forEach(function(className, index, arr){
		var _li = document.createElement('li');
		var _i = document.createElement('i');
		var _a = document.createElement('a');

		_a.href="javascript:void(0);";
		_a.id=buttonIds[index];
		_i.classList.add(buttonListClasses[index]);
		_i.classList.add(className);
		_a.appendChild(_i);
		_li.appendChild(_a);
		toolList.appendChild(_li);
	})
	elTools.appendChild(toolList);
	return elTools
}

function getImagesElement(){
	 var elImages = document.createElement('div');
	 elImages.classList.add('ss_images');
	 return elImages;
}

function addListeners(){
	document.getElementById("captureManually").addEventListener('click', function(event){
		document.querySelector('#ss_plugin_host_container').style.display = "none"
        document.querySelector('#ss_tools').style.display = "none"
        setTimeout(function(){
			chrome.runtime.sendMessage({action: 'captureManually'});
        },10);
	});

	document.getElementById("startCapture").addEventListener('click', function(event){
		chrome.storage.local.set({images : []}, function (dt) {
			if(document.querySelector('a#startCapture i').classList.contains('far')){
				document.querySelector('a#startCapture i').classList = '';
				document.querySelector('a#startCapture i').classList.add('fas');
				document.querySelector('a#startCapture i').classList.add('fa-pause');
			}else{
				document.querySelector('a#startCapture i').classList = '';
				document.querySelector('a#startCapture i').classList.add('far');
				document.querySelector('a#startCapture i').classList.add('fa-play-circle');
			}
	        console.log("Store created");
	        deleteImageNodes();
	        loadPreviousImages()
	    });
	});

	document.getElementById("stopCapture").addEventListener('click', function(event){
		chrome.storage.local.set({images : []}, function (dt) {
			document.querySelector('a#startCapture i').classList = '';
			document.querySelector('a#startCapture i').classList.add('far');
			document.querySelector('a#startCapture i').classList.add('fa-play-circle');
	        console.log("Store reinitialised");
	        deleteImageNodes();
	        loadPreviousImages();
	    });
	});
}

function deleteImageNodes(){
	var imagesList = document.querySelector("#ss_plugin_host_container .ss_images");
	while (imagesList.firstChild) {
	    imagesList.removeChild(imagesList.firstChild);
	}
}

function loadPreviousImages(){

	chrome.storage.local.get('images', function(result) {
		console.log(result);
		result.images.forEach(function(img, index, arr){
			var imgDiv = document.createElement('div');imgDiv.classList.add('ss_img_div');
    		var imgTag = document.createElement('img');imgTag.src=img.data;
    		imgDiv.appendChild(imgTag.cloneNode(true));
    		document.querySelector('#ss_plugin_host_container .ss_images').appendChild(imgDiv.cloneNode(true))
		})
    });

}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action == "toggle_extension"){
    	if(document.querySelectorAll('#ss_plugin_host_container').length == 0){
	        var ss_plugin_host_container = document.createElement('div');
	        ss_plugin_host_container.id='ss_plugin_host_container';

	        ss_plugin_host_container.appendChild(getImagesElement());
	        document.body.appendChild(getToolsElement());

	        document.body.appendChild(ss_plugin_host_container);

	        addListeners();

	        loadPreviousImages();
	    }
	    if(request.status === 'on'){
	        document.querySelector('#ss_plugin_host_container').style.display = "block"
	        document.querySelector('#ss_tools').style.display = "block"
	    }else{
	        document.querySelector('#ss_plugin_host_container').style.display = "none"
	        document.querySelector('#ss_tools').style.display = "none"
	    }
	    sendResponse({response: "toggled"});
    }else if(request.action == "captureManuallyResponse"){
    	document.querySelector('#ss_plugin_host_container').style.display = "block"
        document.querySelector('#ss_tools').style.display = "block"
    	var imgDiv = document.createElement('div');imgDiv.classList.add('ss_img_div');
    	var imgTag = document.createElement('img');imgTag.src=request.data;
    	imgDiv.appendChild(imgTag.cloneNode(true));
    	document.querySelector('#ss_plugin_host_container .ss_images').appendChild(imgDiv.cloneNode(true))
    	chrome.storage.local.get('images', function(result) {
    		console.log(result);
    		result.images.push({data: request.data});
	    	chrome.storage.local.set(result, function (dt) {
		        console.log("Image stored");
		        console.log(dt);
		    });
        });
     	sendResponse({response: "screenshot success"});

    }else if(request.action == "add_dom"){
    	if(document.querySelector("#ss_font_awesome") == null){
	        var link = document.createElement('link');
	        link.rel = "stylesheet"
	        link.id="ss_font_awesome"
	        link.href = "https://use.fontawesome.com/releases/v5.7.2/css/all.css"
	        link.integritiy = "sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
	        link.crossOrigin = "anonymous"
	        document.head.appendChild(link)


	        var link1 = document.createElement('script');var link2 = document.createElement('script');var link3 = document.createElement('script');
        	link1.src=chrome.runtime.getURL('jquery.min.js');link2.src=chrome.runtime.getURL('FileSaver.js');link3.src=chrome.runtime.getURL('jquery.wordexport.js');
        	document.head.appendChild(link1);
        	setTimeout(function(){
        		document.head.appendChild(link2);
        		setTimeout(function(){
        			document.head.appendChild(link3);
        		},1000)
        	},1000);
	    }
	    sendResponse({response: "added dom"});
    }else if(request.action = 'hidePluginTemp'){
    	document.querySelector('#ss_plugin_host_container').style.display = "none"
        document.querySelector('#ss_tools').style.display = "none"
	    sendResponse({response: "Plugin hid"});

    }
  }
);