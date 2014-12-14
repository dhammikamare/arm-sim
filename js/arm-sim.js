var regs;
var kernal;
var lables;
var instructionLines;
var stepInLine;
var currentLine;
var prevBase;
var ic;

function setVal(args) {
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
    console.error('Error: wrong name for register');
}

/*
 * begin: Implementation of arm instructions
 */

// Arithmetic Instructions
function ADD() {
    this.action = function(args) {
        regs.setItem(setVal(args[0]), parseInt(getVal(args[1])) + parseInt(getVal(args[2])));
    };
}
function SUB() {
    this.action = function(args) {
        regs.setItem(setVal(args[0]), parseInt(getVal(args[1])) - parseInt(getVal(args[2])));
    };
}
function MUL() {
    this.action = function(args) {
        regs.setItem(setVal(args[0]), parseInt(getVal(args[1])) * parseInt(getVal(args[2])));
    };
}

// Data Transfer Instructions
function LDR() {
    this.action = function(args) {
        console.error('not implement');
    };
}
function STR() {
    this.action = function(args) {
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
        regs.setItem(setVal(args[0]), parseInt(getVal(args[1])));
    };
}

// Logical Instructions
function AND() {
    this.action = function(args) {
        regs.setItem(setVal(args[0]), parseInt(getVal(args[1])) & parseInt(getVal(args[2])));
    };
}
function ORR() {
    this.action = function(args) {
        regs.setItem(setVal(args[0]), parseInt(getVal(args[1])) | parseInt(getVal(args[2])));
    };
}
function MVN() {
    this.action = function(args) {
        regs.setItem(setVal(args[0]), ~(parseInt(getVal(args[1]))));
    };
}
function LSL() {
    this.action = function(args) {
        regs.setItem(setVal(args[0]), parseInt(getVal(args[1])) << parseInt(getVal(args[2])));
    };
}
function LSR() {
    this.action = function(args) {
        regs.setItem(setVal(args[0]), parseInt(getVal(args[1])) >> parseInt(getVal(args[2])));
    };
}

// Conditional Branch Instructions
function CMP() {
    this.action = function(args) {
        regs.setItem('n', 0);
        regs.setItem('z', 0);
        regs.setItem('c', 0);
        regs.setItem('v', 0);
        var temp = parseInt(getVal(args[0])) - parseInt(getVal(args[1]));
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
        var t = regs.getItem('z');
        console.log('t' + t);
        if (t == 0) {
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
    regs.setItem('r13', 1000); //sp
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
    kernal.setItem('ldrb', new LDRB());
    kernal.setItem('strb', new STRB());
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
    $('#stepInLine').text('line: ' + stepInLine);
    $('#instruct').text('instruct: ' + currentLine);
}

function assemble() {
    init();
    lables = new HashTable();
    instructionLines = new HashTable();
    var lineNumber = 0;
    var lable = /:/;
    var line;
    var code = editor.getValue();
    var codeLines_ = code.split('\n');
    codeLines_.forEach(function(entry) {
        lineNumber++;
        line = entry.trim();
        instructionLines.setItem(lineNumber, line);
        if (lable.test(line)) {
            lables.setItem(line, lineNumber);
        }
    });
    if (lables.hasItem('main:')) {
        stepInLine = lables.getItem('main:');
        $("#stepIn").prop('disabled', false);
    } else {
        alert('Error: this code does not have main:');
    }
    updateUI();
}

function stepIn() {
    currentLine = instructionLines.getItem(++stepInLine);
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
    if (/add|sub|mul|ldr|str|ldrb|strb|mov|and|orr|mvn|lsl|lsr|cmp|b(eq|ne|ge|lt|gt|le)|b/i.test(instArr[0])) {
        inst = instArr[0].toLowerCase();
        var i;
        for (i = 1; i < instArr.length; i++) {
            argsStr += (instArr[i]).trim();
        }
        argsStr = argsStr.split(/undefined/);
        args = argsStr[1].replace(/\[/, "").replace(/\]/, "").split(/,/);
        kernal.getItem(inst).action(args);
        ic++;
    }
    updateUI();
}

function changeBase(newBase) {
    var i;
    for (i = 0; i < 16; i++) {
        $('#r' + i).val(parseInt($('#r' + i).val(), prevBase).toString(newBase));
    }
    $('#n').val(parseInt($('#n').val(), prevBase).toString(newBase));
    $('#z').val(parseInt($('#z').val(), prevBase).toString(newBase));
    $('#c').val(parseInt($('#c').val(), prevBase).toString(newBase));
    $('#v').val(parseInt($('#v').val(), prevBase).toString(newBase));
    prevBase = newBase;
}

function disableRegVals() {
    $(".regVal").prop('disabled', true);
}
