var regs;
var kernal;
var kernalRegex;
var lables;
var lineMapping;
var dataMemory;
var stackMemory;
var instructionMemory;
var instructions;

var instTrTdHTML;
var dataTrTdHTML;
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

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getPaddedBinary(val, width) {
    return pad(Number.parseInt(val.replace(/r|#/, ""), 10).toString(2), width);
}

/*
 * Memory Stack Data Structure
 */
function MemoryStack() {
    this.ht = new HashTable();
    this.setWord = function(in_key, in_value) {
        var val = pad(Number.parseInt(in_value, 10).toString(2), 32);
        if (val.length > 32) {
            console.error('bit limit exceed.');
        }
        this.ht.setItem(in_key, val);
    };

    this.getWord = function(in_key) {
        return this.ht.getItem(in_key);
    };
}

/*
 * begin: Implementation of arm instructions
 */

// Arithmetic Instructions
function ADD() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])) + Number.parseInt(getVal(args[2])));
    };
    this.represent = function(args) {
        var Opcode = "0100";
        return args.replace("xxxx", Opcode);
    };
}
function SUB() {
    this.action = function(args) {
        regs.setItem(getRegVar(args[0]), Number.parseInt(getVal(args[1])) - Number.parseInt(getVal(args[2])));
    };
    this.represent = function(args) {
        var Opcode = "0010";
        return args.replace("xxxx", Opcode);
    };

}
function MUL() {
    this.action = function(args) {
        console.log(args);
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
    this.represent = function(args) {
        var Opcode = "011001";
        return args.replace("xxxxxx", Opcode);
    };
}
function STR() {
    this.action = function(args) {
        if (args.length === 2 || args[2] === '#0') {
            regs.setItem(getRegVar(args[1]), Number.parseInt(getVal(args[0])));
            return;
        }
        console.error('not implement');
    };
    this.represent = function(args) {
        var Opcode = "100100";
        return args.replace("xxxxxx", Opcode);
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
    kernal.setItem('bl', new BL());

    kernalRegex = /add|sub|mul|ldr|str|ldrb|strb|mov|and|orr|mvn|lsl|lsr|cmp|b(eq|ne|ge|lt|gt|le)|b|bl/i;
    prevBase = 10;
    ic = 0;
    instTrTdHTML = "";
    dataTrTdHTML = "";
    $('#instructTBody').innerHTML = "";
    $('#dataTBody').html("");
    $('#stdout_').val("");
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

    $('#instruct').html('current instruction: <b>' + currentLine + '</b>');
    $('#ic').text('instruction count (ic): ' + (instructions.length - lables.length));
    $('#lable').text('lables: ' + lables.print());
    $('#instructTBody').html(instTrTdHTML);
    $('#dataTBody').html(dataTrTdHTML);

    editor.getSession().setAnnotations([{
            row: lineMapping.getItem(stepInLine) - 1,
            text: "current simulation line",
            type: "info"
        }]);
    editor.selection.moveCursorTo(lineMapping.getItem(stepInLine) - 1, 0, true);
}

function assemble() {
    init();
    $(".hide").show();
    lables = new HashTable();
    instructions = new HashTable();
    dataMemory = new HashTable();
    stackMemory = new MemoryStack();
    instructionMemory = new HashTable();
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
            lineMapping.setItem(instructMemAddress, l + 1);
            if (dataItems.test(line)) {
                var arr = line.split(dataItems);
                lables.setItem(arr[0].trim(), instructMemAddress);
                dataMemory.setItem(instructMemAddress, arr[1].trim());
                dataTrTdHTML += ("<tr><td>" + instructMemAddress + "</td><td>" + arr[1].trim() + "</td></tr>");
            } else if (/:/.test(line) && OninstructionLines) {
                lables.setItem(line, instructMemAddress);
            }
            instructions.setItem(instructMemAddress, line);

            // creating instruction memory

            var instArr = line.split(/[\t*|\s*]/);
            var inst = '';
            var argsStr = "";
            var args;
            var Cond, F, I, S, Rn, Rd, Operand2;
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
                args = argsStr[argsStr.length - 1].replace(/\[/, "").replace(/\]/, "").split(/,/);
                var binCode = "not implemented";
                Cond = "1110"; // AL-Always
                S = "0";
                I = "0";
                try {
                    if (/add|sub/.test(inst)) {
                        F = "00";
                        I = /#[0-9*]/.test(getRegVar(args[2])) ? '1' : '0';
                        Rn = getPaddedBinary(getRegVar(args[1]), 4);
                        Rd = getPaddedBinary(getRegVar(args[0]), 4);
                        Operand2 = getPaddedBinary(getRegVar(args[2]), 12);
                        binCode = kernal.getItem(inst).represent(Cond + F + I + "xxxx" + S + Rn + Rd + Operand2);
                    } else if (/ldr|str/.test(inst)) {
                        F = "01";
                        Rn = getPaddedBinary(getRegVar(args[1]), 4);
                        Rd = getPaddedBinary(getRegVar(args[0]), 4);
                        Operand2 = getPaddedBinary(getRegVar(args[2]), 12);
                        binCode = kernal.getItem(inst).represent(Cond + F + "xxxxxx" + Rn + Rd + Operand2);
                    }
                    //todo: other instruction formats
                } catch (e) {
                    binCode = "not implemented";
                    console.error("representation not implemented yet ;)" + instructMemAddress);
                }
                instructionMemory.setItem(instructMemAddress, binCode);
                instTrTdHTML += ("<tr><td>" + instructMemAddress + "</td><td>" + binCode + "</td></tr>");
                ic++;
            }
            instructMemAddress++;
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
    currentLine = instructions.getItem(stepInLine);
    regs.setItem(getRegVar('pc'), stepInLine);
    if (/.data/.test(currentLine) || stepInLine > instructions.length) {
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
            console.error("instruction not implemented yet ;)");
            //alert("instruction not implemented yet ;)");
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
    // $(".regVal").prop('disabled', true);
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function changeRegVal(reg) {
    var t = $("#" + reg).val();
    if (isNumber(t)) {
        regs.setItem(reg, t);
        alert(reg + ' changed.');
    } else {
        alert('enter valid value');
    }
}