/*
 * simulate the arm code on server using ajax call 
 */
function simulate() {
    var code_ = editor.getValue();
    var stdin_ = document.getElementById("stdin_").value;
    $.post(
            "Simulator.php",
            {
                type: "arm-windows",
                code: code_,
                stdin: stdin_
            },
    function(data) {
        document.getElementById("stdout_").innerHTML = data;
        $.scrollTop();
    });
}

/*
 * Loading, Editing, and Saving a Text File in HTML5 Using Javascript
 * @author: http://thiscouldbebetter.wordpress.com
 * @source: http://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip/
 */
function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        editor.setValue(textFromFileLoaded);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}
function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}
function saveTextAsFile() {
    var textToWrite = editor.getValue();
    var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    var fileNameToSaveAs = "prog.s"
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}
/*
 * End of Loading, Editing, and Saving a Text File in HTML5 Using Javascript
 */