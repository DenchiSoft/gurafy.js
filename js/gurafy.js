window.onload = function () {

    var mainForm = document.getElementById("main-form");
    var mainImage = document.getElementById('gurafy_image');
    var mainCanvas = document.getElementById('gurafy_canvas');

    function handleForm(event) {
        event.preventDefault();
        document.getElementById("button-create").click()
    }
    mainForm.addEventListener('submit', handleForm);

    var lastDownload;

    document.getElementById('button-download').onclick = function () {
        if (!lastDownload) {
            return;
        }

        var downloadLink = document.createElement('a');

        downloadLink.download = lastDownload + '_gurafied.png';
        downloadLink.href = document.getElementById('gurafy_canvas').toDataURL();
        downloadLink.click();
    }

    document.getElementById('button-create').onclick = function () {
        var twitProfilePicAPI = "https://twivatar.glitch.me/";

        var userInput = document.getElementById('twitter-handle-input').value;
        var screenName = userInput.substr(userInput.lastIndexOf("/") + 1);

        screenName = screenName.trim().replace(/^@/, '');

        if (screenName === "") {
            return;
        }

        var apiUrl = twitProfilePicAPI + screenName;

        var profileImage = new Image;
        var overlayImage = new Image;

        profileImage.crossOrigin = 'Anonymous';
        overlayImage.crossOrigin = 'Anonymous';

        profileImage.onload = function () {
            mainImage.style.display = 'none';
            mainCanvas.style.display = 'inherit';
            render({
                mainCanvas,
                profileImage,
                overlayImage,
            });

            var dataURL = mainCanvas.toDataURL();
            mainImage.setAttribute('src', dataURL);

            lastDownload = screenName;

            shake(mainCanvas, 30);
        };

        profileImage.src = "";
        overlayImage.src = "";

        profileImage.src = apiUrl;
        overlayImage.src = gura_hood;

        onDragCanvas(
            mainCanvas,
            (posX, posY) => render({
                mainCanvas,
                overlayImage,
                profileImage,
                profileImagePosX: posX - profileImage.width / 2,
                profileImagePosY: posY - profileImage.height / 2,
            }), );
    }

    var animateButton = function (e) {
        e.preventDefault;
        e.target.classList.remove('animate');
        e.target.classList.add('animate');

        setTimeout(function () {
            e.target.classList.remove('animate');
        }, 700);
    };

    var bubblyButtons = document.getElementsByClassName("bubbly-button");

    for (var i = 0; i < bubblyButtons.length; i++) {
        bubblyButtons[i].addEventListener('click', animateButton, false);
    }
}

function render({
    mainCanvas,
    profileImage,
    profileImagePosX = 0,
    profileImagePosY = 0,
    overlayImage,
}) {
    var ctx = mainCanvas.getContext('2d');

    mainCanvas.setAttribute('width', '400');
    mainCanvas.setAttribute('height', '400');

    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    // background
    ctx.fillStyle = '#383D41';
    ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

    ctx.drawImage(
        profileImage,
        0,
        0,
        profileImage.width,
        profileImage.height,
        profileImagePosX,
        profileImagePosY,
        mainCanvas.width,
        mainCanvas.height, );
    ctx.drawImage(overlayImage, 0, 0, overlayImage.width, overlayImage.height, 0, 0, mainCanvas.width, mainCanvas.height);
}

function onDragCanvas(canvas, callback) {
    var isDragging = false;

    canvas.onmousedown = handleMouseDown;
    canvas.onmouseup = handleMouseUp;
    canvas.onmousemove = handleMouseMove;
    canvas.ontouchstart = handleTouchStart;
    canvas.ontouchend = handleTouchEnd;
    canvas.ontouchcancel = handleTouchEnd;
    canvas.ontouchmove = handleTouchMove;

    function handleMouseDown() {
        isDragging = true;
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleMouseMove(event) {
        var canvasMouseX = parseInt(event.pageX - this.offsetLeft);
        var canvasMouseY = parseInt(event.pageY - this.offsetTop);

        if (isDragging) {
            callback(canvasMouseX, canvasMouseY);
        }
    }

    function handleTouchStart(event) {
        canvas.style.touchAction = 'auto';
        event.preventDefault();
        handleMouseDown();
    }

    function handleTouchEnd(event) {
        canvas.style.touchAction = 'auto';
        event.preventDefault();
        handleMouseUp();
    }

    function handleTouchMove(event) {
        var firstFingerTouch = event.touches[0];
        var canvasMouseX = parseInt(firstFingerTouch.pageX - this.offsetLeft);
        var canvasMouseY = parseInt(firstFingerTouch.pageY - this.offsetTop);

        if(isDragging) {
            canvas.style.touchAction = 'none';
            event.preventDefault();
            callback(canvasMouseX, canvasMouseY);
        }
    }
}
