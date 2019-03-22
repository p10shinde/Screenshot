// chrome.runtime.sendMessage({message: 'Hello'});
const resizeImageWidth = 770;
const resizeImageHeight = 475;


function resizedataURL(datas, wantedWidth, wantedHeight) {
    return new Promise(function(resolve, reject) {
        // We create an image to receive the Data URI
        var img = document.createElement('img');

        // When the event "onload" is triggered we can resize the image.
        img.onload = function()
        {        
            // We create a canvas and get its context.
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // We set the dimensions at the wanted size.
            canvas.width = wantedWidth;
            canvas.height = wantedHeight;

            // We resize the image with the canvas method drawImage();
            ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

            var dataURI = canvas.toDataURL();

            /////////////////////////////////////////
            // Use and treat your Data URI here !! //
            /////////////////////////////////////////
            // return dataURI;
            resolve(dataURI);
        };

        // We put the Data URI in the image's src attribute
        
            img.src = datas;


    });
}

// function b64toBlob(b64Data, contentType, sliceSize) {
//     contentType = contentType || '';
//     sliceSize = sliceSize || 512;
  
//     var byteCharacters = atob(b64Data);
//     var byteArrays = [];
  
//     for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//       var slice = byteCharacters.slice(offset, offset + sliceSize);
  
//       var byteNumbers = new Array(slice.length);
//       for (var i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }
  
//       var byteArray = new Uint8Array(byteNumbers);
  
//       byteArrays.push(byteArray);
//     }
  
//     var blob = new Blob(byteArrays, {type: contentType});
//     return blob;
//   }
  
// function resizedataURL(datas){
//     return new Promise(function(resolve, reject) {
//         var blob = new Compressor(b64toBlob(datas.split(",")[1],'image/png',512),{width: 770, height: 475, quality: 0.5});
//         var reader = new FileReader();
//         reader.readAsDataURL(blob.file); 
//         reader.onloadend = function() {
//             resolve(reader.result);
//         }
//     });
// }
        
chrome.storage.onChanged.addListener(function(changes, namespace) {
    var imges = changes['images']['newValue'];
    document.querySelector('.ss_loader').style.display = "block"
    deleteImageNodes();
    imges.forEach(function(img, index, arr){
        resizedataURL(img.data, resizeImageWidth, resizeImageHeight).then(function(res){
            var imgDiv = document.createElement('div');imgDiv.classList.add('ss_img_div');imgDiv.id=img.id;
            var imgIndex = document.createElement('div');imgIndex.classList.add('imgIndex');
            var imgIndexSpan = document.createElement('span');imgIndexSpan.innerText=index+1;
            var imgTag = document.createElement('img');//img.data;
            imgTag.src=res
            imgIndex.appendChild(imgIndexSpan.cloneNode(true));
            imgDiv.appendChild(imgIndex.cloneNode(true));
            imgDiv.appendChild(imgTag.cloneNode(true));
            document.querySelector('.ss_main_container .ss_images').appendChild(imgDiv.cloneNode(true))
            console.log(index);
            var objDiv = document.querySelectorAll(".ss_main_container .ss_images")[0];
            objDiv.scrollTop = objDiv.scrollHeight;
        })
        document.querySelector('.ss_main_container').style.display = "block"
        
    })
    document.querySelector('.ss_loader').style.display = "none"
    
});

function getToolsElement(){
	var elTools = document.createElement('div');
    elTools.classList.add('ss_tools');

	var toolList = document.createElement('ul');
	toolList.id = "toolList";
	var buttonList = [/*'fa-play-circle',*/'fa-trash-alt', 'fa-camera', 'fa-file-word', 'fa-minus-square', 'fa-question-circle'];
	var buttonListClasses = [/*'far',*/'far', 'fas', 'fas', 'far', 'far'];
    var buttonTooltips = [/*'',*/ 'Remove All', 'Capture (ALT+S)', 'Export', 'Remove (ALT+A)', 'ALT+S : Take Screenshot\nALT+A : Remove Selected Screenshot\n\nmail @ Pankaj Shinde (ps00475391@techmahindra.com)']
	var buttonIds = [/*'startCapture',*/'stopCapture', 'captureManually', 'exportToWord', 'removeSS', 'pluginHelp'];
	buttonList.forEach(function(className, index, arr){
		var _li = document.createElement('li');
		var _i = document.createElement('i');
		var _a = document.createElement('a');
        
        _li.id="li_" + buttonIds[index];

		_a.href="javascript:void(0);";
		_a.id=buttonIds[index];
		_i.classList.add(buttonListClasses[index]);
		_i.classList.add(className);
        _li.title = buttonTooltips[index];
        
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

function getHandler(){
    var handlerDiv = document.createElement('div');
    var handlerIcon = document.createElement('i');
    var handlerAnchor = document.createElement('a');
    handlerIcon.classList.add('fas');
    handlerIcon.classList.add('fa-arrow-right');
    handlerAnchor.href="javascript:void(0);";
    
    handlerDiv.classList.add("ss_handler");
    handlerDiv.title="Collapse Captur";
    handlerAnchor.appendChild(handlerIcon);
    handlerDiv.appendChild(handlerAnchor);
    return handlerDiv;
    
}

function getLoaderDiv(){
    var loaderDiv = document.createElement('div');
    var loaderIcon = document.createElement('i');
    loaderDiv.classList.add("ss_loader");
    loaderIcon.classList.add('fas');
    loaderIcon.classList.add('fa-spinner');
    loaderIcon.classList.add('fa-spin');
    loaderDiv.appendChild(loaderIcon);
    return loaderDiv;
}

function getImageId(){
    return Math.floor(Math.random()*9000000);
}

function removeSS(){
    var idToDelte = parseInt($(".ss_img_div.selected").attr('id'))
    document.querySelector('.ss_loader').style.display = "block"
        
    if(!_.isNaN(idToDelte)){
        deleteImageNodes();
        chrome.storage.local.get('images', function(result) {
            var fliteredImages = _.reject(result.images, function(el) { return el.id === idToDelte; });
            chrome.storage.local.set({images : fliteredImages}, function(){
                document.querySelector('.ss_loader').style.display = "none"
            });

        })
    }else{
        document.querySelector('.ss_loader').style.display = "none"
    }
}

function showPluginHelp(){
    
}

function addListeners(){
    function captureManually(){
        document.querySelector('.ss_main_container').style.display = "none"
        // document.querySelector('#handlerDiv').style.display = "none"
        document.querySelector('.ss_loader').style.display = "block"
        setTimeout(function(){
            document.querySelector('.ss_loader').style.display = "none"
            setTimeout(function(){
                chrome.runtime.sendMessage({action: 'captureManually'});
            },10);
        },200);
        
        
    }
    
    var map = {};
    document.addEventListener('keydown', function(event){
        console.log(event.keyCode);
        var e = e || event; // to deal with IE
        map[e.keyCode] = e.type == 'keydown';
        if(map[18] && map[83]){ // ALT+S
            captureManually();
            map = {};
        }
        if(map[18] && map[65]){ // ALT+A
            removeSS();
            map = {};
        }
    });
    
	document.getElementById("captureManually").addEventListener('click', function(event){
		captureManually();
	});

//	document.getElementById("startCapture").addEventListener('click', function(event){
//		chrome.storage.local.set({images : []}, function (dt) {
//			if(document.querySelector('a#startCapture i').classList.contains('far')){
//				document.querySelector('a#startCapture i').classList = '';
//				document.querySelector('a#startCapture i').classList.add('fas');
//				document.querySelector('a#startCapture i').classList.add('fa-pause');
//                chrome.runtime.sendMessage({action: 'capture_status', data: 'on'});
//                //started
//			}else{
//				document.querySelector('a#startCapture i').classList = '';
//				document.querySelector('a#startCapture i').classList.add('far');
//				document.querySelector('a#startCapture i').classList.add('fa-play-circle');
//                chrome.runtime.sendMessage({action: 'capture_status', data: 'paused'});
//                //paused
//			}
//	        console.log("Store created");
//	        deleteImageNodes();
//	        loadPreviousImages()
//	    });
//	});

	document.getElementById("stopCapture").addEventListener('click', function(event){
		document.querySelector('.ss_loader').style.display = "block";
        chrome.storage.local.set({images : []}, function (dt) {
//			document.querySelector('a#startCapture i').classList = '';
//			document.querySelector('a#startCapture i').classList.add('far');
//			document.querySelector('a#startCapture i').classList.add('fa-play-circle');
	        console.log("Store reinitialised");
            
	        deleteImageNodes();
	        loadPreviousImages();
            chrome.runtime.sendMessage({action: 'capture_status', data: 'stopped'});
            document.querySelector('.ss_loader').style.display = "none"
	    });
	});
    
    document.getElementById("exportToWord").addEventListener('click', function(event){
		var fileName = prompt('Enter word file to export the images');
        fileName=fileName.trim();
        if(fileName!= ""){
            var content = document.querySelector('.ss_main_container .ss_images').innerHTML;
            var html_document = '<!DOCTYPE html><html><head><title></title>';
            html_document  += '</head><body>'+content+'</body></html>';
            var converted = htmlDocx.asBlob(html_document, {orientation: 'portait', margins: {header: 0, footer: 0, left:360, right: 360, top: 100, bottom: 100}});
            saveAs(converted, fileName);
//            $(".ss_images").wordExport(fileName);
        }
	});
    
    $(".ss_main_container").on('click', '.ss_img_div', function(event){
		$(".ss_img_div").removeClass('selected');
        $(this).addClass('selected');
	});
    
    document.getElementById("removeSS").addEventListener('click', removeSS);
    
    document.getElementById("pluginHelp").addEventListener('click', showPluginHelp);
    
    document.getElementsByClassName("ss_handler")[0].addEventListener('click', function(event){
		
        if(document.querySelector(".ss_handler i").classList.contains('fa-arrow-right')){
            document.querySelector(".ss_handler i").classList.toggle('fa-arrow-right');
            document.querySelector(".ss_handler i").classList.add('fa-arrow-left');

            document.querySelector(".ss_main_container").style.right="180px";
            document.querySelector(".ss_handler").title = "Expand Captur";
        }else{
            document.querySelector(".ss_handler i").classList.toggle('fa-arrow-left');
            document.querySelector(".ss_handler i").classList.add('fa-arrow-right');

            document.querySelector(".ss_main_container").style.right="430px";
            document.querySelector(".ss_handler").title = "Collapse Captur";
        }
	});
}

function deleteImageNodes(){
	var imagesList = document.querySelector(".ss_main_container .ss_images");
	while (imagesList.firstChild) {
	    imagesList.removeChild(imagesList.firstChild);
	}
}

function loadPreviousImages(){
    chrome.storage.local.get('images', function (dt) { 
        if(Object.entries(dt).length === 0 && dt.constructor === Object){
            chrome.storage.local.set({images : []}, function (dt) {})
        }
        document.querySelector('.ss_loader').style.display = "block";
        chrome.storage.local.get('images', function(result) {
            result.images.forEach(function(img, index, arr){
                resizedataURL(img.data, resizeImageWidth, resizeImageHeight).then(function(res){
                    var imgDiv = document.createElement('div');imgDiv.classList.add('ss_img_div');
                    var imgIndex = document.createElement('div');imgIndex.classList.add('imgIndex');
                    var imgIndexSpan = document.createElement('span');imgIndexSpan.innerText=index+1;
                    var imgTag = document.createElement('img');
                    imgTag.src=res//img.data;
                    imgIndex.appendChild(imgIndexSpan.cloneNode(true));
                    imgDiv.appendChild(imgIndex.cloneNode(true));
                    imgDiv.appendChild(imgTag.cloneNode(true));
                    document.querySelector('.ss_main_container .ss_images').appendChild(imgDiv.cloneNode(true))
                    var objDiv = document.querySelectorAll(".ss_main_container .ss_images")[0];
                    objDiv.scrollTop = objDiv.scrollHeight;
                });
            })
        });
        
        document.querySelector('.ss_loader').style.display = "none";
    })
	

}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action == "toggle_extension"){
    	if(document.querySelectorAll('.ss_main_container').length == 0){
            var ss_main_container = document.createElement('div');
            ss_main_container.classList.add('ss_main_container');

            ss_main_container.appendChild(getToolsElement());
            ss_main_container.appendChild(getImagesElement());
            ss_main_container.appendChild(getHandler());

            document.body.appendChild(ss_main_container);
            document.body.appendChild(getLoaderDiv());

            addListeners();

            loadPreviousImages();
	    }
	    if(request.status === 'on'){
	        document.querySelector('.ss_main_container').style.display = "block"
	    }else{
	        document.querySelector('.ss_main_container').style.display = "none"
	    }
	    sendResponse({response: "toggled"});
    }else if(request.action == "captureManuallyResponse"){
        document.querySelector('.ss_loader').style.display = "block"
        var selectedImageId = parseInt($(".ss_img_div.selected").attr('id'))

    	chrome.storage.local.get('images', function(result) {
            console.log(result)
            if(_.isNaN(parseInt($(".ss_img_div.selected").attr('id')))){ //No image selected. Add to end
    		  result.images.push({id: getImageId(),data: request.data});
            }else{ //image selected. Add after it
                var newResult = {images : []};
                _.forEach(result.images, function(img){
                    newResult.images.push(img)
                    if(img.id == selectedImageId)
                        newResult.images.push({data : request.data, id : getImageId()})
                })
                result = newResult;
            }
	    	chrome.storage.local.set(result, function (dt) {
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
	    }
	    sendResponse({response: "added dom"});
    }else if(request.action = 'hidePluginTemp'){
    	document.querySelector('.ss_main_container').style.display = "none"
	    sendResponse({response: "Plugin hid"});

    }
  }
);