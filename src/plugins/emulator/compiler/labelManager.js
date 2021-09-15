import { CompilerError } from './index.js';

export default class LabelManager {
  labels = [];

  constructor(compiler) {
    this.compiler = compiler;
  }

  indexAllLabels(lines) {
    // message('Индексакция меток...');
    this.compiler.defaultCodePC = this.compiler.regPC = 0x600;
    lines.forEach((v, i) => {
      try {
        this.indexLabels(v);
      } catch (e) {
        throw new CompilerError(e.message, i, e.stack);
      }
    });

    console.log(`Найдено меток: ${this.labels.length}.`, this.labels);
  }

  indexLabels(input) {
    this.compiler.thisPC = this.compiler.defaultCodePC;

    this.compiler.codeLen = 0;
    try {
      this.compiler.compileLine(input);
    } catch(e) {
      // Nothing to do
    }

    this.compiler.regPC += this.compiler.codeLen;
  

    if(!input.match(/^\w+:/)) {
      return;
    }
    
    this.push(`${input.replace(/(^\w+):.*$/, '$1')}|${this.compiler.thisPC}`);
  }

  push(name) {
    if(this.labels.includes(`${name}|`)) {
      throw Error(`Метка ${name} уже существует.`);
    }

    this.labels.push(`${name}|`);
  }

  getPC(name) {
    const found = this.find(name);
    return found ? found.split('|')[1] : -1;
  }

  find(name) {
    return this.labels.find(v => v.startsWith(`${name}|`));
  }
}