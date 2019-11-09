function i00() {
  codeRunning = false;
}

function i01() {
  addr = popByte() + regX;
  value = memory[addr] + (memory[addr+1] << 8);
  regA |= value;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i05() {
  zp = popByte();
  regA |= memory[zp];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i06() {
  zp = popByte();
  value = memory[zp];
  regP = (regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  memStoreByte( zp, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i08() {
  stackPush( regP );
}

function i09() {
  regA |= popByte();
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i0a() {
  regP = (regP & 0xfe) | ((regA>>7)&1);
  regA = regA<<1;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i0d() {
  regA |= memory[popWord()];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i0e() {
  addr = popWord();
  value = memory[addr];
  regP = (regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 2;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i10() {
  offset = popByte();
  if( (regP & 0x80) == 0 ) jumpBranch( offset );
}

function i11() {
  zp = popByte();
  value = memory[zp] + (memory[zp+1]<<8) + regY;
  regA |= memory[value];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i15() {
  addr = (popByte() + regX) & 0xff;
  regA |= memory[addr];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i16() {
  addr = (popByte() + regX) & 0xff;
  value = memory[addr];
  regP = (regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i18() {
  regP &= 0xfe;
}

function i19() {
  addr = popWord() + regY;
  regA |= memory[addr];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i1d() {
  addr = popWord() + regX;
  regA |= memory[addr];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i1e() {
  addr = popWord() + regX;
  value = memory[addr];
  regP = (regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i20() {
  addr = popWord();
  currAddr = regPC-1;
  stackPush( ((currAddr >> 8) & 0xff) );
  stackPush( (currAddr & 0xff) );
  regPC = addr;
}

function i21() {
  addr = (popByte() + regX)&0xff;
  value = memory[addr]+(memory[addr+1] << 8);
  regA &= value;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i24() {
  zp = popByte();
  value = memory[zp];
  if( value & regA ) regP &= 0xfd; else regP |= 0x02;
  regP = (regP & 0x3f) | (value & 0xc0);
}

function i25() {
  zp = popByte();
  regA &= memory[zp];
  if( regA ) regP &= 0xfd; else regP |= 2;
  if( regA & 0x80 ) regP &= 0x80; else regP &= 0x7f;
}

function i26() {
  sf = (regP & 1);
  addr = popByte();
  value = memory[addr]; //  & regA;  -- Thanks DMSC ;)
  regP = (regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  value |= sf;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i28() {
  regP = stackPop() | 0x20;
}

function i29() {
  regA &= popByte();
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i2a() {
  sf = (regP&1);
  regP = (regP&0xfe) | ((regA>>7)&1);
  regA = regA << 1;
  regA |= sf;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i2c() {
  value = memory[popWord()];
  if( value & regA ) regP &= 0xfd; else regP |= 0x02;
  regP = (regP & 0x3f) | (value & 0xc0);
}

function i2d() {
  value = memory[popWord()];
  regA &= value;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i2e() {
  sf = regP & 1;
  addr = popWord();
  value = memory[addr];
  regP = (regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  value |= sf;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i30() {
  offset = popByte();
  if( regP & 0x80 ) jumpBranch( offset );
}

function i31() {
  zp = popByte();
  value = memory[zp]+(memory[zp+1]<<8) + regY;
  regA &= memory[value];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i35() {
  zp = popByte();
  value = memory[zp]+(memory[zp+1]<<8) + regX;
  regA &= memory[value];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i36() {
  sf = regP & 1;
  addr = (popByte() + regX) & 0xff;
  value = memory[addr];
  regP = (regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  value |= sf;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i38() {
  regP |= 1;
}

function i39() {
  addr = popWord() + regY;
  value = memory[addr];
  regA &= value;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i3d() {
  addr = popWord() + regX;
  value = memory[addr];
  regA &= value;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i3e() {
  sf = regP&1;
  addr = popWord() + regX;
  value = memory[addr];
  regP = (regP & 0xfe) | ((value>>7)&1);
  value = value << 1;
  value |= sf;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i40() {
}

function i41() {
  zp = (popByte() + regX)&0xff;
  value = memory[zp]+ (memory[zp+1]<<8);
  regA ^= memory[value];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i45() {
  addr = (popByte() + regX) & 0xff;
  value = memory[addr];
  regA ^= value;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i46() {
  addr = popByte() & 0xff;
  value = memory[addr];
  regP = (regP & 0xfe) | (value&1);
  value = value >> 1;
  memStoreByte( addr, value );
  if( value != 0 ) regP &= 0xfd; else regP |= 2;
  if( (value&0x80) == 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i48() {
  stackPush( regA );
}

function i49() {
  regA ^= popByte();
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i4a() {
  regP = (regP&0xfe) | (regA&1);
  regA = regA >> 1;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i4c() {
  regPC = popWord();
}

function i4d() {
  addr = popWord();
  value = memory[addr];
  regA ^= value;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i4e() {
  addr = popWord();
  value = memory[addr];
  regP = (regP&0xfe)|(value&1);
  value = value >> 1;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i50() {
  offset = popByte();
  if( (regP & 0x40) == 0 ) jumpBranch( offset );
}

function i51() {
  zp = popByte();
  value = memory[zp] + (memory[zp+1]<<8) + regY;
  regA ^= memory[value];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i55() {
  addr = (popByte() + regX) & 0xff;
  regA ^= memory[ addr ];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i56() {
  addr = (popByte() + regX) & 0xff;
  value = memory[ addr ];
  regP = (regP&0xfe) | (value&1);
  value = value >> 1;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i58() {
}

function i59() {
  addr = popWord() + regY;
  value = memory[ addr ];
  regA ^= value;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i5d() {
  addr = popWord() + regX;
  value = memory[ addr ];
  regA ^= value;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i5e() {
  addr = popWord() + regX;
  value = memory[ addr ];
  regP = (regP&0xfe) | (value&1);
  value = value >> 1;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i60() {
  regPC = (stackPop()+1) | (stackPop()<<8);
}

function i61() {
  zp = (popByte() + regX)&0xff;
  addr = memory[zp] + (memory[zp+1]<<8);
  value = memory[ addr ];
  testADC( value );
}

function i65() {
  addr = popByte();
  value = memory[ addr ];
  testADC( value );
}

function i66() {
  sf = regP&1;
  addr = popByte();
  value = memory[ addr ];
  regP = (regP&0xfe)|(value&1);
  value = value >> 1;
  if( sf ) value |= 0x80;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i68() {
  regA = stackPop();
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i69() {
  value = popByte();
  testADC( value );
}

function i6a() {
  sf = regP&1;
  regP = (regP&0xfe) | (regA&1);
  regA = regA >> 1;
  if( sf ) regA |= 0x80;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i6c() {
}

function i6d() {
  addr = popWord();
  value = memory[ addr ];
  testADC( value );
}

function i6e() {
  sf = regP&1;
  addr = popWord();
  value = memory[ addr ];
  regP = (regP&0xfe)|(value&1);
  value = value >> 1;
  if( sf ) value |= 0x80;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i70() {
  offset = popByte();
  if( regP & 0x40 ) jumpBranch( offset );
}

function i71() {
  zp = popByte();
  addr = memory[zp] + (memory[zp+1]<<8);
  value = memory[ addr + regY ];
  testADC( value );
}

function i75() {
  addr = (popByte() + regX) & 0xff;
  value = memory[ addr ];
  regP = (regP&0xfe) | (value&1);
  testADC( value );
}

function i76() {
  sf = (regP&1);
  addr = (popByte() + regX) & 0xff;
  value = memory[ addr ];
  regP = (regP&0xfe) | (value&1);
  value = value >> 1;
  if( sf ) value |= 0x80;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i78() {
}

function i79() {
  addr = popWord();
  value = memory[ addr + regY ];
  testADC( value );
}

function i7d() {
  addr = popWord();
  value = memory[ addr + regX ];
  testADC( value );
}

function i7e() {
  sf = regP&1;
  addr = popWord() + regX;
  value = memory[ addr ];
  regP = (regP&0xfe) | (value&1);
  value = value >> 1;
  if( value ) value |= 0x80;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i81() {
  zp = (popByte()+regX)&0xff;
  addr = memory[zp] + (memory[zp+1]<<8);
  memStoreByte( addr, regA );
}

function i84() {
  memStoreByte( popByte(), regY );
}

function i85() {
  memStoreByte( popByte(), regA );
}

function i86() {
  memStoreByte( popByte(), regX );
}

function i88() {
  regY = (regY-1) & 0xff;
  if( regY ) regP &= 0xfd; else regP |= 0x02;
  if( regY & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i8a() {
  regA = regX & 0xff;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i8c() {
  memStoreByte( popWord(), regY );
}

function i8d() {
  memStoreByte( popWord(), regA );
}

function i8e() {
  memStoreByte( popWord(), regX );
}

function i90() {
  offset = popByte();
  if( ( regP & 1 ) == 0 ) jumpBranch( offset );
}

function i91() {
  zp = popByte();
  addr = memory[zp] + (memory[zp+1]<<8) + regY;
  memStoreByte( addr, regA );
}

function i94() {
  memStoreByte( popByte() + regX, regY );
}

function i95() {
  memStoreByte( popByte() + regX, regA );
}

function i96() {
  memStoreByte( popByte() + regY, regX );
}

function i98() {
  regA = regY & 0xff;
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function i99() {
  memStoreByte( popWord() + regY, regA );
}

function i9a() {
  regSP = regX & 0xff;
}

function i9d() {
  addr = popWord();
  memStoreByte( addr + regX, regA );
}

function ia0() {
  regY = popByte();
  if( regY ) regP &= 0xfd; else regP |= 0x02;
  if( regY & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ia1() {
  zp = (popByte()+regX)&0xff;
  addr = memory[zp] + (memory[zp+1]<<8);
  regA = memory[ addr ];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ia2() {
  regX = popByte();
  if( regX ) regP &= 0xfd; else regP |= 0x02;
  if( regX & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ia4() {
  regY = memory[ popByte() ];
  if( regY ) regP &= 0xfd; else regP |= 0x02;
  if( regY & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ia5() {
  regA = memory[ popByte() ];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ia6() {
  regX = memory[ popByte() ];
  if( regX ) regP &= 0xfd; else regP |= 0x02;
  if( regX & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ia8() {
  regY = regA & 0xff;
  if( regY ) regP &= 0xfd; else regP |= 0x02;
  if( regY & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ia9() {
  regA = popByte();
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function iaa() {
  regX = regA & 0xff;
  if( regX ) regP &= 0xfd; else regP |= 0x02;
  if( regX & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function iac() {
  regY = memory[ popWord() ];
  if( regY ) regP &= 0xfd; else regP |= 0x02;
  if( regY & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function iad() {
  regA = memory[ popWord() ];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function iae() {
  regX = memory[ popWord() ];
  if( regX ) regP &= 0xfd; else regP |= 0x02;
  if( regX & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ib0() {
  offset = popByte();
  if( regP & 1 ) jumpBranch( offset );
}

function ib1() {
  zp = popByte();
  addr = memory[zp] + (memory[zp+1]<<8) + regY;
  regA = memory[ addr ];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ib4() {
  regY = memory[ popByte() + regX ];
  if( regY ) regP &= 0xfd; else regP |= 0x02;
  if( regY & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ib5() {
  regA = memory[ (popByte() + regX) & 0xff ];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ib6() {
  regX = memory[ popByte() + regY ];
  if( regX ) regP &= 0xfd; else regP |= 0x02;
  if( regX & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ib8() {
  regP &= 0xbf;
}

function ib9() {
  addr = popWord() + regY;
  regA = memory[ addr ];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function iba() {
  regX = regSP & 0xff;
}

function ibc() {
  addr = popWord() + regX;
  regY = memory[ addr ];
  if( regY ) regP &= 0xfd; else regP |= 0x02;
  if( regY & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ibd() {
  addr = popWord() + regX;
  regA = memory[ addr ];
  if( regA ) regP &= 0xfd; else regP |= 0x02;
  if( regA & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ibe() {
  addr = popWord() + regY;
  regX = memory[ addr ];
  if( regX ) regP &= 0xfd; else regP |= 0x02;
  if( regX & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ic0() {
  value = popByte();
  if( (regY+value) > 0xff ) regP |= 1; else regP &= 0xfe;
  ov = value;
  value = (regY-value);
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ic1() {
  zp = popByte();
  addr = memory[zp] + (memory[zp+1]<<8) + regY;
  value = memory[ addr ];
  doCompare( regA, value );
}

function ic4() {
  value = memory[ popByte() ];
  doCompare( regY, value );
}

function ic5() {
  value = memory[ popByte() ];
  doCompare( regA, value );
}

function ic6() {
  zp = popByte();
  value = memory[ zp ];
  --value;
  memStoreByte( zp, value&0xff );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ic8() {
  regY = (regY + 1) & 0xff;
  if( regY ) regP &= 0xfd; else regP |= 0x02;
  if( regY & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ic9() {
  value = popByte();
  doCompare( regA, value );
}

function ica() {
  regX = (regX-1) & 0xff;
  if( regX ) regP &= 0xfd; else regP |= 0x02;
  if( regX & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function icc() {
  value = memory[ popWord() ];
  doCompare( regY, value );
}

function icd() {
  value = memory[ popWord() ];
  doCompare( regA, value );
}

function ice() {
  addr = popWord();
  value = memory[ addr ];
  --value;
  value = value&0xff;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function id0() {
  offset = popByte();
  if( (regP&2)==0 ) jumpBranch( offset );
}

function id1() {
  zp = popByte();
  addr = memory[zp] + (memory[zp+1]<<8) + regY;
  value = memory[ addr ];
  doCompare( regA, value );
}

function id5() {
  value = memory[ popByte() + regX ];
  doCompare( regA, value );
}

function id6() {
  addr = popByte() + regX;
  value = memory[ addr ];
  --value;
  value = value&0xff;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function id8() {
  regP &= 0xf7;
}

function id9() {
  addr = popWord() + regY;
  value = memory[ addr ];
  doCompare( regA, value );
}

function idd() {
  addr = popWord() + regX;
  value = memory[ addr ];
  doCompare( regA, value );
}

function ide() {
  addr = popWord() + regX;
  value = memory[ addr ];
  --value;
  value = value&0xff;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ie0() {
  value = popByte();
  doCompare( regX, value );
}

function ie1() {
  zp = (popByte()+regX)&0xff;
  addr = memory[zp] + (memory[zp+1]<<8);
  value = memory[ addr ];
  testSBC( value );
}

function ie4() {
  value = memory[ popByte() ];
  doCompare( regX, value );
}

function ie5() {
  addr = popByte();
  value = memory[ addr ];
  testSBC( value );
}

function ie6() {
  zp = popByte();
  value = memory[ zp ];
  ++value;
  value = (value)&0xff;
  memStoreByte( zp, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ie8() {
  regX = (regX + 1) & 0xff;
  if( regX ) regP &= 0xfd; else regP |= 0x02;
  if( regX & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ie9() {
  value = popByte();
  testSBC( value );
}

function iea() {
}

function iec() {
  value = memory[ popWord() ];
  doCompare( regX, value );
}

function ied() {
  addr = popWord();
  value = memory[ addr ];
  testSBC( value );
}

function iee() {
  addr = popWord();
  value = memory[ addr ];
  ++value;
  value = (value)&0xff;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function if0() {
  offset = popByte();
  if( regP&2 ) jumpBranch( offset );
}

function if1() {
  zp = popByte();
  addr = memory[zp] + (memory[zp+1]<<8);
  value = memory[ addr + regY ];
  testSBC( value );
}

function if5() {
  addr = (popByte() + regX)&0xff;
  value = memory[ addr ];
  regP = (regP&0xfe)|(value&1);
  testSBC( value );
}

function if6() {
  addr = popByte() + regX;
  value = memory[ addr ];
  ++value;
  value=value&0xff;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function if8() {
  regP |= 8;
}

function if9() {
  addr = popWord();
  value = memory[ addr + regY ];
  testSBC( value );
}

function ifd() {
  addr = popWord();
  value = memory[ addr + regX ];
  testSBC( value );
}

function ife() {
  addr = popWord() + regX;
  value = memory[ addr ];
  ++value;
  value=value&0xff;
  memStoreByte( addr, value );
  if( value ) regP &= 0xfd; else regP |= 0x02;
  if( value & 0x80 ) regP |= 0x80; else regP &= 0x7f;
}

function ierr() {
  message( "Address $" + addr2hex(regPC) + " - unknown opcode " + opcode );
  codeRunning = false;
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
  ierr,	//ce
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
