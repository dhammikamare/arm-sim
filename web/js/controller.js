function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        editor.setValue(textFromFileLoaded);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function simulate() {
    
}