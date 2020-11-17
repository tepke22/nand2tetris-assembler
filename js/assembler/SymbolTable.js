class SymbolTable{

  constructor(){
      this.symbolTable=[
        {name:"SP", value:"000000000000000"},
        {name:"LCL", value:"000000000000001"},
        {name:"ARG", value:"000000000000010"},
        {name:"THIS", value:"000000000000011"},
        {name:"THAT", value:"000000000000100"},
        {name:"R0", value:"000000000000000"},
        {name:"R1", value:"000000000000001"},
        {name:"R2", value:"000000000000010"},
        {name:"R3", value:"000000000000011"},
        {name:"R4", value:"000000000000100"},
        {name:"R5", value:"000000000000101"},
        {name:"R6", value:"000000000000110"},
        {name:"R7", value:"000000000000111"},
        {name:"R8", value:"000000000001000"},
        {name:"R9", value:"000000000001001"},
        {name:"R10", value:"000000000001010"},
        {name:"R11", value:"000000000001011"},
        {name:"R12", value:"000000000001100"},
        {name:"R13", value:"000000000001101"},
        {name:"R14", value:"000000000001110"},
        {name:"R15", value:"000000000001111"},
        {name:"SCREEN", value:"100000000000000"},
        {name:"KBD", value:"110000000000000"}
        ];
      this.nextAvailableRAMAdress=16;
  }

  addEntry(symbol, address){
      this.symbolTable.push({name:symbol, value:address})
  }

  contains(symbol){
      for (let index = 0; index < this.symbolTable.length; index++) {
          if(this.symbolTable[index].name === symbol){
              return true;
          }
      }
      return false;
  }

  getAddress(symbol){
      return this.symbolTable.find(o => o.name === symbol).value;
  }
}
