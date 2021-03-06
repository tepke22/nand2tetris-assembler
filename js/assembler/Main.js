class Main{
  constructor(parser, symbol_table, code){
    this.parser=parser;
    this.symbol_table=symbol_table;
    this.code=code;
  }

  assemble(){
    this.finalCode="";
    
    for(let i=0; i<this.parser.lines.length;i++){
      this.parser.advance();
      if(this.parser.error == false){
        if(this.parser.command_type=='L_COMMAND'){
          this.writeLabel(this.parser.symbol, this.parser.current_instruction_number);
        }
      } 
      else{
        alert('\ERROR\n\n' + this.parser.errorMessage);
        return;
      }     
    }
    this.parser.line_number=0;    
    this.parser.current_instruction= this.parser.lines[this.parser.line_number];
    this.parser.current_instruction_number=0;

     for(let i=0; i<this.parser.lines.length;i++){
      this.parser.advance();
      if(this.parser.command_type=='A_COMMAND'){
        this.writeA(this.parser.symbol);
      }
      else if(this.parser.command_type=='C_COMMAND'){
        this.writeC(this.parser.dest,this.parser.comp,this.parser.jump);
      }
    }
    document.getElementById('out-content-target').value=this.finalCode;
  }

    writeLabel(symbol, current_instruction_number){
      let address = this.createAddress(this.parser.current_instruction_number)
      this.symbol_table.addEntry(symbol,address);
    }
  
    createAddress(symbol){
      let address = symbol.toString(2);
      let base =  "0000000000000000";
      base = base.substr(0,base.length-address.length-1);
      return base+address;
    }

    writeA(symbol){
      let instruction="0";
      if(Number.isInteger(Number(symbol))){
        instruction+=this.createAddress(Number(symbol));
      }
      else{
        if(this.symbol_table.contains(symbol) == false){
          let address = this.createAddress(this.symbol_table.nextAvailableRAMAdress);
          this.symbol_table.addEntry(symbol,address);
          this.symbol_table.nextAvailableRAMAdress++;
        }
        instruction+=this.symbol_table.getAddress(symbol);
      }
      this.write(instruction);
    }

    writeC(dest,comp,jump){
      let instruction="111";
      instruction+=this.code.comp(comp);
      instruction+=this.code.dest(dest);
      instruction+=this.code.jump(jump);
      this.write(instruction);
    }

    write(instruction){
      this.finalCode+=instruction+"\n";
    }
  
}

