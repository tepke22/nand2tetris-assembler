const inputTextfieldDiv = document.querySelector('.input')
const outputTextfieldDiv = document.querySelector('.output')

const dropZoneInput = document.querySelector('.drop-zone__input');
const finalResult = document.querySelector('.final-result');
const dropZone = dropZoneInput.closest('.drop-zone');

const inputTextField = document.querySelector('#in-content-target');
const outputTextField = document.querySelector('#out-content-target');

let fileName;
let fileContent;

function placeFileContent(target, file) {
	readFileContent(file).then(content => {
    target.value = content
    fileContent = content;
    inputTextfieldDiv.classList.remove('input-hidden');
    outputTextfieldDiv.classList.remove('output-hidden');
    dropZone.classList.add('drop-zone-hidden');
    dropZone.classList.remove('drop-zone--over');
    finalResult.classList.add('final-result-hidden');
  }).catch(error => console.log(error))
}

inputTextField.addEventListener('mousedown',function(){
  inputTextField.classList.remove('selected-color');
});

document.querySelector('.translate_button').addEventListener('click', (e) => {
  inputTextField.classList.remove('selected-color');
  outputTextField.value="";
  let x = new Main(new Parser(inputTextField.value), new SymbolTable(), new Code());
  x.assemble();
});

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  });
}

dropZone.addEventListener("click", (e) => {
  dropZoneInput.click();
});

dropZoneInput.addEventListener("change", (e) => {
  if(dropZoneInput.files.length){
    placeFileContent(inputTextField,dropZoneInput.files[0]);
    fileName=dropZoneInput.files[0].name.split('.')[0];
  }
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add('drop-zone--over');
});

["dragleave","dropend"].forEach(type => {
  dropZone.addEventListener(type, (e) => {
    dropZone.classList.remove('drop-zone--over');
  });
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  if(e.dataTransfer.files){
    let file=e.dataTransfer.files[0];;
    fileName= file.name.split('.')[0];
    let extension = file.name.split('.')[1];
    if(extension!="asm" && extension!="txt")
    {
      alert('Wrong file imported');
      return;
    }
    else{
      placeFileContent(inputTextField,file);
    }
    
  }
})

document.querySelector('.download_button').addEventListener('click', function(e) {
  var text = document.getElementById('out-content-target').value;
  if(text!=''){
    var file = new File([text], fileName+".hack", {type: "text/plain;charset=utf-8"});
    saveAs(file);
  }
  else{
    alert('Output file is empty. Translate before saving!')
  }
});

document.querySelectorAll('.code_buttons button').forEach((button) => {
  button.addEventListener('click', (e) => {
    asmFiles.forEach((file) => {
      if(file.name == button.innerHTML){
        inputTextField.value=file.value;
        outputTextField.value='';
        fileContent=file.value;
        fileName=file.name.split('.')[0];

        inputTextfieldDiv.classList.remove('input-hidden');
        outputTextfieldDiv.classList.remove('output-hidden');
        dropZone.classList.add('drop-zone-hidden');
        dropZone.classList.remove('drop-zone--over');
        finalResult.classList.add('final-result-hidden');

        outputTextField.readOnly=true;
        outputTextField.style.borderColor="#3cb45e";
        inputTextField.readOnly=true;
        inputTextField.style.borderColor="#3cb45e";
        
        return;
      }
    });
   });
});

document.querySelector('#editAsm').addEventListener('click', (e) => {
  if(!inputTextfieldDiv.classList.contains('input-hidden')){
    if(inputTextField.readOnly){    
      inputTextField.readOnly=false;
      inputTextField.style.borderColor="#ff6d6d";
    }
    else{
      inputTextField.readOnly=true;
      inputTextField.style.borderColor="#3cb45e";
    }
  }
});

document.querySelector('#editMachine').addEventListener('click', (e) => {
  if(!outputTextfieldDiv.classList.contains('output-hidden')){
    if(outputTextField.readOnly){    
      outputTextField.readOnly=false;
      outputTextField.style.borderColor="#ff6d6d";
    }
    else{
      outputTextField.readOnly=true;
      outputTextField.style.borderColor="#3cb45e";
      
    }
  }
});

document.querySelector('#reset').addEventListener('click', (e) => {
  inputTextfieldDiv.classList.add('input-hidden');
  outputTextfieldDiv.classList.add('output-hidden');
  dropZone.classList.remove('drop-zone-hidden');
  finalResult.classList.remove('final-result-hidden');
  inputTextField.value="";
  outputTextField.value="";
  fileContent='';
  fileName='';
  outputTextField.readOnly=true;
  outputTextField.style.borderColor="#3cb45e";
  inputTextField.readOnly=true;
  inputTextField.style.borderColor="#3cb45e";
});