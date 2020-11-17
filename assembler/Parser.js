class Parser{

  constructor(fileContent){
    this.file=String(fileContent);
    this.getFirstInstruction();
    this.lines;
    this.line_pos_in_file;
    this.dest;
    this.comp;
    this.jump;
    this.symbol;
    this.command_type;
  }

  isComment(line){
    return !Boolean(line) || (String(line).startsWith('//') ? true : false);
  }

  getFirstInstruction(){
    this.lines = this.file.split('\n');
    this.line_pos_in_file=0;
    while (this.isComment(this.lines[this.line_pos_in_file].trim()) || this.lines[this.line_pos_in_file].trim()===''){
      this.line_pos_in_file++;
    }
    let tmp = this.lines[this.line_pos_in_file].trim();
    tmp = tmp.split('//')[0];
    tmp = tmp.trim();
    this.current_instruction= tmp;
    this.current_instruction_number=-1;
  }

  getNextInstruction(){
    if(this.line_pos_in_file <= this.lines.length){
      let tmp = this.lines[this.line_pos_in_file];
      if(tmp != ""){
        tmp = tmp.split('//')[0];
        tmp = tmp.trim();
      }
      this.current_instruction=tmp;
    }
  }

  hasMoreCommands(){
    if(this.current_instruction=='' && this.lines[this.line_pos_in_file+1]!='' && (this.line_pos_in_file+1)<this.lines.length){
      this.line_pos_in_file++;
      this.getNextInstruction();
      return true;
    }
    return Boolean(this.current_instruction);
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
    else{
      this.parseC(tmp);
      this.current_instruction_number++;
    }
    this.line_pos_in_file++;
    this.getNextInstruction();
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
