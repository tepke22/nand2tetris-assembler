// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

//Provera koji je broj veci a koji manji
@R0
D=M
@R1
D=D-M;
@ELSE
D;JGT
//Ako je veci R0 od R1, max=R0; min=R1;
@R1
D=M
@max
M=D
@R0
D=M
@min
M=D
@ENDIF
0;JMP
(ELSE)
//Ako je veci R0 od R1, max=R1; min=R0;
@R0
D=M
@max
M=D
@R1
D=M
@min
M=D
(ENDIF)
//Postavljamo R2 na 0 i brojac na 0
@R2
M=0
@i
M=0
//Ulazak u while petlju
(WHILE)
@i
D=M
@min
D=D-M
@ENDWHILE
D;JEQ
//Provera da li treba da se izadje iz while petlje, proverom da li je i==min
@max
D=M
@R2
M=D+M
//Dodavanje na R2 vrednost max
@i
M=M+1
//Povecavanje brojaca za 1
@WHILE
0;JMP
//Izlazak iz while petlje
(ENDWHILE)
(END)
@END
0;JMP