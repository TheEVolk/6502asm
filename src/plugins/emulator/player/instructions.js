import { num2hex } from '../util.js';

function i00() {
  this.codeRunning = false;
}

function i01() {
  const addr = this.popByte() + this.regX;
  const value = this.memory[addr] + (this.memory[addr+1] << 8);
  this.regA |= value;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i05() {
  const zp = this.popByte();
  this.regA |= this.memory[zp];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i06() {
  const zp = this.popByte();
  let value = this.memory[zp];
  this.regP = (this.regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  this.memStoreByte( zp, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i08() {
  this.stackPush( this.regP );
}

function i09() {
  this.regA |= this.popByte();
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i0a() {
  this.regP = (this.regP & 0xfe) | ((this.regA>>7)&1);
  this.regA = this.regA<<1;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i0d() {
  this.regA |= this.memory[this.popWord()];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i0e() {
  const addr = this.popWord();
  let value = this.memory[addr];
  this.regP = (this.regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 2;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i10() {
  const offset = this.popByte();
  if( (this.regP & 0x80) == 0 ) this.jumpBranch( offset );
}

function i11() {
  const zp = this.popByte();
  const value = this.memory[zp] + (this.memory[zp+1]<<8) + this.regY;
  this.regA |= this.memory[value];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i15() {
  const addr = (this.popByte() + this.regX) & 0xff;
  this.regA |= this.memory[addr];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i16() {
  const addr = (this.popByte() + this.regX) & 0xff;
  let value = this.memory[addr];
  this.regP = (this.regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i18() {
  this.regP &= 0xfe;
}

function i19() {
  const addr = this.popWord() + this.regY;
  this.regA |= this.memory[addr];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i1d() {
  const addr = this.popWord() + this.regX;
  this.regA |= this.memory[addr];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i1e() {
  const addr = this.popWord() + this.regX;
  let value = this.memory[addr];
  this.regP = (this.regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i20() {
  const addr = this.popWord();
  const currAddr = this.regPC-1;
  this.stackPush( ((currAddr >> 8) & 0xff) );
  this.stackPush( (currAddr & 0xff) );
  this.regPC = addr;
}

function i21() {
  const addr = (this.popByte() + this.regX)&0xff;
  const value = this.memory[addr]+(this.memory[addr+1] << 8);
  this.regA &= value;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i24() {
  const zp = this.popByte();
  const value = this.memory[zp];
  if( value & this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  this.regP = (this.regP & 0x3f) | (value & 0xc0);
}

function i25() {
  const zp = this.popByte();
  this.regA &= this.memory[zp];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 2;
  if( this.regA & 0x80 ) this.regP &= 0x80; else this.regP &= 0x7f;
}

function i26() {
  const sf = (this.regP & 1);
  const addr = this.popByte();
  let value = this.memory[addr]; //  & this.regA;  -- Thanks DMSC ;)
  this.regP = (this.regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  value |= sf;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i28() {
  this.regP = this.stackPop() | 0x20;
}

function i29() {
  this.regA &= this.popByte();
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i2a() {
  const sf = (this.regP&1);
  this.regP = (this.regP&0xfe) | ((this.regA>>7)&1);
  this.regA = this.regA << 1;
  this.regA |= sf;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i2c() {
  const value = this.memory[this.popWord()];
  if( value & this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  this.regP = (this.regP & 0x3f) | (value & 0xc0);
}

function i2d() {
  const value = this.memory[this.popWord()];
  this.regA &= value;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i2e() {
  const sf = this.regP & 1;
  const addr = this.popWord();
  let value = this.memory[addr];
  this.regP = (this.regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  value |= sf;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i30() {
  const offset = this.popByte();
  if( this.regP & 0x80 ) this.jumpBranch( offset );
}

function i31() {
  const zp = this.popByte();
  const value = this.memory[zp]+(this.memory[zp+1]<<8) + this.regY;
  this.regA &= this.memory[value];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i35() {
  const zp = this.popByte();
  const value = this.memory[zp]+(this.memory[zp+1]<<8) + this.regX;
  this.regA &= this.memory[value];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i36() {
  const sf = this.regP & 1;
  const addr = (this.popByte() + this.regX) & 0xff;
  let value = this.memory[addr];
  this.regP = (this.regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  value |= sf;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i38() {
  this.regP |= 1;
}

function i39() {
  const addr = this.popWord() + this.regY;
  const value = this.memory[addr];
  this.regA &= value;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i3d() {
  const addr = this.popWord() + this.regX;
  const value = this.memory[addr];
  this.regA &= value;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i3e() {
  const sf = this.regP&1;
  const addr = this.popWord() + this.regX;
  let value = this.memory[addr];
  this.regP = (this.regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  value |= sf;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i40() {
}

function i41() {
  const zp = (this.popByte() + this.regX)&0xff;
  const value = this.memory[zp]+ (this.memory[zp+1]<<8);
  this.regA ^= this.memory[value];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i45() {
  const addr = (this.popByte() + this.regX) & 0xff;
  const value = this.memory[addr];
  this.regA ^= value;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i46() {
  const addr = this.popByte() & 0xff;
  let value = this.memory[addr];
  this.regP = (this.regP & 0xfe) | (value&1);
  value = value >> 1;
  this.memStoreByte( addr, value );
  if( value != 0 ) this.regP &= 0xfd; else this.regP |= 2;
  if( (value&0x80) == 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i48() {
  this.stackPush( this.regA );
}

function i49() {
  this.regA ^= this.popByte();
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i4a() {
  this.regP = (this.regP&0xfe) | (this.regA&1);
  this.regA = this.regA >> 1;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i4c() {
  this.regPC = this.popWord();
}

function i4d() {
  const addr = this.popWord();
  const value = this.memory[addr];
  this.regA ^= value;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i4e() {
  const addr = this.popWord();
  let value = this.memory[addr];
  this.regP = (this.regP&0xfe)|(value&1);
  value = value >> 1;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i50() {
  const offset = this.popByte();
  if( (this.regP & 0x40) == 0 ) this.jumpBranch( offset );
}

function i51() {
  const zp = this.popByte();
  const value = this.memory[zp] + (this.memory[zp+1]<<8) + this.regY;
  this.regA ^= this.memory[value];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i55() {
  const addr = (this.popByte() + this.regX) & 0xff;
  this.regA ^= this.memory[ addr ];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i56() {
  const addr = (this.popByte() + this.regX) & 0xff;
  let value = this.memory[ addr ];
  this.regP = (this.regP&0xfe) | (value&1);
  value = value >> 1;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i58() {
}

function i59() {
  const addr = this.popWord() + this.regY;
  const value = this.memory[ addr ];
  this.regA ^= value;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i5d() {
  const addr = this.popWord() + this.regX;
  const value = this.memory[ addr ];
  this.regA ^= value;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i5e() {
  const addr = this.popWord() + this.regX;
  let value = this.memory[ addr ];
  this.regP = (this.regP&0xfe) | (value&1);
  value = value >> 1;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i60() {
  this.regPC = (this.stackPop()+1) | (this.stackPop()<<8);
}

function i61() {
  const zp = (this.popByte() + this.regX)&0xff;
  const addr = this.memory[zp] + (this.memory[zp+1]<<8);
  const value = this.memory[ addr ];
  this.testADC( value );
}

function i65() {
  const addr = this.popByte();
  const value = this.memory[ addr ];
  this.testADC( value );
}

function i66() {
  const sf = this.regP&1;
  const addr = this.popByte();
  let value = this.memory[ addr ];
  this.regP = (this.regP&0xfe)|(value&1);
  value = value >> 1;
  if( sf ) value |= 0x80;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i68() {
  this.regA = this.stackPop();
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i69() {
  const value = this.popByte();
  this.testADC( value );
}

function i6a() {
  const sf = this.regP&1;
  this.regP = (this.regP&0xfe) | (this.regA&1);
  this.regA = this.regA >> 1;
  if( sf ) this.regA |= 0x80;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i6c() {
}

function i6d() {
  const addr = this.popWord();
  const value = this.memory[ addr ];
  this.testADC( value );
}

function i6e() {
  const sf = this.regP&1;
  const addr = this.popWord();
  let value = this.memory[ addr ];
  this.regP = (this.regP&0xfe)|(value&1);
  value = value >> 1;
  if( sf ) value |= 0x80;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i70() {
  const offset = this.popByte();
  if( this.regP & 0x40 ) this.jumpBranch( offset );
}

function i71() {
  const zp = this.popByte();
  const addr = this.memory[zp] + (this.memory[zp+1]<<8);
  const value = this.memory[ addr + this.regY ];
  this.testADC( value );
}

function i75() {
  const addr = (this.popByte() + this.regX) & 0xff;
  const value = this.memory[ addr ];
  this.regP = (this.regP&0xfe) | (value&1);
  this.testADC( value );
}

function i76() {
  const sf = (this.regP&1);
  const addr = (this.popByte() + this.regX) & 0xff;
  let value = this.memory[ addr ];
  this.regP = (this.regP&0xfe) | (value&1);
  value = value >> 1;
  if( sf ) value |= 0x80;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i78() {
}

function i79() {
  const addr = this.popWord();
  const value = this.memory[ addr + this.regY ];
  this.testADC( value );
}

function i7d() {
  const addr = this.popWord();
  const value = this.memory[ addr + this.regX ];
  this.testADC( value );
}

function i7e() {
  // const sf = this.regP&1;
  const addr = this.popWord() + this.regX;
  let value = this.memory[ addr ];
  this.regP = (this.regP&0xfe) | (value&1);
  value = value >> 1;
  if( value ) value |= 0x80;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i81() {
  const zp = (this.popByte()+this.regX)&0xff;
  const addr = this.memory[zp] + (this.memory[zp+1]<<8);
  this.memStoreByte( addr, this.regA );
}

function i84() {
  this.memStoreByte( this.popByte(), this.regY );
}

function i85() {
  this.memStoreByte( this.popByte(), this.regA );
}

function i86() {
  this.memStoreByte( this.popByte(), this.regX );
}

function i88() {
  this.regY = (this.regY-1) & 0xff;
  if( this.regY ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regY & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i8a() {
  this.regA = this.regX & 0xff;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i8c() {
  this.memStoreByte( this.popWord(), this.regY );
}

function i8d() {
  this.memStoreByte( this.popWord(), this.regA );
}

function i8e() {
  this.memStoreByte( this.popWord(), this.regX );
}

function i90() {
  const offset = this.popByte();
  if( ( this.regP & 1 ) == 0 ) this.jumpBranch( offset );
}

function i91() {
  const zp = this.popByte();
  const addr = this.memory[zp] + (this.memory[zp+1]<<8) + this.regY;
  this.memStoreByte( addr, this.regA );
}

function i94() {
  this.memStoreByte( this.popByte() + this.regX, this.regY );
}

function i95() {
  this.memStoreByte( this.popByte() + this.regX, this.regA );
}

function i96() {
  this.memStoreByte( this.popByte() + this.regY, this.regX );
}

function i98() {
  this.regA = this.regY & 0xff;
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function i99() {
  this.memStoreByte( this.popWord() + this.regY, this.regA );
}

function i9a() {
  this.regSP = this.regX & 0xff;
}

function i9d() {
  const addr = this.popWord();
  this.memStoreByte( addr + this.regX, this.regA );
}

function ia0() {
  this.regY = this.popByte();
  if( this.regY ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regY & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ia1() {
  const zp = (this.popByte()+this.regX)&0xff;
  const addr = this.memory[zp] + (this.memory[zp+1]<<8);
  this.regA = this.memory[ addr ];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ia2() {
  this.regX = this.popByte();
  if( this.regX ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regX & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ia4() {
  this.regY = this.memory[ this.popByte() ];
  if( this.regY ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regY & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ia5() {
  this.regA = this.memory[ this.popByte() ];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ia6() {
  this.regX = this.memory[ this.popByte() ];
  if( this.regX ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regX & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ia8() {
  this.regY = this.regA & 0xff;
  if( this.regY ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regY & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ia9() {
  this.regA = this.popByte();
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function iaa() {
  this.regX = this.regA & 0xff;
  if( this.regX ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regX & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function iac() {
  this.regY = this.memory[ this.popWord() ];
  if( this.regY ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regY & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function iad() {
  this.regA = this.memory[ this.popWord() ];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function iae() {
  this.regX = this.memory[ this.popWord() ];
  if( this.regX ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regX & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ib0() {
  const offset = this.popByte();
  if( this.regP & 1 ) this.jumpBranch( offset );
}

function ib1() {
  const zp = this.popByte();
  const addr = this.memory[zp] + (this.memory[zp+1]<<8) + this.regY;
  this.regA = this.memory[ addr ];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ib4() {
  this.regY = this.memory[ this.popByte() + this.regX ];
  if( this.regY ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regY & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ib5() {
  this.regA = this.memory[ (this.popByte() + this.regX) & 0xff ];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ib6() {
  this.regX = this.memory[ this.popByte() + this.regY ];
  if( this.regX ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regX & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ib8() {
  this.regP &= 0xbf;
}

function ib9() {
  const addr = this.popWord() + this.regY;
  this.regA = this.memory[ addr ];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function iba() {
  this.regX = this.regSP & 0xff;
}

function ibc() {
  const addr = this.popWord() + this.regX;
  this.regY = this.memory[ addr ];
  if( this.regY ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regY & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ibd() {
  const addr = this.popWord() + this.regX;
  this.regA = this.memory[ addr ];
  if( this.regA ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regA & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ibe() {
  const addr = this.popWord() + this.regY;
  this.regX = this.memory[ addr ];
  if( this.regX ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regX & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ic0() {
  let value = this.popByte();
  if( (this.regY+value) > 0xff ) this.regP |= 1; else this.regP &= 0xfe;
  // const ov = value;
  value = (this.regY-value);
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ic1() {
  const zp = this.popByte();
  const addr = this.memory[zp] + (this.memory[zp+1]<<8) + this.regY;
  const value = this.memory[ addr ];
  this.doCompare( this.regA, value );
}

function ic4() {
  const value = this.memory[ this.popByte() ];
  this.doCompare( this.regY, value );
}

function ic5() {
  const value = this.memory[ this.popByte() ];
  this.doCompare( this.regA, value );
}

function ic6() {
  const zp = this.popByte();
  let value = this.memory[ zp ];
  --value;
  this.memStoreByte( zp, value&0xff );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ic8() {
  this.regY = (this.regY + 1) & 0xff;
  if( this.regY ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regY & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ic9() {
  const value = this.popByte();
  this.doCompare( this.regA, value );
}

function ica() {
  this.regX = (this.regX-1) & 0xff;
  if( this.regX ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regX & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function icc() {
  const value = this.memory[ this.popWord() ];
  this.doCompare( this.regY, value );
}

function icd() {
  const value = this.memory[ this.popWord() ];
  this.doCompare( this.regA, value );
}

function ice() {
  const addr = this.popWord();
  let value = this.memory[ addr ];
  --value;
  value = value&0xff;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function id0() {
  const offset = this.popByte();
  if( (this.regP&2)==0 ) this.jumpBranch( offset );
}

function id1() {
  const zp = this.popByte();
  const addr = this.memory[zp] + (this.memory[zp+1]<<8) + this.regY;
  const value = this.memory[ addr ];
  this.doCompare( this.regA, value );
}

function id5() {
  const value = this.memory[ this.popByte() + this.regX ];
  this.doCompare( this.regA, value );
}

function id6() {
  const addr = this.popByte() + this.regX;
  let value = this.memory[ addr ];
  --value;
  value = value&0xff;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function id8() {
  this.regP &= 0xf7;
}

function id9() {
  const addr = this.popWord() + this.regY;
  const value = this.memory[ addr ];
  this.doCompare( this.regA, value );
}

function idd() {
  const addr = this.popWord() + this.regX;
  const value = this.memory[ addr ];
  this.doCompare( this.regA, value );
}

function ide() {
  const addr = this.popWord() + this.regX;
  let value = this.memory[ addr ];
  --value;
  value = value&0xff;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ie0() {
  const value = this.popByte();
  this.doCompare( this.regX, value );
}

function ie1() {
  const zp = (this.popByte()+this.regX)&0xff;
  const addr = this.memory[zp] + (this.memory[zp+1]<<8);
  const value = this.memory[ addr ];
  this.testSBC( value );
}

function ie4() {
  const value = this.memory[ this.popByte() ];
  this.doCompare( this.regX, value );
}

function ie5() {
  const addr = this.popByte();
  const value = this.memory[ addr ];
  this.testSBC( value );
}

function ie6() {
  const zp = this.popByte();
  let value = this.memory[ zp ];
  ++value;
  value = (value)&0xff;
  this.memStoreByte( zp, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ie8() {
  this.regX = (this.regX + 1) & 0xff;
  if( this.regX ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( this.regX & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ie9() {
  const value = this.popByte();
  this.testSBC( value );
}

function iea() {
}

function iec() {
  const value = this.memory[ this.popWord() ];
  this.doCompare( this.regX, value );
}

function ied() {
  const addr = this.popWord();
  const value = this.memory[ addr ];
  this.testSBC( value );
}

function iee() {
  const addr = this.popWord();
  let value = this.memory[ addr ];
  ++value;
  value = (value)&0xff;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function if0() {
  const offset = this.popByte();
  if( this.regP&2 ) this.jumpBranch( offset );
}

function if1() {
  const zp = this.popByte();
  const addr = this.memory[zp] + (this.memory[zp+1]<<8);
  const value = this.memory[ addr + this.regY ];
  this.testSBC( value );
}

function if5() {
  const addr = (this.popByte() + this.regX)&0xff;
  const value = this.memory[ addr ];
  this.regP = (this.regP&0xfe)|(value&1);
  this.testSBC( value );
}

function if6() {
  const addr = this.popByte() + this.regX;
  let value = this.memory[ addr ];
  ++value;
  value=value&0xff;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function if8() {
  this.regP |= 8;
}

function if9() {
  const addr = this.popWord();
  const value = this.memory[ addr + this.regY ];
  this.testSBC( value );
}

function ifd() {
  const addr = this.popWord();
  const value = this.memory[ addr + this.regX ];
  this.testSBC( value );
}

function ife() {
  const addr = this.popWord() + this.regX;
  let value = this.memory[ addr ];
  ++value;
  value=value&0xff;
  this.memStoreByte( addr, value );
  if( value ) this.regP &= 0xfd; else this.regP |= 0x02;
  if( value & 0x80 ) this.regP |= 0x80; else this.regP &= 0x7f;
}

function ierr(opcode) {
  console.error( "Address $" + this.regPC + " - unknown opcode " + num2hex(opcode) );
  this.codeRunning = false;
}

const instructions = [
  i00,	//00
  i01,	//01
  ierr,	//02
  ierr,	//03
  ierr,	//04
  i05,	//05
  i06,	//06
  ierr,	//07
  i08,	//08
  i09,	//09
  i0a,	//0a
  ierr,	//0b
  ierr,	//0c
  i0d,	//0d
  i0e,	//0e
  ierr,	//0f
  i10,	//10
  i11,	//11
  ierr,	//12
  ierr,	//13
  ierr,	//14
  i15,	//15
  i16,	//16
  ierr,	//17
  i18,	//18
  i19,	//19
  ierr,	//1a
  ierr,	//1b
  ierr,	//1c
  i1d,	//1d
  i1e,	//1e
  ierr,	//1f
  i20,	//20
  i21,	//21
  ierr,	//22
  ierr,	//23
  i24,	//24
  i25,	//25
  i26,	//26
  ierr,	//27
  i28,	//28
  i29,	//29
  i2a,	//2a
  ierr,	//2b
  i2c,	//2c
  i2d,	//2d
  i2e,	//2e
  ierr,	//2f
  i30,	//30
  i31,	//31
  ierr,	//32
  ierr,	//33
  ierr,	//34
  i35,	//35
  i36,	//36
  ierr,	//37
  i38,	//38
  i39,	//39
  ierr,	//3a
  ierr,	//3b
  ierr,	//3c
  i3d,	//3d
  i3e,	//3e
  ierr,	//3f
  i40,	//40
  i41,	//41
  ierr,	//42
  ierr,	//43
  ierr,	//44
  i45,	//45
  i46,	//46
  ierr,	//47
  i48,	//48
  i49,	//49
  i4a,	//4a
  ierr,	//4b
  i4c,	//4c
  i4d,	//4d
  i4e,	//4e
  ierr,	//4f
  i50,	//50
  i51,	//51
  ierr,	//52
  ierr,	//53
  ierr,	//54
  i55,	//55
  i56,	//56
  ierr,	//57
  i58,	//58
  i59,	//59
  ierr,	//5a
  ierr,	//5b
  ierr,	//5c
  i5d,	//5d
  i5e,	//5e
  ierr,	//5f
  i60,	//60
  i61,	//61
  ierr,	//62
  ierr,	//63
  ierr,	//64
  i65,	//65
  i66,	//66
  ierr,	//67
  i68,	//68
  i69,	//69
  i6a,	//6a
  ierr,	//6b
  i6c,	//6c
  i6d,	//6d
  i6e,	//6e
  ierr,	//6f
  i70,	//70
  i71,	//71
  ierr,	//72
  ierr,	//73
  ierr,	//74
  i75,	//75
  i76,	//76
  ierr,	//77
  i78,	//78
  i79,	//79
  ierr,	//7a
  ierr,	//7b
  ierr,	//7c
  i7d,	//7d
  i7e,	//7e
  ierr,	//7f
  ierr,	//80
  i81,	//81
  ierr,	//82
  ierr,	//83
  i84,	//84
  i85,	//85
  i86,	//86
  ierr,	//87
  i88,	//88
  ierr,	//89
  i8a,	//8a
  ierr,	//8b
  i8c,	//8c
  i8d,	//8d
  i8e,	//8e
  ierr,	//8f
  i90,	//90
  i91,	//91
  ierr,	//92
  ierr,	//93
  i94,	//94
  i95,	//95
  i96,	//96
  ierr,	//97
  i98,	//98
  i99,	//99
  i9a,	//9a
  ierr,	//9b
  ierr,	//9c
  i9d,	//9d
  ierr,	//9e
  ierr,	//9f
  ia0,	//a0
  ia1,	//a1
  ia2,	//a2
  ierr,	//a3
  ia4,	//a4
  ia5,	//a5
  ia6,	//a6
  ierr,	//a7
  ia8,	//a8
  ia9,	//a9
  iaa,	//aa
  ierr,	//ab
  iac,	//ac
  iad,	//ad
  iae,	//ae
  ierr,	//af
  ib0,	//b0
  ib1,	//b1
  ierr,	//b2
  ierr,	//b3
  ib4,	//b4
  ib5,	//b5
  ib6,	//b6
  ierr,	//b7
  ib8,	//b8
  ib9,	//b9
  iba,	//ba
  ierr,	//bb
  ibc,	//bc
  ibd,	//bd
  ibe,	//be
  ierr,	//bf
  ic0,	//c0
  ic1,	//c1
  ierr,	//c2
  ierr,	//c3
  ic4,	//c4
  ic5,	//c5
  ic6,	//c6
  ierr,	//c7
  ic8,	//c8
  ic9,	//c9
  ica,	//ca
  ierr,	//cb
  icc,	//cc
  icd,	//cd
  ice,	//ce
  ierr,	//cf
  id0,	//d0
  id1,	//d1
  ierr,	//d2
  ierr,	//d3
  ierr,	//d4
  id5,	//d5
  id6,	//d6
  ierr,	//d7
  id8,	//d8
  id9,	//d9
  ierr,	//da
  ierr,	//db
  ierr,	//dc
  idd,	//dd
  ide,	//de
  ierr,	//df
  ie0,	//e0
  ie1,	//e1
  ierr,	//e2
  ierr,	//e3
  ie4,	//e4
  ie5,	//e5
  ie6,	//e6
  ierr,	//e7
  ie8,	//e8
  ie9,	//e9
  iea,	//ea
  ierr,	//eb
  iec,	//ec
  ied,	//ed
  iee,	//ee
  ierr,	//ef
  if0,	//f0
  if1,	//f1
  ierr,	//f2
  ierr,	//f3
  ierr,	//f4
  if5,	//f5
  if6,	//f6
  ierr,	//f7
  if8,	//f8
  if9,	//f9
  ierr,	//fa
  ierr,	//fb
  ierr,	//fc
  ifd,	//fd
  ife,	//fe
  ierr	//ff
];

export default instructions;