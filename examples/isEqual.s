@ ARM Woekshop - Problem 1 
@ Write an ARM program that
@	- compares two register values
@	- prints whether they are equal or not

@ instruction memory ***************

	.text
	.global main
main:                 
	SUB		sp, sp, #4
	STR		lr, [sp, #0]
	
	MOV		r2, #16
	MOV		r3, #18
	
	CMP		r2, r3
	BNE		else
	
	LDR		r0, =ifstr
	B 		finish
	
else:
	LDR		r0, =elsestr
	@ this is not needed, coz after finishing this it goes to finish
	@ B		finish

finish:
	BL 		printf
	LDR		lr, [sp, #0]
	ADD		sp, sp, #4
	
	
	MOV		pc, lr

@ data memory ***************
	.data
ifstr: .asciz "The numbers are Equal.\n" 
elsestr: .asciz "The numbers are Not Equal.\n"
