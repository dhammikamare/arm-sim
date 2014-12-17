@ ARM Woekshop - Problem 3
@ Write an ARM program that
@	- implements for loop

@ instruction memory ***************

	.text
	.global main
main:                        
	SUB		sp, sp, #4
	STR		lr, [sp, #0]
	
	MOV		r2, #0 	@i=0;
	MOV		r3, #5	@j=5;
	
loop:
	ADD             r3, r3, r2	@j=j+i;
	
	@ if(j==10) return;
	CMP		r3, #10
	BEQ		finish
	
	ADD		r2, r2, #1	@ i++
	
	CMP		r2, #8
	BGE		finish		@ i>=8
	B 		loop

finish:
	@ print j
	LDR		r0, =msg
	MOV		r1, r3 
	BL              printf
	
	LDR		lr, [sp, #0]
	ADD		sp, sp, #4
	
	MOV		pc, lr

@ data memory ***************
	.data
msg: .asciz "%d\n" 
