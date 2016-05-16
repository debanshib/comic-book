core.controller('CameraCtrl', function(story, getAddons, $scope, $cordovaCamera, $cordovaFileTransfer, Grafi, $localStorage, CameraFactory) {
<<<<<<< HEAD
	
    $scope.story = story;
    console.log('current story: ', $scope.story)
=======
	$scope.story = story;
    $scope.currentUser = $localStorage.user._id;
    $scope.currentSquare;
    // $scope.currentDataURL = '../../img/mike.png';
    $scope.currentDataURL;
>>>>>>> master

    var urlToCanvas = function(url, canvasId){
        var canvas = document.getElementById(canvasId);
        var newImage = new Image();
        newImage.src = url;
        // newImage.crossOrigin = '';
        var context = canvas.getContext('2d');
        newImage.onload = function(){
            context.drawImage(newImage, 0, 0);
        }
        var dataURL = canvas.toDataURL('image/png');
    }

    $scope.applyFilter = function(filter, canvasId){
        console.log('in apply filter')
        var img = new Image();
        img.src = $scope.currentDataURL;
        clearFilter(canvasId, img)
        if (filter === 'grey') greyPosterFilter(canvasId, img);
        if (filter === 'poster') colorPosterFilter(canvasId, img);
        if (filter === 'brown') brownPosterFilter(canvasId, img);
        if (filter === 'black') blackFilter(canvasId, img);
    }

    var clearFilter = function(canvasId, img){
        console.log('in clear filter');
        Caman('#'+canvasId, img, function(){
            this.revert(false);
            this.render();
        })
    }

    var greyPosterFilter = function(canvasId, img){
        Caman("#"+canvasId, img, function() {
            this.posterize(3);
            this.greyscale();
            this.render()
        });
    }

    var colorPosterFilter = function(canvasId, img){
        Caman("#"+canvasId, img, function() {
            this.posterize(3);
            this.noise(3);
            this.render()
        });
    }

    var brownPosterFilter = function(canvasId, img){
        Caman('#'+canvasId, img, function(){
            this.hazyDays(5);
            this.love(5);
            this.grungy(5);
            this.noise(5);
            this.render();
        })
    }

    var blackFilter = function(canvasId, img){
        Caman('#'+canvasId, img, function() {
            this.brightness(4);
            this.contrast(10);
            this.sinCity(2);
            this.noise(4);
            this.render()
        });
    }

    // urlToCanvas($scope.currentDataURL, 'imageCanvas');

    var setFilterThumbnails = function(){
        var canvas1 = document.getElementById('greyImage')
        var context1 = canvas1.getContext('2d')
        var canvas2 = document.getElementById('posterImage')
        var context2 = canvas2.getContext('2d')
        var canvas3 = document.getElementById('brownImage')
        var context3 = canvas3.getContext('2d')
        var canvas4 = document.getElementById('blackImage')
        var context4 = canvas4.getContext('2d')
        var thumbnail = new Image();
        thumbnail.src = $scope.currentDataURL;
        thumbnail.onload = function(){
            context1.drawImage(thumbnail, 0, 0, thumbnail.width, thumbnail.height, 0, 0, canvas1.width, canvas1.height)
            greyPosterFilter('greyImage', thumbnail)
            context2.drawImage(thumbnail, 0, 0, thumbnail.width, thumbnail.height, 0, 0, canvas2.width, canvas2.height)
            colorPosterFilter('posterImage', thumbnail)
            context3.drawImage(thumbnail, 0, 0, thumbnail.width, thumbnail.height, 0, 0, canvas3.width, canvas3.height)
            brownPosterFilter('brownImage', thumbnail)
            context4.drawImage(thumbnail, 0, 0, thumbnail.width, thumbnail.height, 0, 0, canvas4.width, canvas4.height)
            blackFilter('blackImage', thumbnail)
        }    
    }




    $scope.takePicture = function() {
        console.log("THE CAMERA RAN ON THE ISOLATE SCOPE")
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 375,
            targetHeight: 375,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageURL) {
            // $scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.currentDataURL = imageURL;
            urlToCanvas(imageURL, 'imageCanvas');
            setFilterThumbnails();
        });
    }

    $scope.openPhotoLibrary = function() { 
<<<<<<< HEAD
        console.log('in open photo library', $cordovaCamera)
=======

>>>>>>> master
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 375,
            targetHeight: 375,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageURL) {
            $scope.currentDataURL = imageURL;
            urlToCanvas(imageURL, 'imageCanvas');
            setFilterThumbnails();
        });
    }

       $scope.saveImage = function(){
        var canvas = document.getElementById('imageCanvas');
        var finalDataURL = canvas.toDataURL('image/png')
        CameraFactory.createSquare(finalDataURL, $scope.story._id, $scope.currentUser)
        .then(function(square){
            $scope.currentSquare = square;
        })
    }

<<<<<<< HEAD
    //--------DIRECTIVE--------//


    // $( "#addonWrapper" ).on( "mousedown", function( event ) {
    //     console.log("Jquery... it works!")
    //     event.preventDefault();
    //     $('addonWrapper').removeClass('addonDivs');
    //     $('addonWrapper').addClass('addonDelete');

    //     console.log( $( this ).text() );
    // });
    // $( "#addonWrapper" ).on( "mouseup", function( event ) {
    //     console.log("Jquery... it works AGAIN!!!!")
    //     event.preventDefault();

    //     console.log( $( this ).text() );
    // });
    // $('li a').click(function(e) {
    //     e.preventDefault();
    //     $('a').removeClass('active');
    //     $(this).addClass('active');
    // });

    //-----ADDON FUNCTIONS-----//

    //Filters from Database Resolve
    $scope.allAddons = getAddons
    $scope.currentNav = 'navbarAddon'
    console.log($scope.allAddons)

    //Stickers

    var stickercounter = 0;
    var stickerIdCounter = 1;
    $scope.sticker = function (img){
        console.log('STICKER', img)

        if(!$scope.stickersArray) $scope.stickersArray = []
        //Create image element with unique ID
        if(stickercounter < 4){

            //Push element data into the stickersArray;
            $scope.stickersArray.push({source: img, id: stickerIdCounter})
            stickercounter++;
            stickerIdCounter++;
        } else {
            onErrorFunc()
            console.log("Too Many Stickers!")
        }

    }

    //Bubbles
    var bubblecounter = 0;  
    var bubbleIdcounter = 1;  
    $scope.bubble = function (){
        if(!$scope.bubblesArray) $scope.bubblesArray = []
        if(bubblecounter < 4){
            $scope.bubblesArray.push({id: bubbleIdcounter, text:' '})
            bubblecounter++;
            bubbleIdcounter++;
        } else {
            onErrorFunc()
        }

    }  

    //Border  
    $scope.border = function (img){
        console.log('BORDER')
    } 

    //Filter   
    $scope.filter = function (img){
        console.log('FILTER')
    }


    //REMOVE ADDONs
    $scope.removeAddon = function(eventId) {
        console.log("removeAddon!", eventId)
        document.getElementById(eventId).remove()

        if (eventId[0] === 's') {
          --stickercounter
          console.log("stickercounter", stickercounter) 
          for (var i = 0; i < $scope.stickersArray.length; i++) {
                if($scope.stickersArray[i].id === Number(eventId.slice(-1))) {
                    $scope.stickersArray.splice(i, 1)
                    //Adds success notification to users screen
                    onSuccessfulDelete()
                }
           } 
        } 

        if (eventId[0] === 'b') {
            --bubblecounter
            console.log("bubblecounter", bubblecounter) 
            for (var i = 0; i < $scope.bubblesArray.length; i++) {
                console.log("bubble ids", $scope.bubblesArray[i].id, Number(eventId.slice(-1)))
                if($scope.bubblesArray[i].id === Number(eventId.slice(-1))) {
                    $scope.bubblesArray.splice(i, 1)
                    //Adds success notification to users screen
                    onSuccessfulDelete()
                }
            } 
        }

        console.log($scope.bubblesArray, $scope.stickersArray)
    }

    // Hammer Counter Variables:
    // x and y are used to grab current coordinates of the element for use in drawing
    // diffX and diffY are used to allow for draggin of stickers based on click and not center
    // offset is NOT being used, but might be helpful with drawing to canvas 
    var x,
        y,
        diffX,
        diffY,
        offset;
    var hammerCounter = 0

    $scope.onHammer = function onHammer (event) {

        // Grabs current Element
        var currentElem = document.getElementById(event.element[0].id);
        // y Coordinate
        var currentTop = Number(currentElem.style.top.substring(0, currentElem.style.top.length-2))
        // x Coordinate
        var currentLeft = Number(currentElem.style.left.substring(0, currentElem.style.left.length-2))

        // var currentCenter = [(currentLeft + (currentWidth/2)), (currentTop + (currentHeight/2))]

        if(!hammerCounter){ 
            console.log("This Ran", currentElem.className)
            diffX = event.center.x - currentLeft;
            diffY = event.center.y - currentTop;
            // Grab the current elements offset from the screen.
            // This is important because otherwise we only have its position relative
            // to its Div (ie, (0,0) refers to the top left of the DIV, not the screen (might effect canvas drawing)
            offset = $('#' + event.element[0].id).offset();
            // // Then refer to 
            // var x = evt.pageX - offset.left;
            ++hammerCounter

        }
=======
    // var combineLayers = function(imageCanvasId, addonCanvasId){
    //     var imageCanvas = document.getElementById(imageCanvasId);
    //     canvas.setAttribute('style', 'z-index=1')
    //     var addonCanvas = document.getElementById(addonCanvasId);
    //     canvas.setAttribute('style', 'z-index=2')
    //     var imageContext = imageCanvas.getContext('2d');
    //     var addonsContext = addonCanvas.getContext('2d');
    //     imageContext.drawImage(addonsContext, 0, 0);
    // }

    // $scope.canvas = document.getElementById('imageCanvas');
    // $scope.addons = document.getElementById('addonCanvas');

>>>>>>> master

        x = event.center.x
        y = event.center.y


<<<<<<< HEAD
        // if((y > 60 && y < 550) && currentElem.className === 'addonDivs activated') {
        //     currentElem.style.top = y - diffY + 'px';
        // }        
        // if((y > 60 && y < 700) && currentElem.className === 'addonDivs activated addonActive') {
        //     currentElem.style.top = y - diffY + 'px';
        // }
        // if((x + 25) > 0 && x < 375) {   
        //     currentElem.style.left = x - diffX + 'px';
        // }        
        if(y > 60 && y < 600) {
            currentElem.style.top = y - diffY + 'px';
        }          
        if((x + 25) > 0 && x < 375) {   
            currentElem.style.left = x - diffX + 'px';
        }

        console.log("Coords", x, y);

        // $('#addonWrapper').find('#navbarDelete').on('mouseover', function(){
        //     console.log("Hovering")
        // })
=======
   


    //--------DIRECTIVE--------//

    $scope.test = function(){
        console.log("HELLO")
    }
    //Filters from Database Resolve
    $scope.allAddons = getAddons
    console.log($scope.allAddons)

    //Create Sticker Div
 
    // var w = document.getElementById('stickerWrapper');

    // w.style.left = '50px';
    // w.style.top = '100px'

    $scope.stickersArray = []
    stickercounter = 1;
    $scope.sticker = function (img){
        console.log('STICKER', img)

        //Create image element with unique ID
        if(stickercounter < 4){
            // var sticker = new Image()
            // sticker.src = img
            // console.log(sticker)

            // sticker.setAttribute("src", img)
            // sticker.setAttribute("hm-panmove", 'onHammer')
            // sticker.setAttribute("ng-click", "test()")
            $scope.stickersArray.push({source: img, id: stickercounter})

            console.log($scope.stickersArray)
            //Grab that element and set it to a variable;
            // w.appendChild(sticker)
            stickercounter++
        } else {
            //Run an Error that tells them they have too many stickers!
            console.log("Too Many Stickers!")
        }
        // $scope.$compile()
    }    
    $scope.bubble = function (img){
        console.log('BUBBLE')
    }    
    $scope.border = function (img){
        console.log('BORDER')
    }    
    $scope.filter = function (img){
        console.log('FILTER')
    }

    $scope.onHammer = function onHammer (event) {

        var currentElem = document.getElementById(event.element[0].id);

        var x = event.center.x - 80,
            y = event.center.y - 130;

        currentElem.style.left = x + 'px';
        currentElem.style.top = y + 'px';
        console.log("hammer ran", currentElem)

      console.log("Coords", x, y);
>>>>>>> master

    };


<<<<<<< HEAD
    $scope.onPress = function onPress (event) {

        var currentElem = document.getElementById(event.element[0].id);

        //Find the sticker and make its background Active (red), and 'draggable'(doesnt do anything expcept allow the garbage can to be 'droppable later')
        $("#addonWrapper").find('#' + event.element[0].id).addClass('addonActive')

        //Add the delete Button onto the DOM
        $scope.currentNav = 'navbarDelete'

        // document.getElementById('deleteDiv').addEventListener('mouseup', function(){
        //     console.log('The Best Event Listener Listened!')
        //     $scope.removeAddon(event.element[0].id)
        // })    

    };

    //This Function Runs once an addon is stopped dragging and/or a pressed addon is released
    $scope.onHammerEnd = function onHammerEnd (event) {


        //find the current element
        var currentElem = document.getElementById(event.element[0].id)

        //Reshow the Addon Navbar
        $scope.currentNav = 'navbarAddon'


        console.log("onHammerEnd", event.center.y, currentElem.className)
        //Run delete Function if sticker/bubble is active AND event occurred below certain point on screen
        if(event.center.y > 490 && currentElem.className === 'addonDivs addonActive'){
            console.log("remove should've ran")
            // $(currentElem).click(function(e) {
                console.log(event)
                var currentTop = Number(currentElem.style.top.substring(0, currentElem.style.top.length-2));
                // x Coordinate
                var currentLeft = Number(currentElem.style.left.substring(0, currentElem.style.left.length-2));
                var xOffset = event.center.x - currentLeft;
                var yOffset = event.center.y - currentTop;
                // $(this).fadeOut('fast');
                $('#puff').css({
                    left: event.center.x - 20 + 'px',
                    top: event.center.y - 80 + 'px'
                }).show();
                animatePoof();
            // });
            $scope.removeAddon(event.element[0].id)

        }

        //Remove Active Class from selected sticker/bubble
        $("#addonWrapper").find('#' + event.element[0].id).removeClass('addonActive')


        //Decrement hammerCounter
        --hammerCounter

    };     

    var onErrorFunc = function () {
        console.log('onErrorFunc')
        $('#addonError').appendTo('#addonWrapper').slideDown("slow")

        setTimeout(function(){
            $('#addonError').fadeOut();
        }, 3000)

    }     

    var onSuccessfulDelete = function () {
        console.log('onSuccessfulDelete')
        $('#addonSuccessfulDelete').appendTo('#addonWrapper').slideDown("slow")

        setTimeout(function(){
            $('#addonSuccessfulDelete').fadeOut();
        }, 3000)

    } 

    function animatePoof() {
        console.log("animate Poof Ran")
        var bgTop = 0,
            frame = 0,
            frames = 6,
            frameSize = 32,
            frameRate = 80,
            puff = $('#puff');
        var animate = function(){
            if(frame < frames){
                puff.css({
                    backgroundPosition: "0 " + bgTop + "px"
                });
                bgTop = bgTop - frameSize;
                frame++;
                setTimeout(animate, frameRate);
            }
        };
        
        animate();
        setTimeout("$('#puff').hide()", frames * frameRate);
    }

});


 
=======
});



//OLD SKETCH FILTER
    // $scope.filterImage = function(filterType, canvasId){
    //     // var canvas = $scope.canvas;
    //     var canvas = document.getElementById(canvasId);
    //     var filterType = filterType || 'sketch';
    //     var context = canvas.getContext('2d');
    //     var imageData = context.getImageData(0,0, canvas.width, canvas.height);
    //     var finalImageData;
    //     if (filterType === 'sketch'){
    //         var a = Grafi.edge(imageData, {level: 20});
    //         var b = Grafi.invert(a)
    //             // for (var i=0; i < a.length; i+=4){
    //             //   a[i]     = 255 - a[i];     // red
    //             //   a[i + 1] = 255 - a[i + 1]; // green
    //             //   a[i + 2] = 255 - a[i + 2]; // blue
    //             // }
    //         var c = Grafi.contrast(a)
    //         // var c = Grafi.brightness(a);
    //         finalImageData = c;
    //     }
    //     if (filterType === 'posterize'){
    //         finalImageData = Grafi.posterize(imageData)
    //     }
    //     context.putImageData(finalImageData, 0, 0);
    //     $scope.currentDataURL = canvas.toDataURL('image/png');
    // }

//FUNCTION TO UPDATE CANVAS
    // var updateCanvas = function(canvasId, changeFunct){
    //     var canvas = document.getElementById(canvasId);
    //     var context = canvas.getContext('2d');
    //     var imageData = context.getImageData(0,0, canvas.width, canvas.height);
    //     var dataURL = canvas.toDataURL('image/png');
    //     var newImageData = changeFunct(dataURL);
    //     context.putImageData(finalImageData, 0, 0);
    // }


>>>>>>> master
