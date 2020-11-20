class Parser{

  constructor(fileContent){
    this.file=String(fileContent);
    this.removeCommentsAndEmptyLines();
    this.lines;
    this.line_number=0;
    this.dest;
    this.comp;
    this.jump;
    this.symbol;
    this.command_type;
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
    this.current_instruction_number=-1;  
  }



  advance(){

    let tmp=this.current_instruction;
    console.log(this.current_instruction);
    console.log(this.lines.length);
    if(tmp[0]=='@'){
      this.parseA(tmp);
      this.current_instruction_number++;
    }
    else if(tmp[0]=='('){
      this.parseL(tmp);
    }
    else{
      this.parseC(tmp);
      this.current_instruction_number++;
    }
    this.line_number++;
    this.current_instruction=this.lines[this.line_number];
  }

  parseA(instruction){
    this.symbol=String(instruction).substring(1);
    this.command_type='A_COMMAND';
  }

  parseL(instruction){
    this.symbol=String(instruction).slice(1,-1)
    this.command_type='L_COMMAND';
  }

  parseC(instruction){
    this.dest=this.comp=this.jump='';
    let parts=String(instruction).split(';');
    let part1=parts[0];
    let part2=parts[1];
    if(parts.length==2){
      this.jump=part2;
    }
    part1 = part1.split('=');
    if(part1.length==2){
      this.dest=part1[0];
      this.comp=part1[1];
    }
    else{
      this.comp=part1[0];
    }
    this.command_type='C_COMMAND';
  }
}
