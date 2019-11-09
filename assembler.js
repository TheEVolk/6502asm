console.log(instructions)

var MAX_MEM = ((32*32)-1);
var codeCompiledOK = false;
var regA = 0;
var regX = 0;
var regY = 0;
var regP = 0;
var regPC = 0x600;
var regSP = 0x100;
var memory = new Array( 0x600 );
var runForever = false;
var labelIndex = new Array();
var labelPtr = 0;
var codeRunning = false;
var xmlhttp;
var myInterval;
var defaultCodePC = 0x600;
var debug = false;
var palette = new Array(
  "#000000", "#ffffff", "#880000", "#aaffee",
  "#cc44cc", "#00cc55", "#0000aa", "#eeee77",
  "#dd8855", "#664400", "#ff7777", "#333333",
  "#777777", "#aaff66", "#0088ff", "#bbbbbb" );

class Display {
  constructor(elementId) {
    this.canvas = document.getElementById(elementId);
    this.canvas.width = this.canvas.height = 512;
		this.context = this.canvas.getContext('2d');
  }

  setPixel(x, y, color) {
    this.context.fillStyle = color;
    this.context.fillRect(x * 16, y * 16, 16, 16);
  }

  setAddrPixel(adrr, color) {
    const y = Math.floor((addr - 0x200) / 32);
    const x = (addr - 0x200) % 32;
    this.setPixel(x, y, color);
  }
}

const display = new Display("canvas");

var Opcodes = new Array(

    /* Name, Imm,  ZP,   ZPX,  ZPY,  ABS,  ABSX, ABSY, INDX, INDY, SNGL, BRA */

Array("ADC", 0x69, 0x65, 0x75, 0x00, 0x6d, 0x7d, 0x79, 0x61, 0x71, 0x00, 0x00 ),
Array("AND", 0x29, 0x25, 0x35, 0x00, 0x2d, 0x3d, 0x39, 0x21, 0x31, 0x00, 0x00 ),
Array("ASL", 0x00, 0x06, 0x16, 0x00, 0x0e, 0x1e, 0x00, 0x00, 0x00, 0x0a, 0x00 ),
Array("BIT", 0x00, 0x24, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ),
Array("BPL", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10 ),
Array("BMI", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30 ),
Array("BVC", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x50 ),
Array("BVS", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x70 ),
Array("BCC", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x90 ),
Array("BCS", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xb0 ),
Array("BNE", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd0 ),
Array("BEQ", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0 ),
Array("CMP", 0xc9, 0xc5, 0xd5, 0x00, 0xcd, 0xdd, 0xd9, 0xc1, 0xd1, 0x00, 0x00 ),
Array("CPX", 0xe0, 0xe4, 0x00, 0x00, 0xec, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ),
Array("CPY", 0xc0, 0xc4, 0x00, 0x00, 0xcc, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ),
Array("DEC", 0x00, 0xc6, 0xd6, 0x00, 0xce, 0xde, 0x00, 0x00, 0x00, 0x00, 0x00 ),
Array("EOR", 0x49, 0x45, 0x55, 0x00, 0x4d, 0x5d, 0x59, 0x41, 0x51, 0x00, 0x00 ),
Array("CLC", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x00 ),
Array("SEC", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x38, 0x00 ),
Array("CLI", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x58, 0x00 ),
Array("SEI", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x78, 0x00 ),
Array("CLV", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xb8, 0x00 ),
Array("CLD", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd8, 0x00 ),
Array("SED", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf8, 0x00 ),
Array("INC", 0x00, 0xe6, 0xf6, 0x00, 0xee, 0xfe, 0x00, 0x00, 0x00, 0x00, 0x00 ),
Array("JMP", 0x00, 0x00, 0x00, 0x00, 0x4c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ),
Array("JSR", 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ),
Array("LDA", 0xa9, 0xa5, 0xb5, 0x00, 0xad, 0xbd, 0xb9, 0xa1, 0xb1, 0x00, 0x00 ),
Array("LDX", 0xa2, 0xa6, 0x00, 0xb6, 0xae, 0x00, 0xbe, 0x00, 0x00, 0x00, 0x00 ),
Array("LDY", 0xa0, 0xa4, 0xb4, 0x00, 0xac, 0xbc, 0x00, 0x00, 0x00, 0x00, 0x00 ),
Array("LSR", 0x00, 0x46, 0x56, 0x00, 0x4e, 0x5e, 0x00, 0x00, 0x00, 0x4a, 0x00 ),
Array("NOP", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xea, 0x00 ),
Array("ORA", 0x09, 0x05, 0x15, 0x00, 0x0d, 0x1d, 0x19, 0x01, 0x11, 0x00, 0x00 ),
Array("TAX", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xaa, 0x00 ),
Array("TXA", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x8a, 0x00 ),
Array("DEX", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xca, 0x00 ),
Array("INX", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xe8, 0x00 ),
Array("TAY", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa8, 0x00 ),
Array("TYA", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x98, 0x00 ),
Array("DEY", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x88, 0x00 ),
Array("INY", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc8, 0x00 ),
Array("ROR", 0x00, 0x66, 0x76, 0x00, 0x6e, 0x7e, 0x00, 0x00, 0x00, 0x6a, 0x00 ),
Array("ROL", 0x00, 0x26, 0x36, 0x00, 0x2e, 0x3e, 0x00, 0x00, 0x00, 0x2a, 0x00 ),
Array("RTI", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00 ),
Array("RTS", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x60, 0x00 ),
Array("SBC", 0xe9, 0xe5, 0xf5, 0x00, 0xed, 0xfd, 0xf9, 0xe1, 0xf1, 0x00, 0x00 ),
Array("STA", 0x00, 0x85, 0x95, 0x00, 0x8d, 0x9d, 0x99, 0x81, 0x91, 0x00, 0x00 ),
Array("TXS", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x9a, 0x00 ),
Array("TSX", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xba, 0x00 ),
Array("PHA", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x00 ),
Array("PLA", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x68, 0x00 ),
Array("PHP", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00 ),
Array("PLP", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x28, 0x00 ),
Array("STX", 0x00, 0x86, 0x00, 0x96, 0x8e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ),
Array("STY", 0x00, 0x84, 0x94, 0x00, 0x8c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ),
Array("---", 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 )
);

// Initialize everything.

document.getElementById( "compileButton" ).disabled = false;
document.getElementById( "runButton" ).disabled = true;
document.addEventListener( "keypress", keyPress, true );

// Reset everything

reset();

/*
 *  keyPress() - Store keycode in ZP $ff
 *
 */

function keyPress( e ) {
	if( typeof window.event != "undefined" )
		e = window.event;
	if( e.type == "keypress" ) {
		value = e.which;
		memStoreByte( 0xff, value );
	}
}

/*
 *  debugExec() - Execute one instruction and print values
 */

function debugExec() {
	if( codeRunning )
		execute();
	updateDebugInfo();
}

function updateDebugInfo() {
	var html = "<br />";
	html += "A=$" + num2hex(regA)+" X=$" + num2hex(regX)+" Y=$" + num2hex(regY)+"<br />";
	html += "P=$" + num2hex(regP)+" SP=$"+addr2hex(regSP)+" PC=$" + addr2hex(regPC);
	document.getElementById("md").innerHTML = html;
}

/*
 *  gotoAddr() - Set PC to address (or address of label)
 *
 */

function gotoAddr() {
	var inp = prompt( "Enter address or label", "" );
	var addr = 0;
	if( findLabel( inp ) ) {
		addr = getLabelPC( inp );
	} else {
		if( inp.match( new RegExp( /^0x[0-9a-f]{1,4}$/i ) ) ) {
			inp = inp.replace( /^0x/, "" );
			addr = parseInt( inp, 16 );
		} else if( inp.match( new RegExp( /^\$[0-9a-f]{1,4}$/i))) {
			inp = inp.replace( /^\$/, "" );
			addr = parseInt( inp, 16 );
		}
	}
	if( addr == 0 ) {
		alert( "Unable to find/parse given address/label" );
	} else {
		regPC = addr;
	}
	updateDebugInfo();
}


/*
 *  stopDebugger() - stops debugger
 *
 */

function stopDebugger() {
	debug = false;
	if( codeRunning ) {
		document.getElementById( "stepButton" ).disabled = true;
		document.getElementById( "gotoButton" ).disabled = true;
	}
}

function enableDebugger() {
	debug = true;
	if( codeRunning ) {
		updateDebugInfo();
		document.getElementById( "stepButton" ).disabled = false;
		document.getElementById( "gotoButton" ).disabled = false;
	}
}
/*
 *  toggleDebug() - Toggles debugging on/off
 *
 */

function toggleDebug() {
//	alert( "debug="+debug+" og codeRunning="+codeRunning );
	debug = !debug;
	if( debug )
		enableDebugger();
	else
		stopDebugger();
}


/*
 *  disableButtons() - Disables the Run and Debug buttons when text is
 *                     altered in the code editor
 *
 */

function disableButtons() {
  document.getElementById( "runButton" ).disabled = true;
  //document.getElementById( "hexdumpButton" ).disabled = true;
  document.getElementById( "compileButton" ).disabled = false;
  document.getElementById( "runButton" ).value = "Run";
  document.getElementById( "submitCode" ).disabled = true;
  codeCompiledOK = false;
  codeRunning = false;
  document.getElementById( "code" ).focus();
  document.getElementById( "stepButton" ).disabled = true;
  document.getElementById( "gotoButton" ).disabled = true;
  clearInterval( myInterval );
}

/*
 *  Load() - Loads a file from server
 *
 */

function Load( file ) {
  reset();
  disableButtons();
  document.getElementById( "code" ).value = "Loading, please wait..";
  document.getElementById( "compileButton" ).disabled = true;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = FileLoaded;
  xmlhttp.open( "GET", "/examples/" + file );
  xmlhttp.send( null );
  stopDebugger();
}

function FileLoaded() {
  if( xmlhttp.readyState == 4 )
    if( xmlhttp.status == 200 ) {
      document.getElementById( "code" ).value = xmlhttp.responseText;
      document.getElementById( "compileButton" ).disabled = false;
    }
}

/*
 *  reset() - Reset CPU and memory.
 *
 */

function reset() {
  for( y=0; y<32; y++ )
    for( x=0; x<32; x++ ) {
      display.setPixel(x, y, "#000000");
    }
  for( x=0; x<0x600; x++ )  // clear ZP, stack and screen
    memory[x] = 0x00;
  regA = regX = regY = 0;
  defaultCodePC = regPC = 0x600;
  regSP = 0x100;
  regP = 0x20;
  runForever = false;
}


/*
 *  message() - Prints text in the message window
 *
 */

function message( text ) {
  obj = document.getElementById( "messages" );
  obj.innerHTML += text + "<br />";
  obj.scrollTop = obj.scrollHeight;
}

/*
 *  compileCode()
 * 
 *  "Compiles" the code into a string (global var compiledCode)
 * 
 */

function compileCode() {
  reset();
  document.getElementById( "messages" ).innerHTML = "";

  var code = editor.getValue();
  // code += "\n\n";
  lines = code.split( "\n" );
  codeCompiledOK = true;
  labelIndex = new Array();
  labelPtr = 0;

  message( "Indexing labels.." );

  defaultCodePC = regPC = 0x600;

  for( xc=0; xc<lines.length; xc++ ) {
    if( ! indexLabels( lines[xc] ) ) {
      message( "<b>Label already defined at line "+(xc+1)+":</b> "+lines[xc] );
      return false;
    }
  }

  str = "Found " + labelIndex.length + " label";
  if( labelIndex.length != 1 ) str += "s";
  message( str + "." );

  defaultCodePC = regPC = 0x600;
  message( "Compiling code.." );

  for( x=0; x<lines.length; x++ ) {
    if( ! compileLine( lines[x], x ) ) {
      codeCompiledOK = false;
      break;
    }
  }

  if( codeLen == 0 ) {
    codeCompiledOK = false;
    message( "No code to run." );
  }

  if( codeCompiledOK ) {
    document.getElementById( "runButton" ).disabled = false;
    document.getElementById( "compileButton" ).disabled = true;
    memory[defaultCodePC] = 0x00;
  } else {
    str = lines[x].replace( "<", "&lt;" ).replace( ">", "&gt;" );
    message( "<b>Синтаксическая ошибка (" + (x+1) + "): " + str + "</b>");
    document.getElementById( "runButton" ).disabled = true;
    document.getElementById( "compileButton" ).disabled = false;
    editor.gotoLine(x+1, 0, true);
    editor.getSession().setAnnotations([{
      row: x,
      text: "Синтаксическая ошибка.",
      type: "error" // also warning and information
    }]);
    return;
  }

  updateDisplayFull();
  message( "Code compiled successfully, " + codeLen + " bytes." );
}

/*
 *  indexLabels() - Pushes all labels to array.
 *
 */

function indexLabels( input ) {

  // remove comments

  input = input.replace( new RegExp( /^(.*?);.*/ ), "$1" );

  // trim line

  input = input.replace( new RegExp( /^\s+/ ), "" );
  input = input.replace( new RegExp( /\s+$/ ), "" );

  // Figure out how many bytes this instuction takes

  thisPC = defaultCodePC;

  codeLen = 0;
//  defaultCodePC = 0x600;
  compileLine( input );
  regPC += codeLen;

  // Find command or label

  if( input.match( new RegExp( /^\w+:/ ) ) ) {
    label = input.replace( new RegExp( /(^\w+):.*$/ ), "$1" );
    return pushLabel( label + "|" + thisPC );
  }
  return true;
}

/*
 *  pushLabel() - Push label to array. Return false if label already exists.
 * 
 */

function pushLabel( name ) {
  if( findLabel( name ) ) return false;
  labelIndex[labelPtr++] = name + "|";
  return true;
}

/*
 *  findLabel() - Returns true if label exists.
 *
 */

function findLabel( name ) {
  for( m=0; m<labelIndex.length; m++ ) {
    nameAndAddr = labelIndex[m].split( "|" );
    if( name == nameAndAddr[0] ) {
      return true;
    }
  }
  return false;
}

/*
 *  setLabelPC() - Associates label with address
 *
 */

function setLabelPC( name, addr ) {
  for( i=0; i<labelIndex.length; i++ ) {
    nameAndAddr = labelIndex[i].split( "|" );
    if( name == nameAndAddr[0] ) {
      labelIndex[i] = name + "|" + addr;
      return true;
    }
  }
  return false;
}

/*
 *  getLabelPC() - Get address associated with label
 *
 */

function getLabelPC( name ) {
  for( i=0; i<labelIndex.length; i++ ) {
    nameAndAddr = labelIndex[i].split( "|" );
    if( name == nameAndAddr[0] ) {
      return (nameAndAddr[1]);
    }
  }
  return -1;
}

/*
 *  compileLine()
 *
 *  Compiles one line of code.  Returns true if it compiled successfully,
 *  false otherwise.
 */

function compileLine( input, lineno ) {

  // remove comments

  input = input.replace( new RegExp( /^(.*?);.*/ ), "$1" );

  // trim line

  input = input.replace( new RegExp( /^\s+/ ), "" );
  input = input.replace( new RegExp( /\s+$/ ), "" );

  // Find command or label

  if( input.match( new RegExp( /^\w+:/ ) ) ) {
    label = input.replace( new RegExp( /(^\w+):.*$/ ), "$1" );
    if( input.match( new RegExp( /^\w+:[\s]*\w+.*$/ ) ) ) {
      input = input.replace( new RegExp( /^\w+:[\s]*(.*)$/ ), "$1" );
      command = input.replace( new RegExp( /^(\w+).*$/ ), "$1" );
    } else {
      command = "";
    }
  } else {
    command = input.replace( new RegExp( /^(\w+).*$/ ), "$1" );
  }

  // Blank line?  Return.

  if( command == "" )
    return true;

  command = command.toUpperCase();

  if( input.match( /^\*[\s]*=[\s]*[\$]?[0-9a-f]*$/ ) ) {
    // equ spotted
    param = input.replace( new RegExp( /^[\s]*\*[\s]*=[\s]*/ ), "" );
    if( param[0] == "$" ) {
      param = param.replace( new RegExp( /^\$/ ), "" );
      addr = parseInt( param, 16 );
    } else {
      addr = parseInt( param, 10 );
    }
    if( (addr < 0) || (addr > 0xffff) ) {
      message( "Unable to relocate code outside 64k memory" );
      return false;
    }
    defaultCodePC = addr;
    return true;
  }

  if( input.match( /^\w+\s+.*?$/ ) ) {
    param = input.replace( new RegExp( /^\w+\s+(.*?)/ ), "$1" );
  } else {
    if( input.match( /^\w+$/ ) ) {
      param = "";
    } else {
      return false;
    }
  }

  param = param.replace( /[ ]/g, "" );

  if( command == "DCB" )
    return DCB( param );

  for( o=0; o<Opcodes.length; o++ ) {
    if( Opcodes[o][0] == command ) {
      if( checkSingle( param, Opcodes[o][10] ) ) return true;
      if( checkImmediate( param, Opcodes[o][1] ) ) return true;
      if( checkZeroPage( param, Opcodes[o][2] ) ) return true;
      if( checkZeroPageX( param, Opcodes[o][3] ) ) return true;
      if( checkZeroPageY( param, Opcodes[o][4] ) ) return true;
      if( checkAbsoluteX( param, Opcodes[o][6] ) ) return true;
      if( checkAbsoluteY( param, Opcodes[o][7] ) ) return true;
      if( checkIndirectX( param, Opcodes[o][8] ) ) return true;
      if( checkIndirectY( param, Opcodes[o][9] ) ) return true;
      if( checkAbsolute( param, Opcodes[o][5] ) ) return true;
      if( checkBranch( param, Opcodes[o][11] ) ) return true;
    }
  }
  return false; // Unknown opcode
}

/*****************************************************************************
 ****************************************************************************/

function DCB( param ) {
  values = param.split( "," );
  if( values.length == 0 ) return false;
  for( v=0; v<values.length; v++ ) {
    str = values[v];
    if( str != undefined && str != null && str.length > 0 ) {
      ch = str.substring( 0, 1 );
      if( ch == "$" ) {
        number = parseInt( str.replace( /^\$/, "" ), 16 );
        pushByte( number );
      } else if( ch >= "0" && ch <= "9" ) {
        number = parseInt( str, 10 );
        pushByte( number );
      } else {
        return false;
      }
    }
  }
  return true;
}

/*
 *  checkBranch() - Commom branch function for all branches (BCC, BCS, BEQ, BNE..)
 *
 */

function checkBranch( param, opcode ) {
  if( opcode == 0x00 ) return false;

  addr = -1;
  if( param.match( /\w+/ ) )
    addr = getLabelPC( param );
  if( addr == -1 ) { pushWord( 0x00 ); return false; }
  pushByte( opcode );
  if( addr < (defaultCodePC-0x600) ) {  // Backwards?
    pushByte( (0xff - ((defaultCodePC-0x600)-addr)) & 0xff );
    return true;
  }
  pushByte( (addr-(defaultCodePC-0x600)-1) & 0xff );
  return true;
}

/*
 * checkImmediate() - Check if param is immediate and push value
 * 
 */

function checkImmediate( param, opcode ) {
  if( opcode == 0x00 ) return false;
  if( param.match( new RegExp( /^#\$[0-9a-f]{1,2}$/i ) ) ) {
    pushByte( opcode );
    value = parseInt( param.replace( /^#\$/, "" ), 16 );
    if( value < 0 || value > 255 ) return false;
    pushByte( value );
    return true;
  }
  if( param.match( new RegExp( /^#[0-9]{1,3}$/i ) ) ) {
    pushByte( opcode );
    value = parseInt( param.replace( /^#/, "" ), 10 );
    if( value < 0 || value > 255 ) return false;
    pushByte( value );
    return true;
  }
  // Label lo/hi
  if( param.match( new RegExp( /^#[<>]\w+$/ ) ) ) {
    label = param.replace( new RegExp( /^#[<>](\w+)$/ ), "$1" );
    hilo = param.replace( new RegExp( /^#([<>]).*$/ ), "$1" );
    pushByte( opcode );
    if( findLabel( label ) ) {
      addr = getLabelPC( label );
      switch( hilo ) {
        case ">":
          pushByte( (addr >> 8) & 0xff );
          return true;
          break;
        case "<":
          pushByte( addr & 0xff );
          return true;
          break;
        default:
          return false;
          break;
      }
    } else {
      pushByte( 0x00 );
      return true;
    }
  }
  return false;
}

/*
 * checkIndZP() - Check indirect ZP
 *
 */


/*
 * checkIndirectX() - Check if param is indirect X and push value
 * 
 */

function checkIndirectX( param, opcode ) {
  if( opcode == 0x00 ) return false;
  if( param.match( /^\(\$[0-9a-f]{1,2},X\)$/i ) ) {
    pushByte( opcode );
    value = param.replace( new RegExp( /^\(\$([0-9a-f]{1,2}).*$/i ), "$1" );
    if( value < 0 || value > 255 ) return false;
    pushByte( parseInt( value, 16 ) );
    return true;
  }
  return false;
}

/*
 * checkIndirectY() - Check if param is indirect Y and push value
 * 
 */

function checkIndirectY( param, opcode ) {
  if( opcode == 0x00 ) return false;
  if( param.match( /^\(\$[0-9a-f]{1,2}\),Y$/i ) ) {
    pushByte( opcode );
    value = param.replace( new RegExp( /^\([\$]([0-9a-f]{1,2}).*$/i ), "$1" );
    if( value < 0 || value > 255 ) return false;
    pushByte( parseInt( value, 16 ) );
    return true;
  }
  return false;
}

/*
 *  checkSingle() - Single-byte opcodes
 *
 */

function checkSingle( param, opcode ) {
  if( opcode == 0x00 ) return false;
  if( param != "" ) return false;
  pushByte( opcode );
  return true;
}

/*
 *  checkZeroaPage() - Check if param is ZP and push value
 *
 */

function checkZeroPage( param, opcode ) {
  if( opcode == 0x00 ) return false;
  if( param.match( /^\$[0-9a-f]{1,2}$/i ) ) {
    pushByte( opcode );
    value = parseInt( param.replace( /^\$/, "" ), 16 );
    if( value < 0 || value > 255 ) return false;
    pushByte( value );
    return true;
  }
  if( param.match( /^[0-9]{1,3}$/i ) ) {
    pushByte( opcode );
    value = parseInt( param, 10 );
    if( value < 0 || value > 255 ) return false;
    pushByte( value );
    return true;
  }
  return false;
}

/*
 *  checkAbsoluteX() - Check if param is ABSX and push value
 *
 */

function checkAbsoluteX( param, opcode ) {
  if( opcode == 0x00 ) return false;
  if( param.match( /^\$[0-9a-f]{3,4},X$/i ) ) {
    pushByte( opcode );
    number = param.replace( new RegExp( /^\$([0-9a-f]*),X/i ), "$1" );
    value = parseInt( number, 16 );
    if( value < 0 || value > 0xffff ) return false;
    pushWord( value );
    return true;
  }

  if( param.match( /^\w+,X$/i ) ) {
    param = param.replace( new RegExp( /,X$/i ), "" );
    pushByte( opcode );
    if( findLabel( param ) ) {
      addr = getLabelPC( param );
      if( addr < 0 || addr > 0xffff ) return false;
      pushWord( addr );
      return true;
    } else {
      pushWord( 0x1234 );
      return true;
    }
  }

  return false;
}

/*
 *  checkAbsoluteY() - Check if param is ABSY and push value
 *
 */

function checkAbsoluteY( param, opcode ) {
  if( opcode == 0x00 ) return false;
  if( param.match( /^\$[0-9a-f]{3,4},Y$/i ) ) {
    pushByte( opcode );
    number = param.replace( new RegExp( /^\$([0-9a-f]*),Y/i ), "$1" );
    value = parseInt( number, 16 );
    if( value < 0 || value > 0xffff ) return false;
    pushWord( value );
    return true;
  }

  // it could be a label too..

  if( param.match( /^\w+,Y$/i ) ) {
    param = param.replace( new RegExp( /,Y$/i ), "" );
    pushByte( opcode );
    if( findLabel( param ) ) {
      addr = getLabelPC( param );
      if( addr < 0 || addr > 0xffff ) return false;
      pushWord( addr );
      return true;
    } else {
      pushWord( 0x1234 );
      return true;
    }
  }
  return false;
}

/*
 *  checkZeroPageX() - Check if param is ZPX and push value
 *
 */

function checkZeroPageX( param, opcode ) {
  if( opcode == 0x00 ) return false;
  if( param.match( /^\$[0-9a-f]{1,2},X/i ) ) {
    pushByte( opcode );
    number = param.replace( new RegExp( /^\$([0-9a-f]{1,2}),X/i ), "$1" );
    value = parseInt( number, 16 );
    if( value < 0 || value > 255 ) return false;
    pushByte( value );
    return true;
  }
  if( param.match( /^[0-9]{1,3},X/i ) ) {
    pushByte( opcode );
    number = param.replace( new RegExp( /^([0-9]{1,3}),X/i ), "$1" );
    value = parseInt( number, 10 );
    if( value < 0 || value > 255 ) return false;
    pushByte( value );
    return true;
  }
  return false;
}

function checkZeroPageY( param, opcode ) {
  if( opcode == 0x00 ) return false;
  if( param.match( /^\$[0-9a-f]{1,2},Y/i ) ) {
    pushByte( opcode );
    number = param.replace( new RegExp( /^\$([0-9a-f]{1,2}),Y/i ), "$1" );
    value = parseInt( number, 16 );
    if( value < 0 || value > 255 ) return false;
    pushByte( value );
    return true;
  }
  if( param.match( /^[0-9]{1,3},Y/i ) ) {
    pushByte( opcode );
    number = param.replace( new RegExp( /^([0-9]{1,3}),Y/i ), "$1" );
    value = parseInt( number, 10 );
    if( value < 0 || value > 255 ) return false;
    pushByte( value );
    return true;
  }
  return false;
}

/*
 *  checkAbsolute() - Check if param is ABS and push value
 *
 */

function checkAbsolute( param, opcode ) {
  if( opcode == 0x00 ) return false;
  pushByte( opcode );
  if( param.match( /^\$[0-9a-f]{3,4}$/i ) ) {
    value = parseInt( param.replace( /^\$/, "" ), 16 );
    if( value < 0 || value > 0xffff ) return false;
    pushWord( value );
    return true;
  }
  if( param.match( /^[0-9]{1,5}$/i ) ) {  // Thanks, Matt!
    value = parseInt( param, 10 );
    if( value < 0 || value > 65535 ) return false;
    pushWord( value );
    return( true );
  }
  // it could be a label too..
  if( param.match( /^\w+$/ ) ) {
    if( findLabel( param ) ) {
      addr = (getLabelPC( param ));
      if( addr < 0 || addr > 0xffff ) return false;
      pushWord( addr );
      return true;
    } else {
      pushWord( 0x1234 );
      return true;
    }
  }
  return false;
}

/*****************************************************************************
 ****************************************************************************/

/*
 *  stackPush() - Push byte to stack
 *
 */

function stackPush( value ) {
  if( regSP >= 0 ) {
    regSP--;
    memory[(regSP&0xff)+0x100] = value & 0xff;
  } else {
    message( "Stack full: " + regSP );
    codeRunning = false;
  }
}

/*****************************************************************************
 ****************************************************************************/

/*
 *  stackPop() - Pop byte from stack
 *
 */

function stackPop() {
  if( regSP < 0x100 ) {
    value = memory[regSP+0x100];
    regSP++;
    return value;
  } else {
    message( "Stack empty" );
    codeRunning = false;
    return 0;
  }
}

/*
 * pushByte() - Push byte to compiledCode variable
 *
 */

function pushByte( value ) {
  memory[defaultCodePC] = value & 0xff;
  defaultCodePC++;
  codeLen++;
}

/*
 * pushWord() - Push a word using pushByte twice
 *
 */

function pushWord( value ) {
  pushByte( value & 0xff );
  pushByte( (value>>8) & 0xff );
}

/*
 * popByte() - Pops a byte
 *
 */

function popByte() {
  return( memory[regPC++] & 0xff );
}

/*
 * popWord() - Pops a word using popByte() twice
 *
 */

function popWord() {
  return popByte() + (popByte() << 8);
}

/*
 * memStoreByte() - Poke a byte, don't touch any registers
 *
 */

function memStoreByte( addr, value ) {
  memory[ addr ] = (value & 0xff);
  if( (addr >= 0x200) && (addr<=0x5ff) ) 
    display.setAddrPixel(addr-0x200, palette[memory[addr] & 0x0f]);
}

/*
 *  submitCode() - Submits code (using XMLHttpRequest) to be published (moderated)
 *
 */

function submitCode() {
  if( confirm( "Warning: This will submit your code to 6502asm.com for moderation.\n" +
         "Approved code will be published on the website." ) == false ) return;

  // Let's submit it
  xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function() {
    if( xmlhttp.readyState==4 && xmlhttp.status==200 ) {
      message( "-- Thank you for sharing your code with other 6502asm.com users." );
      message( "-- Your code has been submitted for moderation." );
      message( "-- Once approved, it will be published on the website." );
      if( xmlhttp.responseText != "" ) {
        alert( "An error occoured while submitting your code.  The error message was:\n" +
               xmlhttp.responseText + "\n" +
               "Please try again later." );
      }
    }
  }
  var code = document.getElementById( "code" ).value;
  var params = "code=" + code;
  xmlhttp.open( "POST", "submit.php", true );
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.setRequestHeader("Content-length", params.length);
  xmlhttp.setRequestHeader("Connection", "close");
  xmlhttp.send( params );
}

/*
 *  hexDump() - Dump binary as hex to new window
 *
 */

function addr2hex( addr ) {
  return num2hex((addr>>8)&0xff)+num2hex(addr&0xff);
}

function num2hex( nr ) {
  str = "0123456789abcdef";
  hi = ((nr&0xf0)>>4);
  lo = (nr&15);
  return str.substring( hi, hi+1  ) + str.substring( lo, lo+1 );
}

function hexdump() {
  w = window.open('', 'hexdump', 'width=500,height=300,resizable=yes,scrollbars=yes,toolbar=no,location=no,menubar=no,status=no' );

  html = "<html><head>";
  html += "<link href='style.css' rel='stylesheet' type='text/css' />";
  html += "<title>hexdump</title></head><body>";
  html += "<code>";
  for( x=0; x<codeLen; x++ ) {
    if( (x&15) == 0 ) {
      html += "<br/> ";
      n = (0x600+x);
      html += num2hex( ((n>>8)&0xff) );
      html += num2hex( (n&0xff) );
      html += ": ";
    }
    html += num2hex( memory[0x600+x] );
    if( x&1 ) html += " ";
  }
  if( (x&1) ) html += "-- [END]";
  html += "</code></body></html>";
  w.document.write( html );
  w.document.close();
}

/*
 *  runBinary() - Executes the compiled code
 *
 */

function runBinary() {
  if( codeRunning ) {
    /* Switch OFF everything */
    codeRunning = false;
    document.getElementById( "runButton" ).value = "Run";
    document.getElementById( "compileButton" ).disabled = false;

    toggleDebug();
    stopDebugger();
    clearInterval( myInterval );
  } else {
    document.getElementById( "runButton" ).value = "Stop";
    codeRunning = true;
    myInterval = setInterval( "multiexecute()", 0.5 );
  }
}

/*
 *  readZeroPage() - Get value from ZP
 *
 */

function jumpBranch( offset ) {
  if( offset > 0x7f )
    regPC = (regPC - (0x100 - offset));
  else
    regPC = (regPC + offset );
}

function doCompare( reg, val ) {
//  if( (reg+val) > 0xff ) regP |= 1; else regP &= 0xfe;
  if( reg>=val ) regP |= 1; else regP &= 0xfe;	// Thanks, "Guest"
  val = (reg-val);
  if( val ) regP &= 0xfd; else regP |= 0x02;
  if( val & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function testSBC( value ) {
  if( (regA ^ value ) & 0x80 )
    vflag = 1;
  else
    vflag = 0;

  if( regP & 8 ) {
    tmp = 0xf + (regA & 0xf) - (value & 0xf) + (regP&1);
    if( tmp < 0x10 ) {
      w = 0;
      tmp -= 6;
    } else {
      w = 0x10;
      tmp -= 0x10;
    }
    w += 0xf0 + (regA & 0xf0) - (value & 0xf0);
    if( w < 0x100 ) {
      regP &= 0xfe;
      if( (regP&0xbf) && w<0x80) regP&=0xbf;
      w -= 0x60;
    } else {
      regP |= 1;
      if( (regP&0xbf) && w>=0x180) regP&=0xbf;
    }
    w += tmp;
  } else {
    w = 0xff + regA - value + (regP&1);
    if( w<0x100 ) {
      regP &= 0xfe;
      if( (regP&0xbf) && w<0x80 ) regP&=0xbf;
    } else {
      regP |= 1;
      if( (regP&0xbf) && w>= 0x180) regP&=0xbf;
    }
  }
  regA = w & 0xff;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function testADC( value ) {
  if( (regA ^ value) & 0x80 ) {
    regP &= 0xbf;
  } else {
    regP |= 0x40;
  }

  if( regP & 8 ) {
    tmp = (regA & 0xf) + (value & 0xf) + (regP&1);
    if( tmp >= 10 ) {
      tmp = 0x10 | ((tmp+6)&0xf);
    }
    tmp += (regA & 0xf0) + (value & 0xf0);
    if( tmp >= 160) {
      regP |= 1;
      if( (regP&0xbf) && tmp >= 0x180 ) regP &= 0xbf;
      tmp += 0x60;
    } else {
      regP &= 0xfe;
      if( (regP&0xbf) && tmp<0x80 ) regP &= 0xbf;
    }
  } else {
    tmp = regA + value + (regP&1);
    if( tmp >= 0x100 ) {
      regP |= 1;
      if( (regP&0xbf) && tmp>=0x180) regP &= 0xbf;
    } else {
      regP &= 0xfe;
      if( (regP&0xbf) && tmp<0x80) regP &= 0xbf;
    }
  }
  regA = tmp & 0xff;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function multiexecute() {
  if( ! debug )
  for( var w=0; w<64; w++ ) {
	execute();
	execute();
  }
}

/*
 *  execute() - Executes one instruction.
 *              This is the main part of the CPU emulator.
 *
 */

function execute() {
  if( ! codeRunning ) return;

  memory[0xfe]=Math.floor( Math.random()*256 );
  instructions[popByte()]();

  if( (regPC == 0) || (!codeRunning) ) {
    clearInterval( myInterval );
    message( "Program end at PC=$" + addr2hex( regPC-1 ) );
    codeRunning = false;
    document.getElementById( "runButton" ).value = "Run";
  }
}

/*
 *  updatePixelDisplay() - Updates the display at one pixel position
 *
 */

function updateDisplayPixel( addr ) {
  display.setAddrPixel(addr-0x200, palette[memory[addr] & 0x0f]);
}


/*
 *  updateDisplayFull() - Simply redraws the entire display according to memory
 *  The colors are supposed to be identical with the C64's palette.
 *
 */

function updateDisplayFull() {
  for( y=0; y<32; y++ ) {
    for( x=0; x<32; x++ ) {
      updateDisplayPixel( ((y<<5)+x) + 0x200 );
    }
  }
}
