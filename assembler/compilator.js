export class CompilerError extends Error {
  constructor(msg, lineNumber) {
    super(msg);
    this.lineNumber = lineNumber;
  }
}

export default class Compiler {
  success = true;
  defaultCodePC = 0x600;
  regA = 0;
  regX = 0;
  regY = 0;
  regP = 0;
  regPC = 0x600;
  regSP = 0x100;

  compile (code) {
    this.success = true;
    const lines = code.split('\n');

    // Index labels.
    const labelIndex = [];
    const labelPtr = 0;
        
    message('Индексакция меток...');
    this.defaultCodePC = regPC = 0x600;
    lines.forEach(v => {
      console.log(v);
      if (!this.indexLabels(v)) {
        throw new CompilerError(`Метка уже существует.`);
        return false;
      }
    });
  }
}