import LabelManager from './labelManager.js';
import opcodes from './opcodes.js';

export class CompilerError extends Error {
  constructor(msg, lineNumber, stack) {
    super(msg);
    this.lineNumber = lineNumber;
    if (stack) {
      this.stack = stack;
    }
  }
}

export default class Compiler {
  success = true;
  labelManager = new LabelManager(this);
  defines = {};
  memory = new Array( 0x600 );
  codeLen = 0;
  regPC = 0x600;
  defaultCodePC = 0x600;

  reset() {
    this.memory.fill(0x00);
  }

  compile (code) {
    try {
      this.reset();
      const lines = code.split('\n')
        .map(v => v.replace(/^(.*?);.*/, '$1').replace(/^\s+/, '').replace(/\s+$/, ''));

      this.labelManager.indexAllLabels(lines);

      this.defaultCodePC = this.regPC = 0x600;
      // message( "Compiling code.." );

      lines.forEach((v, i) => {
        try {
          if (!this.compileLine(v, i)) {
            throw new CompilerError('Unknown syntax error', i, '');
          }
        } catch (e) {
          throw new CompilerError(e.message, i, e.stack);
        }
      });

      if( this.codeLen == 0 ) {
        console.log('No code to run.');
        return;
      }

      // document.getElementById( "runButton" ).disabled = false;
      // document.getElementById( "compileButton" ).disabled = true;
      this.memory[this.defaultCodePC] = 0x00;

      console.log(`Код успешно скомпилирован: ${this.codeLen} б.`);
      // updateDisplayFull();
      return true;
    } catch (error) {
      if (error instanceof CompilerError) {
        return this.error(error.lineNumber, error.message);
      }

      console.error(error.stack);
      return false;
    }
  }

  compileLine(input) {
    if (input.match(/^\w+:/)) {
      if( input.match(/^\w+:[\s]*\w+.*$/ )) {
        const newInput = input.replace(/^\w+:[\s]*(.*)$/, '$1');
        return this.compileCommand(newInput, newInput.replace(/^(\w+).*$/, '$1'));
      }

      return true;
    }

    return this.compileCommand(input, input.replace(/^(\w+).*$/, '$1'));
  }

  compileCommand(input, rawCommand) {
    if(!rawCommand) {
      return true;
    }

    const command = rawCommand.toUpperCase();
    const tokens = input.split(/ +/);

    if( input.match( /^\*[\s]*=[\s]*[$]?[0-9a-f]*$/ ) ) {
      // equ spotted
      this.param = input.replace( new RegExp( /^[\s]*\*[\s]*=[\s]*/ ), "" );     

      /*if (this.defines[this.param]) {
        console.log(`Found `, [this.param, this.defines[this.param]]);
        this.param = this.defines[this.param];
      }*/
      let addr;
      if( this.param[0] == "$" ) {
        this.param = this.param.replace( new RegExp( /^\$/ ), "" );
        addr = parseInt( this.param, 16 );
      } else {
        addr = parseInt( this.param, 10 );
      }
      if( (addr < 0) || (addr > 0xffff) ) {
        throw Error( "Unable to relocate code outside 64k memory" );
        // return false;
      }
      this.defaultCodePC = addr;
      return true;
    }
  
    if( input.match( /^\w+\s+.*?$/ ) ) {
      this.param = input.replace( new RegExp( /^\w+\s+(.*?)/ ), "$1" );
      /*if (this.defines[this.param]) {
        this.param = this.defines[this.param];
      }*/
    } else {
      if( input.match( /^\w+$/ ) ) {
        this.param = "";
      } else {
        throw Error('Unknown characters');
      }
    }
  
    this.param = this.param.replace( /[ ]/g, "" );
  
    if(command == 'DCB' )
      return this.DCB( this.param );
    
    if (command === 'DEFINE') {
      this.defines[tokens[1]] = tokens[2];
      return true;
    }

    Object.entries(this.defines).forEach(v => this.param = this.param.replace(v[0], v[1]));

    // console.log([this.param, command]);
    const opcode = opcodes.find(v => v[0] === command);
    if (!opcode) {
      throw Error(`Unknown opcode '${command}'`);
    }

    const checkers = [
      this.checkImmediate,
      this.checkZeroPage,
      this.checkZeroPageX,
      this.checkZeroPageY,
      this.checkAbsolute,
      this.checkAbsoluteX,
      this.checkAbsoluteY,
      this.checkIndirectX,
      this.checkIndirectY,
      this.checkSingle,
      this.checkBranch
    ];

    const queue = [11, 1, 2, 3, 4, 6, 7, 8, 9, 10, 5, 12];

    const success = queue.map(v => [checkers[v - 1], v - 1]).find(([v, i]) => opcode[i + 1] !== 0x00 && v.call(this, this.param, opcode[i + 1]));
    if (!success) {
      throw Error('Unknown checker error.');
    }

    return true;
  }

  checkSingle( param, opcode ) {
    if( opcode == 0x00 ) return false;
    if( param != "" ) 
      return false;
      // throw Error('This opcode does not require arguments');
    this.pushByte( opcode );
    return true;
  }

  checkImmediate( param, opcode ) {
    if( opcode == 0x00 ) return false;
    if( param.match( new RegExp( /^#\$[0-9a-f]{1,2}$/i ) ) ) {
      this.pushByte( opcode );
      let value = parseInt( param.replace( /^#\$/, "" ), 16 );
      if( value < 0 || value > 255 ) 
        throw Error('Address outside of memory');
      this.pushByte( value );
      return true;
    }
    if( param.match( new RegExp( /^#[0-9]{1,3}$/i ) ) ) {
      this.pushByte( opcode );
      let value = parseInt( param.replace( /^#/, "" ), 10 );
      if( value < 0 || value > 255 ) 
      throw Error('Address outside of memory');
      this.pushByte( value );
      return true;
    }
    // Label lo/hi
    if( param.match( new RegExp( /^#[<>]\w+$/ ) ) ) {
      let label = param.replace( new RegExp( /^#[<>](\w+)$/ ), "$1" );
      let hilo = param.replace( new RegExp( /^#([<>]).*$/ ), "$1" );
      this.pushByte( opcode );
      if( this.labelManager.find( label ) ) {
        let addr = this.labelManager.getPC( label );
        switch( hilo ) {
          case ">":
            this.pushByte( (addr >> 8) & 0xff );
            return true;
            // break;
          case "<":
            this.pushByte( addr & 0xff );
            return true;
            // break;
          default:
            return false;
            // break;
        }
      } else {
        this.pushByte( 0x00 );
        return true;
      }
    }
    return false;
  }

  checkZeroPage( param, opcode ) {
    if( opcode == 0x00 ) return false;
    if( param.match( /^\$[0-9a-f]{1,2}$/i ) ) {
      this.pushByte( opcode );
      let value = parseInt( param.replace( /^\$/, "" ), 16 );
      if( value < 0 || value > 255 ) return false;
      this.pushByte( value );
      return true;
    }
    if( param.match( /^[0-9]{1,3}$/i ) ) {
      this.pushByte( opcode );
      let value = parseInt( param, 10 );
      if( value < 0 || value > 255 ) return false;
      this.pushByte( value );
      return true;
    }
    return false;
  }

  checkZeroPageX( param, opcode ) {
    if( opcode == 0x00 ) return false;
    if( param.match( /^\$[0-9a-f]{1,2},X/i ) ) {
      this.pushByte( opcode );
      let number = param.replace( new RegExp( /^\$([0-9a-f]{1,2}),X/i ), "$1" );
      let value = parseInt( number, 16 );
      if( value < 0 || value > 255 ) return false;
      this.pushByte( value );
      return true;
    }
    if( param.match( /^[0-9]{1,3},X/i ) ) {
      this.pushByte( opcode );
      let number = param.replace( new RegExp( /^([0-9]{1,3}),X/i ), "$1" );
      let value = parseInt( number, 10 );
      if( value < 0 || value > 255 ) return false;
      this.pushByte( value );
      return true;
    }
    return false;
  }

  checkZeroPageY( param, opcode ) {
    if( opcode == 0x00 ) return false;
    if( param.match( /^\$[0-9a-f]{1,2},Y/i ) ) {
      this.pushByte( opcode );
      let number = param.replace( new RegExp( /^\$([0-9a-f]{1,2}),Y/i ), "$1" );
      let value = parseInt( number, 16 );
      if( value < 0 || value > 255 ) return false;
      this.pushByte( value );
      return true;
    }
    if( param.match( /^[0-9]{1,3},Y/i ) ) {
      this.pushByte( opcode );
      let number = param.replace( new RegExp( /^([0-9]{1,3}),Y/i ), "$1" );
      let value = parseInt( number, 10 );
      if( value < 0 || value > 255 ) return false;
      this.pushByte( value );
      return true;
    }
    return false;
  }

  checkAbsoluteX( param, opcode ) {
    if( opcode == 0x00 ) return false;
    if( param.match( /^\$[0-9a-f]{3,4},X$/i ) ) {
      this.pushByte( opcode );
      let number = param.replace( new RegExp( /^\$([0-9a-f]*),X/i ), "$1" );
      let value = parseInt( number, 16 );
      if( value < 0 || value > 0xffff ) return false;
      this.pushWord( value );
      return true;
    }
  
    if( param.match( /^\w+,X$/i ) ) {
      param = param.replace( new RegExp( /,X$/i ), "" );
      this.pushByte( opcode );
      if( this.labelManager.find( param ) ) {
        let addr = this.labelManager.getPC( param );
        if( addr < 0 || addr > 0xffff ) return false;
        this.pushWord( addr );
        return true;
      } else {
        this.pushWord( 0x1234 );
        return true;
      }
    }
  
    return false;
  }

  checkAbsoluteY( param, opcode ) {
    if( opcode == 0x00 ) return false;
    if( param.match( /^\$[0-9a-f]{3,4},Y$/i ) ) {
      this.pushByte( opcode );
      let number = param.replace( new RegExp( /^\$([0-9a-f]*),Y/i ), "$1" );
      let value = parseInt( number, 16 );
      if( value < 0 || value > 0xffff ) return false;
      this.pushWord( value );
      return true;
    }
  
    // it could be a label too..
  
    if( param.match( /^\w+,Y$/i ) ) {
      param = param.replace( new RegExp( /,Y$/i ), "" );
      this.pushByte( opcode );
      if( this.labelManager.find( param ) ) {
        let addr = this.labelManager.getPC( param );
        if( addr < 0 || addr > 0xffff ) return false;
        this.pushWord( addr );
        return true;
      } else {
        this.pushWord( 0x1234 );
        return true;
      }
    }
    return false;
  }

  checkIndirectX( param, opcode ) {
    if( opcode == 0x00 ) return false;
    if( param.match( /^\(\$[0-9a-f]{1,2},X\)$/i ) ) {
      this.pushByte( opcode );
      let value = param.replace( new RegExp( /^\(\$([0-9a-f]{1,2}).*$/i ), "$1" );
      if( value < 0 || value > 255 ) return false;
      this.pushByte( parseInt( value, 16 ) );
      return true;
    }
    return false;
  }
  
  /*
   * checkIndirectY() - Check if param is indirect Y and push value
   * 
   */
  
  checkIndirectY( param, opcode ) {
    if( opcode == 0x00 ) return false;
    if( param.match( /^\(\$[0-9a-f]{1,2}\),Y$/i ) ) {
      this.pushByte( opcode );
      let value = param.replace( new RegExp( /^\([$]([0-9a-f]{1,2}).*$/i ), "$1" );
      if( value < 0 || value > 255 ) return false;
      this.pushByte( parseInt( value, 16 ) );
      return true;
    }
    return false;
  }

  checkAbsolute( param, opcode ) {
    if( opcode == 0x00 ) return false;
    this.pushByte( opcode );
    if( param.match( /^\$[0-9a-f]{3,4}$/i ) ) {
      let value = parseInt( param.replace( /^\$/, "" ), 16 );
      if( value < 0 || value > 0xffff ) return false;
      this.pushWord( value );
      return true;
    }
    if( param.match( /^[0-9]{1,5}$/i ) ) {  // Thanks, Matt!
      let value = parseInt( param, 10 );
      if( value < 0 || value > 65535 ) return false;
      this.pushWord( value );
      return( true );
    }
    // it could be a label too..
    if( param.match( /^\w+$/ ) ) {
      if( this.labelManager.find( param ) ) {
        let addr = (this.labelManager.getPC( param ));
        if( addr < 0 || addr > 0xffff ) return false;
        this.pushWord( addr );
        return true;
      } else {
        this.pushWord( 0x1234 );
        return true;
      }
    }
    return false;
  }

  DCB( param ) {
    let values = param.split( "," );
    if( values.length == 0 ) return false;
    for(let v=0; v<values.length; v++ ) {
      let str = values[v];
      if( str != undefined && str != null && str.length > 0 ) {
        let ch = str.substring( 0, 1 );
        if( ch == "$" ) {
          let number = parseInt( str.replace( /^\$/, "" ), 16 );
          this.pushByte( number );
        } else if( ch >= "0" && ch <= "9" ) {
          let number = parseInt( str, 10 );
          this.pushByte( number );
        } else {
          return false;
        }
      }
    }
    return true;
  }

  checkBranch( param, opcode ) {
    console.log('brn', param, opcode );
  
    let addr = -1;
    if( param.match( /\w+/ ) )
      addr = this.labelManager.getPC( param );
     // console.log({ addr }, this.labelManager )
    if( addr == -1 ) { this.pushWord( 0x00 ); return false; }
    this.pushByte( opcode );
    if( addr < (this.defaultCodePC-0x600) ) {  // Backwards?
      this.pushByte( (0xff - ((this.defaultCodePC-0x600)-addr)) & 0xff );
      return true;
    }
    this.pushByte( (addr-(this.defaultCodePC-0x600)-1) & 0xff );
    return true;
  }

  pushByte( value ) {
    this.memory[this.defaultCodePC] = value & 0xff;
    //if (this.memory[this.defaultCodePC] != memory[this.defaultCodePC]) {
    //  throw Error( "velue " + this.memory[this.defaultCodePC] + ' != ' + memory[this.defaultCodePC] + ' = ' + this.defaultCodePC);
    //}
    this.defaultCodePC++;
    this.codeLen++;
  }

  pushWord( value ) {
    this.pushByte( value & 0xff );
    this.pushByte( (value>>8) & 0xff );
  }
}
