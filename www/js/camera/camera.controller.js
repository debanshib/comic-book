core.controller('CameraCtrl', function($q, $state, story, getAddons, $rootScope, $scope, $cordovaCamera, $cordovaFileTransfer, Grafi, $localStorage, CameraFactory, FilterFactory) {
	$scope.story = story;
    $scope.currentUser = $localStorage.user._id;
    // $scope.currentSquare;
    $scope.stickersArray = [];

    //REMOVE LINK WHEN USING URL FROM PHOTO / ALBUM LIBRARY
    $scope.url = '../../img/ben.png';
    // $scope.url;


    var urlToCanvas = function(url, canvasId, x, y){
        console.log('parameters', url, canvasId, x, y)
        var x = x || 0;
        var y = y || 0;
        var canvas = document.getElementById('imageCanvas');
        var context = canvas.getContext('2d');
        var newImage = new Image();
        newImage.src = url;
        // newImage.crossOrigin = '';
        newImage.onload = function(){
            context.drawImage(newImage, x, y, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL('image/png');
            // console.log(dataURL);
            $scope.test = dataURL;
            $scope.$digest();
        }
    }
    //REMOVE WHEN USING URL FROM PHOTO / ALBUM LIBRARY
    urlToCanvas($scope.url, 'imageCanvas');

    $scope.applyfilter = function(filter, canvasId){
        console.log('in apply filter in camera ctrl')
        applyfilter(filter, canvasId);
    }

    var applyfilter = function(filter, canvasId){
        console.log('in applyfilter other function')
        var img = new Image();
        img.src = $scope.url;
        if (canvasId === 'imageCanvas') FilterFactory.clearFilter(canvasId, img)
        if (filter === 'grey') FilterFactory.greyPosterFilter(canvasId, img);
        if (filter === 'poster') FilterFactory.colorPosterFilter(canvasId, img);
        if (filter === 'brown') FilterFactory.brownPosterFilter(canvasId, img);
        if (filter === 'black') FilterFactory.blackFilter(canvasId, img);
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
            $scope.url = imageURL;
            urlToCanvas(imageURL, 'imageCanvas');
        });
    }

    $scope.openPhotoLibrary = function() { 
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
            $scope.url = imageURL;
            urlToCanvas(imageURL, 'imageCanvas');
        });
    }



    // var combineLayers = function(imageCanvasId, addonCanvasId, x, y){
    //     var imageCanvas = document.getElementById(imageCanvasId);
    //     canvas.setAttribute('style', 'z-index=1')
    //     var addonCanvas = document.getElementById(addonCanvasId);
    //     canvas.setAttribute('style', 'z-index=2')
    //     var imageContext = imageCanvas.getContext('2d');
    //     var addonsContext = addonCanvas.getContext('2d');
    //     imageContext.drawImage(addonsContext, x, y);
    // }


   var addStickersToCanvas = function(){
        var canvas = document.getElementById('imageCanvas');
        var context = canvas.getContext('2d');
        var onloadsRunning = [];
        $scope.stickersArray.forEach(function(sticker){
            var x = Number(sticker.x.slice(0,-2)) || 0;
            var y = Number(sticker.y.slice(0,-2)) || 0;
            var newImage = new Image();
            newImage.src = sticker.source;
            var onloadPromise = $q(function(resolve, reject){
                newImage.onload = function(){
                    context.drawImage(newImage, x, y);
                    resolve();
                }
                newImage.onerror = reject;
            })
            onloadsRunning.push(onloadPromise);
        })
        return $q.all(onloadsRunning);
    }     

    var addBorderToCanvas = function(){
        // if ($scope.chosenBorder) {        
            var canvas = document.getElementById('imageCanvas');
            var context = canvas.getContext('2d');
            var onloadsRunning = [];
            // $scope.chosenBorder(function(border){
            var newImage = new Image();
            newImage.src = $scope.chosenBorder ? $scope.chosenBorder.source  : 'assets/borders/transparent.png'
            console.log("newImage.srcy", newImage.src, $scope.chosenBorder)
            var onloadPromise = $q(function(resolve, reject){
                newImage.onload = function(){
                    context.drawImage(newImage, 0, 0);
                    resolve();
                }
                newImage.onerror = reject;
            })
            onloadsRunning.push(onloadPromise);
            // })
            return $q.all(onloadsRunning);
        // }
    }   

    var addBubblesToCanvas = function(){
        console.log("addBubblesToCanvas Ran")
        if($scope.bubblesArray){
            // console.log(!!$scope.bubblesArray)
            var canvas = document.getElementById('imageCanvas');
            var context = canvas.getContext('2d');
            var onloadsRunning = [];
            $scope.bubblesArray.forEach(function(bubble){
                var x = Number(bubble.x.slice(0,-2)) || 0;
                var y = Number(bubble.y.slice(0,-2)) || 0;
                var newImage = new Image();
                newImage.src = bubble.source;
                var onloadPromise = $q(function(resolve, reject){
                    newImage.onload = function(){
                        context.drawImage(newImage, x, y);
                        resolve();
                    }
                    newImage.onerror = reject;
                })
                onloadsRunning.push(onloadPromise);
            })
            return $q.all(onloadsRunning);
        }
    }

    //Defines the saveImage function which Saves Image to DB and adds to story
    $scope.saveImage = function(){
        console.log("saveImageRan")
        // bubblestoImageData()


        addBorderToCanvas()
        // .then(function(){
        //     console.log("Thsee bubbles should have source", $scope.bubblesArray)
        //     addBubblesToCanvas()
        // })
        .then(function(){
            return addStickersToCanvas()
        })
        .then(function(){
            console.log("I bet it doesnt get here")
            var canvas = document.getElementById('imageCanvas');
            var finalDataURL = canvas.toDataURL('image/png')
            console.log("SAVE IMAGE SCOPE STORY ID", $scope.story._id)
            CameraFactory.createSquare(finalDataURL, $scope.story._id, $scope.currentUser)
        })        
        .then(function(square){
            // $scope.currentSquare = square;
            // console.log('saved image, in ctrl', $scope.currentSquare)
            console.log("PROMISE STORY ID", $scope.story._id)
            $state.go('story', {storyId: $scope.story._id});
        })
        .catch(function(err){
            console.error(err);
        })
    }

    //Listens for the event being emmited from navbar.main.controller that will run our saveImage() function
    $scope.$on('saveImage', function() {
        $scope.saveImage()
        console.log("SaveImage .on")
    })

    // FOR HTML2CANVASS ////////////
    // FOR GRABBING
    // var element1;
    // var element2;
    // var element3;

    // function grabElement() {
    //     // if we make it so can put on more STICKERS will have to change this
    //     if (stickercounter === 1) {
    //         element1 = $("#sticker1");
    //     } else if (stickercounter === 2) {
    //         element2 = $("#sticker2");
    //     } else if (stickercounter === 3) {
    //         element3 = $("#sticker3");
    //     }

    //     console.log('element1: ', element1)
    // };
    //////////////////////

        // ORDER OF WORKING THIS:
    //  1. WHEN BUBBLE IS ADDED TO DOM, GRAB IT AND ASSIGN IT TO A VAR 
    //      (this is being done with grabElemnt function above - tested with stickers.  Put this func into $scope.sticker function)
    //  2. THAT VAR NEEDS TO BE PASSED INTO THE html2canvas FUNCTION BELOW 
    //      (currently putting in 'element' which is just a random element to turn from html to canvas obj)
    //  3. FOLLOW COMMENTS IN $scope.previewImage FUNCTION BELOW

    // PRACTICE TURNING DIV INTO CANVAS
    // USE GRABELEMNT FUNCTIONABOVE WITH THIS
    var element = $("#new"); // global variable
    var getCanvas; // global variable
 
    var bubblestoImageData = function () {
         // PASS CORRECT BUBBLE IN WHERE 'element' CURRENTLY IS
         if($scope.bubblesArray){
             $scope.bubblesArray.forEach( function(currentBubble){
                 var currElement = $('#textarea' + currentBubble.id)
                 console.log("Bubble DIv", currElement[0])
                 html2canvas(currElement[0], {
                 onrendered: function (canvas) {
                        // RENDERS CANVAS BACK ONTO PAGE
                        canvas.class = 'newID';
                        // PRETTY SURE WE DONT NEED TO APPEND BACK TO DOM TO GET ALL THE DATA FROM IT
                        // $("#previewImage").append(canvas);
                        // getCanvas = canvas;

                        // NOTES:
                        // 1. MIGHT HAVE TO SET THE TEXT AREA TO BE CERTAIN H/W CUZ IT RERENDERS WRONG IF THE USER PRESSES ENTER (but they prob wont be pressing enter right?) (STARTS A NEW LINE - ALL COMES OUT AS ONE LINE)
                        //      - TO SOLVE THIS MIGHT BE ABLE TO PASS H/W PARAMS WITH THE TEXT BOX
                        // 2. WILL HAVE TO PASS COORDOINATES WITH THE DATA URL
                        var ctx = canvas.getContext("2d");
                        var imgData = ctx.getImageData(0,0, 375, 43);
                        var dataURL = canvas.toDataURL();
                        currentBubble.source = dataURL
                        console.log('data url', $scope.story);
                     }
                 })

             }
             );
            
         }
    };



  //--------DIRECTIVE--------//


    //-----ADDON FUNCTIONS-----//

    //Filters from Database Resolve
    $scope.allAddons = getAddons
    $scope.currentNav = 'navbarAddon'
    console.log($scope.allAddons)


    //Stickers
    var stickercounter = 0;
    var stickerIdCounter = 1;
    $scope.sticker = function (img){
        console.log('in sticker function in ctrl!!')
        console.log('STICKER', img)

        if(!$scope.stickersArray) $scope.stickersArray = []
        //Create image element with unique ID
        if(stickercounter < 4){
            //Push element data into the stickersArray;
            $scope.stickersArray.push({source: img, id: stickercounter, x: '0px', y: '0px'})
            console.log($scope.stickersArray)
            //Grab that element and set it to a variable;
            // w.appendChild(sticker)
            stickercounter++
            stickerIdCounter++;
      
        } else {
            onErrorFunc()
            console.log("Too Many Stickers!")
        }

    console.log($scope.stickersArray)
    }


    //Bubbles
    var bubblecounter = 0;  
    var bubbleIdcounter = 1;  
    $scope.bubble = function (bubbleName){
        console.log(bubbleName)
        if(!$scope.bubblesArray) $scope.bubblesArray = []

        // Creates an array of Pointer and PointerBorder Styling based on bubble name
        // CreateBubbleStyle function is in the bubbles.js file
        var currentBubbleStyle = createBubbleStyle(bubbleName)
        console.log(currentBubbleStyle)

        if(bubblecounter < 4){
            $scope.bubblesArray.push({id: bubbleIdcounter, pointerStyle:currentBubbleStyle[0], pointerBorderStyle: currentBubbleStyle[1], x: '0px', y: '0px' })
            bubblecounter++;
            bubbleIdcounter++;
        } else {
            onErrorFunc()
        }
    }  

    //Border  
    $scope.border = function (img){
        console.log('BORDER', img)
        $scope.chosenBorder = {source: img}
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

        x = event.center.x
        y = event.center.y

        if(y > 60 && y < 600) {
            currentElem.style.top = y - diffY + 'px';
        }          
        if((x + 25) > 0 && x < 375) {   
            currentElem.style.left = x - diffX + 'px';
        }

        // console.log("Coords", x, y);

    };


    $scope.onPress = function onPress (event) {

        var currentElem = document.getElementById(event.element[0].id);
        var currentx = event.center.x - 80,
            currenty = event.center.y - 130;

        // currentElem.style.left = currentx + 'px';
        // currentElem.style.top = currenty + 'px';

        //Find the sticker and make its background Active (red), and 'draggable'(doesnt do anything expcept allow the garbage can to be 'droppable later')
        $("#addonWrapper").find('#' + event.element[0].id).addClass('addonActive')

        //Add the delete Button onto the DOM
        $scope.currentNav = 'navbarDelete'

    };

    //This Function Runs once an addon is stopped dragging and/or a pressed addon is released
    $scope.onHammerEnd = function onHammerEnd (event) {

        // Grab Current Element
        var currentElem = document.getElementById(event.element[0].id)

        // Reshow the Addon Navbar
        $scope.currentNav = 'navbarAddon'

        // var currentx = event.center.x - 80,
        //     currenty = event.center.y - 130;
        var currentx = currentElem.style.left,
            currenty = currentElem.style.top;

         if(event.element[0].id[0] === 's') {        
            var index;
            $scope.stickersArray.forEach(function(sticker, idx){
                if ('sticker'+sticker.id === event.element[0].id) {
                    index = idx;
                }
            })
            console.log("StickersArray HERE", $scope.stickersArray )
            $scope.stickersArray[index].x = currentx
            $scope.stickersArray[index].y = currenty
        }
        if(event.element[0].id[0] === 'b') {        
            var index;
            $scope.bubblesArray.forEach(function(bubble, idx){
                if ('bubble'+bubble.id === event.element[0].id) {
                    index = idx;
                }
            })
            console.log("StickersArray HERE", $scope.stickersArray )
            $scope.bubblesArray[index].x = Number(currentx.slice(0, -2))
            $scope.bubblesArray[index].y = Number(currenty.slice(0, -2))
        }

        //Update final resting coordinates of the current Element
        updateCoordinates(event)
        console.log("Arrays b/s in HammerEnd", $scope.bubblesArray, $scope.stickersArray)

        console.log("onHammerEnd", event.center.x, event.center.y, currentElem.className)

        //Run delete Function if sticker/bubble is active AND event occurred below certain point on screen
        if(event.center.y > 490 && currentElem.className.indexOf('addonActive') > -1){

            //Poof Animation Runs
            $('#puff').css({
                left: event.center.x - 20 + 'px',
                top: event.center.y - 80 + 'px'
            }).show();
            animatePoof();

            //Remove Addon Function Runs
            $scope.removeAddon(event.element[0].id)

        }

        //Remove Active Class from selected sticker/bubble
        $("#addonWrapper").find('#' + event.element[0].id).removeClass('addonActive')

        //Decrement hammerCounter
        --hammerCounter

    }; 


    // Update the final resting place coordinates for each Sticker/Bubble Div for drawing to canvas
    var updateCoordinates = function(event) {
        
        //find the current element
        var currentElem = document.getElementById(event.element[0].id)
        var currentx = currentElem.style.left,
            currenty = currentElem.style.top;

        //If its a StickerArray Event:
        if(event.element[0].id[0] === 's') {        
            var index;
            $scope.stickersArray.forEach(function(sticker, idx){
                if ('sticker'+sticker.id === event.element[0].id) {
                    index = idx;
                }
            })
            console.log("StickersArray HERE", $scope.stickersArray )
            $scope.stickersArray[index].x = currentx
            $scope.stickersArray[index].y = currenty
        }

        //If its a BubbleArray Event:
        if(event.element[0].id[0] === 'b') {        
            var index;
            $scope.bubblesArray.forEach(function(bubble, idx){
                if ('bubble'+bubble.id === event.element[0].id) {
                    index = idx;
                }
            })
            console.log("BubblesArray HERE", $scope.bubblesArray )
            $scope.bubblesArray[index].x = currentx
            $scope.bubblesArray[index].y = currenty
        }

    }   

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

