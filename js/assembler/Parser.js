class Parser{

  constructor(fileContent){
    this.file = String(fileContent);
    this.removeCommentsAndEmptyLines();
    this.lines;
    this.line_number=0;
    this.dest;
    this.comp;
    this.jump;
    this.symbol;
    this.command_type;
    this.error=false;
    this.errorMessage;
    this.code = new Code();
  }

  removeCommentsAndEmptyLines(){
    this.lines=this.file.split('\n');
    for(let i=0; i<this.lines.length; i++){
      this.lines[i].trim();
      if(this.lines[i].startsWith('//') || this.lines[i]=='' || this.lines[i]=='\n'){ 
      this.lines.splice(i,1);
      i--;
      }
      else{
        let tmp = this.lines[i];
        if(tmp != ""){
           tmp = tmp.split('//')[0];
           tmp = tmp.trim();
        }
        this.lines[i]=tmp;
      }
    }
    this.line_number=0;
    this.current_instruction= this.lines[this.line_number];
    this.current_instruction_number=0;  
  }

  findAndColor(instruction){
    const ta = document.getElementById('in-content-target');
    const linesToHiglight = String(ta.value);
    const l = linesToHiglight.indexOf(instruction); 
    if(l!=-1) 
    { 
      ta.classList.add('selected-color');
      ta.focus();
      ta.selectionStart = l; 
      ta.selectionEnd = l + instruction.length; 
    }
  }

  advance(){

    let tmp=this.current_instruction;
    if(tmp[0]=='@'){
      this.parseA(tmp);
      this.current_instruction_number++;
    }
    else if(tmp[0]=='('){
      this.parseL(tmp);
    }
    else if(tmp[0]=='D' || tmp[0]=='M' || tmp[0]=='A' || tmp[0]=='0' || tmp[0]=='=' || tmp[0]=='1' || (tmp[0]=='-' && tmp[1]=='1')){
      this.parseC(tmp);
      this.current_instruction_number++;
    }
    else{
      this.findAndColor(tmp);
      this.error=true;
      this.errorMessage='BAD INSTRUCTION\n\nLINE : ' + tmp;
      return;
    }
    this.line_number++;
    this.current_instruction=this.lines[this.line_number];
  }

  parseA(instruction){
    let symbols =  /[ `!#%^&*+\=\[\]{};':"\\|,<>\/?~]/;
    if(instruction.length == 1 || instruction.match(symbols)){
      
      this.error=true;
      this.errorMessage='BAD INSTRUCTION OF TYPE A\n\nLINE : ' + instruction;      
    }
    else if(instruction[1] == '-' ){
      var numbers = /^[0-9]+$/;
      if(instruction.split('-')[1].match(numbers))
      {
        this.findAndColor(instruction); 
        this.error=true;
        this.errorMessage='BAD INSTRUCTION OF TYPE A\n\nLINE : ' + instruction;        
      }
    }
    this.symbol=String(instruction).substring(1);
    this.command_type='A_COMMAND';
  }

  parseL(instruction){
    if(instruction[instruction.length-1]==')'){
      this.symbol=String(instruction).slice(1,-1)
      this.command_type='L_COMMAND';
    }
    else{
      this.findAndColor(instruction); 
      this.error=true;
      this.errorMessage='BAD LABEL\n\nLINE : ' + instruction;      
    }    
  }

  parseC(instruction){
this.dest=this.comp=this.jump='';
    let parts=String(instruction).split(';');
    let part1=parts[0];
    let part2=parts[1];
    if(parts.length==2){
      //----------------------------------------------------------------------------------------------------------------------------//
      let foundJMP = this.code.jumpTable.find(function(element, index) {
        if(element.name == part2.trim())
          return true;
      });
      if(foundJMP || part2.length==0){
        
        this.jump=part2;
      }
      else{
        this.findAndColor(instruction); 
        this.error=true;
        this.errorMessage='BAD INSTRUCTION OF TYPE CCC\n\nBAD JUMP COMMAND\n\nLINE : ' + instruction;        
        return;
      }
      //----------------------------------------------------------------------------------------------------------------------------//
    }
    part1 = part1.split('=');
    if(part1.length==2){
      //----------------------------------------------------------------------------------------------------------------------------//
      let foundDEST = this.code.destTable.find(function(element, index) {
        if(element.name == part1[0])
          return true;
      });
      if(foundDEST || part1[0].length==0){
        this.dest=part1[0];
      }
      else{
        this.findAndColor(instruction); 
        this.error=true;
        this.errorMessage='BAD INSTRUCTION OF TYPE CC\n\nBAD DESTINATION COMMAND\n\nLINE : ' + instruction;        
        return;
      }
      //----------------------------------------------------------------------------------------------------------------------------//

      //----------------------------------------------------------------------------------------------------------------------------//
      let foundCOMP = this.code.compTable.find(function(element, index) {
        if(element.name == part1[1])
          return true;
      });
      if(foundCOMP){
        this.comp=part1[1];
      }
      else{
        this.findAndColor(instruction); 
        this.error=true;
        this.errorMessage='BAD INSTRUCTION OF TYPE C\n\nBAD COMPUTATION COMMAND\n\nLINE : ' + instruction;        
        return;
      }
      //----------------------------------------------------------------------------------------------------------------------------//
    }
    else{
      let foundCOMP = this.code.compTable.find(function(element, index) {
        if(element.name == part1)
          return true;
      });

      if(foundCOMP){
        this.comp=part1;
      }
      else{
        this.findAndColor(instruction); 
        this.error=true;
        this.errorMessage='BAD INSTRUCTION OF TYPE C\n\nBAD COMPUTATION COMMAND\n\nLINE : ' + instruction;        
      }      
    }
    this.command_type='C_COMMAND';
  }
}
