var regs;
var kernal;
var kernalRegex;
var lables;
var lineMapping;
var dataMemory;
var instructionLines;

var stepInLine;
var currentLine;
var prevBase;
var ic;

function getRegVar(args) {
    if (args === 'sp') {
        args = 'r13';
    } else if (args === 'lr') {
        args = 'r14';
    } else if (args === 'pc') {
        args = 'r15';
    }
    return args;
}

function getVal(args) {
    if (/#[0-9*]/.test(args)) {
        return args.replace("#", "");
    } else {
        if (args === 'sp') {
            args = 'r13';
        } else if (args === 'lr') {
            args = 'r14';
        } else if (args === 'pc') {
            args = 'r15';
        }
        return regs.getItem(args);
    }
}

/*
 * begin: Implementation of arm instructions
 */

// Arithmetic Instructions
function ADD() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])) + Number.parseInt(getVal(args[2])));
    };
}
function SUB() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])) - Number.parseInt(getVal(args[2])));
    };
}
function MUL() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])) * Number.parseInt(getVal(args[2])));
    };
}

// Data Transfer Instructions
function LDR() {
    this.action = function(args) {
        if (args[1].contains("=")) {
            regs.setItem(getRegVar(args[0]), lables.getItem(args[1].replace("=", "").concat(":")));
            return;
        } else if (args.length === 2 || args[2] === '#0') {
            regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])));
            return;
        }
        console.error('not implement');
    };
}
function STR() {
    this.action = function(args) {
        if (args.length === 2 || args[2] === 0) {
            regs.setItem(getRegVar(args[1]), Number.parseInt(getVal(args[0])));
            return;
        }
        console.error('not implement');
    };
}
function LDRB() {
    this.action = function(args) {
        console.error('not implement');
    };
}
function STRB() {
    this.action = function(args) {
        console.error('not implement');
    };
}
function MOV() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])));
    };
}

// Logical Instructions
function AND() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])) & Number.parseInt(getVal(args[2])));
    };
}
function ORR() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])) | Number.parseInt(getVal(args[2])));
    };
}
function MVN() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), ~(Number.parseInt(getVal(args[1]))));
    };
}
function LSL() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])) << Number.parseInt(getVal(args[2])));
    };
}
function LSR() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])) >> Number.parseInt(getVal(args[2])));
    };
}

// Conditional Branch Instructions
function CMP() {
    this.action = function(args) {
        regs.setItem('n', 0);
        regs.setItem('z', 0);
        regs.setItem('c', 0);
        regs.setItem('v', 0);
        var temp = Number.parseInt(getVal(args[0])) - Number.parseInt(getVal(args[1]));
        if (temp === 0) {
            regs.setItem('z', 1);
            regs.setItem('c', 1);
        } else if (temp > 0) {
            regs.setItem('c', 1);
        } else {
            regs.setItem('n', 1);
        }
    };
}
function EQ() {
    this.action = function(args) {
        if (regs.getItem('z') == 1) {
            stepInLine = lables.getItem(args[0] + ':');
        }
    };
}
function NE() {
    this.action = function(args) {
        if (regs.getItem('z') == 0) {
            stepInLine = lables.getItem(args[0] + ':');
        }
    };
}
function GE() {
    this.action = function(args) {
        if (regs.getItem('z') == 1 || regs.getItem('c') == 1) {
            stepInLine = lables.getItem(args[0] + ':');
        }
    };
}
function LT() {
    this.action = function(args) {
        if (regs.getItem('n') == 1) {
            stepInLine = lables.getItem(args[0] + ':');
        }
    };
}
function GT() {
    this.action = function(args) {
        if (regs.getItem('c') == 1 && regs.getItem('z') == 0) {
            stepInLine = lables.getItem(args[0] + ':');
        }
    };
}
function LE() {
    this.action = function(args) {
        if (regs.getItem('z') == 1 || regs.getItem('n') == 1) {
            stepInLine = lables.getItem(args[0] + ':');
        }
    };
}

// Unonditional Branch Instructions
function B() {
    this.action = function(args) {
        stepInLine = lables.getItem(args[0] + ':');
    };
}
function BL() {
    this.action = function(args) {
        if (args[0] === "printf") {
            var text = dataMemory.getItem(regs.getItem('r0'));
            var escChars = /%(d|c)/;
            var reg = 1;
            while (escChars.test(text)) {
                var val = regs.getItem('r' + reg);
                if (/%c/.test(text)) {
                    text = text.replace(/%c/, String.fromCharCode(val));
                } else {
                    text = text.replace(/%d/, val);
                }
                reg++;
            }
            $("#stdout_").val($("#stdout_").val() + text);
            return;
        }
        // todo: scanf
        console.error('not implement');
    };
}

/*
 * end: Implementation of arm functions
 */

function init() {
    regs = new HashTable();
    regs.setItem('r0', 0);
    regs.setItem('r1', 0);
    regs.setItem('r2', 0);
    regs.setItem('r3', 0);
    regs.setItem('r4', 0);
    regs.setItem('r5', 0);
    regs.setItem('r6', 0);
    regs.setItem('r7', 0);
    regs.setItem('r8', 0);
    regs.setItem('r9', 0);
    regs.setItem('r10', 0);
    regs.setItem('r11', 0);
    regs.setItem('r12', 0);
    regs.setItem('r13', 1024); //sp
    regs.setItem('r14', 0); //lr
    regs.setItem('r15', 0); //pc

    regs.setItem('n', 0);
    regs.setItem('z', 0);
    regs.setItem('c', 0);
    regs.setItem('v', 0);

    kernal = new HashTable();
    kernal.setItem('add', new ADD());
    kernal.setItem('sub', new SUB());
    kernal.setItem('mul', new MUL());

    kernal.setItem('ldr', new LDR());
    kernal.setItem('str', new STR());
    //kernal.setItem('ldrb', new LDRB());
    //kernal.setItem('strb', new STRB());
    kernal.setItem('mov', new MOV());

    kernal.setItem('and', new AND());
    kernal.setItem('orr', new ORR());
    kernal.setItem('mvn', new MVN());
    kernal.setItem('lsl', new LSL());
    kernal.setItem('lsr', new LSR());

    kernal.setItem('cmp', new CMP());
    kernal.setItem('beq', new EQ());
    kernal.setItem('bne', new NE());
    kernal.setItem('bge', new GE());
    kernal.setItem('bgt', new GT());
    kernal.setItem('blt', new LT());
    kernal.setItem('ble', new LE());

    kernal.setItem('b', new B());
    kernal.setItem('bl', new BL());

    kernalRegex = /add|sub|mul|ldr|str|mov|and|orr|mvn|lsl|lsr|cmp|b(eq|ne|ge|lt|gt|le)|b|bl/i;
    prevBase = 10;
    ic = 0;
}

function updateUI() {
    var i;
    for (i = 0; i < 16; i++) {
        $('#r' + i).val(regs.getItem('r' + i));
    }
    $('#n').val(regs.getItem('n'));
    $('#z').val(regs.getItem('z'));
    $('#c').val(regs.getItem('c'));
    $('#v').val(regs.getItem('v'));

    $('#editorLineNum').text('num of instructions: ' + instructionLines.length);
    $('#stepInLine').text('InstructionNum: ' + stepInLine);
    $('#instruct').text('instruct: ' + currentLine);
    $('#ic').text('ic: ' + ic);
    $('#lable').text('lable: ' + lables.print());
    $('#data').text('data: ' + dataMemory.print());
    editor.getSession().setAnnotations([{
            row: lineMapping.getItem(stepInLine) - 1,
            text: "current execution line",
            type: "info"
        }]);
    editor.selection.moveCursorTo(lineMapping.getItem(stepInLine) - 1, 0, true);
}

function assemble() {
    init();
    lables = new HashTable();
    instructionLines = new HashTable();
    dataMemory = new HashTable();
    lineMapping = new HashTable();
    var instructMemAddress = 0;
    var OninstructionLines = true;
    var dataItems = /.asciz/; // todo: .byte
    var line;
    var code = editor.getValue();
    var codeLines_ = code.split('\n');
    var l;
    for (l = 0; l < codeLines_.length; l++) {
        line = codeLines_[l].trim();
        if (/.data/.test(line)) {
            OninstructionLines = false;
        }
        if (!(line.startsWith('#') || line.startsWith('@') || line.startsWith('.') || (line.length === 0))) {
            instructMemAddress++;
            lineMapping.setItem(instructMemAddress, l + 1);
            if (dataItems.test(line)) {
                var arr = line.split(dataItems);
                lables.setItem(arr[0].trim(), instructMemAddress);
                //console.log(arr[1].trim());
                dataMemory.setItem(instructMemAddress, arr[1].trim());
            } else if (/:/.test(line) && OninstructionLines) {
                lables.setItem(line, instructMemAddress);
            }
            instructionLines.setItem(instructMemAddress, line);
        }
    }
    // setStart
    if (lables.hasItem('main:')) {
        stepInLine = lables.getItem('main:');
        $("#stepIn").prop('disabled', false);
    } else {
        alert('Error: this code does not have main:');
    }
    updateUI();
}

function stepIn() {
    stepInLine++;
    currentLine = instructionLines.getItem(stepInLine);
    regs.setItem(getRegVar('pc'), stepInLine);
    if (/.data/.test(currentLine) || stepInLine > instructionLines.length) {
        alert('Note: code reaches the end.');
        $("#stepIn").prop('disabled', true);
        return;
    }
    var instArr = currentLine.split(/[\t*|\s*]/);
    var inst;
    var argsStr;
    var args;
    /*
     * Addressing Modes Demodulation
     */
    if (kernalRegex.test(instArr[0])) {
        inst = instArr[0].toLowerCase();
        var i;
        for (i = 1; i < instArr.length; i++) {
            argsStr += (instArr[i]).trim();
        }
        argsStr = argsStr.split(/undefined/);
        args = argsStr[1].replace(/\[/, "").replace(/\]/, "").split(/,/);
        try {
            kernal.getItem(inst).action(args);
        } catch (e) {
            $('#stdout_').val("not implemented yet ;)");
        }
        ic++;
    }
    updateUI();
}

function changeBase(newBase) {
    var i;
    for (i = 0; i < 16; i++) {
        $('#r' + i).val(Number.parseInt($('#r' + i).val(), prevBase).toString(newBase));
    }
    $('#n').val(Number.parseInt($('#n').val(), prevBase).toString(newBase));
    $('#z').val(Number.parseInt($('#z').val(), prevBase).toString(newBase));
    $('#c').val(Number.parseInt($('#c').val(), prevBase).toString(newBase));
    $('#v').val(Number.parseInt($('#v').val(), prevBase).toString(newBase));
    prevBase = newBase;
}

function disableRegVals() {
    $(".regVal").prop('disabled', true);
}
