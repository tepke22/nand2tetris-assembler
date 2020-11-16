class Main{
  constructor(parser, symbol_table, code){
    this.parser=parser;
    this.symbol_table=symbol_table;
    this.code=code;
  }

  assemble(){
    this.finalCode="";
    console.log(this.symbol_table.symbolTable);
    while(this.parser.hasMoreCommands()){
      this.parser.advance();
      if(this.parser.command_type=='L_COMMAND'){
        this.writeLabel(this.parser.symbol, this.parser.current_instruction_number);
      }
    }

    console.log(this.symbol_table.symbolTable);
    this.parser.getFirstInstruction();

     while(this.parser.hasMoreCommands()){
      this.parser.advance();
      if(this.parser.command_type=='A_COMMAND'){
        this.writeA(this.parser.symbol);
      }
      else if(this.parser.command_type=='C_COMMAND'){
        this.writeC(this.parser.dest,this.parser.comp,this.parser.jump);
      }
    }
    document.getElementById('out-content-target').innerHTML=this.finalCode;
  }

    writeLabel(symbol, current_instruction_number){
      let address = this.createAddress(this.parser.current_instruction_number+1)
      this.symbol_table.addEntry(symbol,address);
    }
  
    createAddress(symbol){
      let address = symbol.toString(2);
      console.log(address);
      let base =  "0000000000000000";
      base = base.substr(0,base.length-address.length-1);
      console.log(base+address);
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

