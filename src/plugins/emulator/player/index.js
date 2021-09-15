import instructions from './instructions.js';

export default class Player {
  codeRunning = false;
  defaultCodePC = 0x600;
  // Registers
  regA = 0;
  regX = 0;
  regY = 0;
  regP = 0;
  regPC = 0x600;
  regSP = 0x100;

  setCode(compiledCode) {
    this.regPC = compiledCode.regPC;
    this.defaultCodePC = compiledCode.defaultCodePC;
    this.memory = [...compiledCode.memory];

    this.regA = this.regX = this.regY = 0;
    this.regSP = 0x100;
    this.regP = 0x20;
  }

  execute() {
    if(!this.codeRunning) {
      return false;
    }
    
    this.memory[0xfe] = Math.floor(Math.random() * 256);
    const opcode = this.popByte()
    instructions[opcode].call(this, opcode);

    if (this.regPC === 0 || !this.codeRunning) {
      console.log( "Program end at PC=$" + ( this.regPC-1 ) );
      this.codeRunning = false;
      return false
    }

    return true;
  }

  // Memory
  popByte () {
    return this.memory[this.regPC++] & 0xff;
  }

  popWord() {
    return this.popByte() + (this.popByte() << 8);
  }

  memStoreByte( addr, value ) {
    this.memory[ addr ] = (value & 0xff);
    if( (addr >= 0x200) && (addr<=0x5ff) ) 
      this.display.setRawAddrPixel(addr-0x200, this.memory[addr] & 0x0f);
  }

  // stack
  stackPush( value ) {
    if( this.regSP >= 0 ) {
      this.regSP--;
      this.memory[(this.regSP&0xff)+0x100] = value & 0xff;
    } else {
      console.error( "Stack full: " + this.regSP );
      this.codeRunning = false;
    }
  }

  stackPop() {
    if( this.regSP < 0x100 ) {
      const value = this.memory[this.regSP+0x100];
      this.regSP++;
      return value;
    } else {
      console.error( "Stack empty" );
      this.codeRunning = false;
      return 0;
    }
  }

  // utils
  doCompare( reg, val ) {
    //  if( (reg+val) > 0xff ) regP |= 1; else regP &= 0xfe;
      if( reg>=val ) this.regP |= 1; else this.regP &= 0xfe;	// Thanks, "Guest"
      val = (reg-val);
      if( val ) this.regP &= 0xfd; else this.regP |= 0x02;
      if( val & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
    }

  jumpBranch(offset) {
    this.regPC = offset > 0x7f ? (this.regPC - (0x100 - offset)) : (this.regPC + offset );
  }

  testADC( value ) {
    if( (this.regA ^ value) & 0x80 ) {
      this.regP &= 0xbf;
    } else {
      this.regP |= 0x40;
    }
  
    let tmp;
    if( this.regP & 8 ) {
      tmp = (this.regA & 0xf) + (value & 0xf) + (this.regP&1);
      if( tmp >= 10 ) {
        tmp = 0x10 | ((tmp+6)&0xf);
      }
      tmp += (this.regA & 0xf0) + (value & 0xf0);
      if( tmp >= 160) {
        this.regP |= 1;
        if( (this.regP&0xbf) && tmp >= 0x180 ) this.regP &= 0xbf;
        tmp += 0x60;
      } else {
        this.regP &= 0xfe;
        if( (this.regP&0xbf) && tmp<0x80 ) this.regP &= 0xbf;
      }
    } else {
      tmp = this.regA + value + (this.regP&1);
      if( tmp >= 0x100 ) {
        this.regP |= 1;
        if( (this.regP&0xbf) && tmp>=0x180) this.regP &= 0xbf;
      } else {
        this.regP &= 0xfe;
        if( (this.regP&0xbf) && tmp<0x80) this.regP &= 0xbf;
      }
    }
    this.regA = tmp & 0xff;
    if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
    if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
  }

testSBC( value ) {
  // let vflag;
  /*if( (this.regA ^ value ) & 0x80 )
    vflag = 1;
  else
    vflag = 0;*/

    let tmp;
    let w;
  if( this.regP & 8 ) {
    tmp = 0xf + (this.regA & 0xf) - (value & 0xf) + (this.regP&1);
    if( tmp < 0x10 ) {
      w = 0;
      tmp -= 6;
    } else {
      w = 0x10;
      tmp -= 0x10;
    }
    w += 0xf0 + (this.regA & 0xf0) - (value & 0xf0);
    if( w < 0x100 ) {
      this.regP &= 0xfe;
      if( (this.regP&0xbf) && w<0x80) this.regP&=0xbf;
      w -= 0x60;
    } else {
      this.regP |= 1;
      if( (this.regP&0xbf) && w>=0x180) this.regP&=0xbf;
    }
    w += tmp;
  } else {
    w = 0xff + this.regA - value + (this.regP&1);
    if( w<0x100 ) {
      this.regP &= 0xfe;
      if( (this.regP&0xbf) && w<0x80 ) this.regP&=0xbf;
    } else {
      this.regP |= 1;
      if( (this.regP&0xbf) && w>= 0x180) this.regP&=0xbf;
    }
  }
  this.regA = w & 0xff;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}
}