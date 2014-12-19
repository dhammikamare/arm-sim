# Write an ARM program that
#	- get a number from user
#	- prints the number

@ instruction memory ***************

	.text
	.global main
main:                        
	SUB		sp, sp, #4
	STR		lr, [sp, #0]
	
	@ promp for an input
	LDR		r0, =prompt
	BL 		printf
	
	@ scanf("%d", &x)
	LDR		r0, =format
	SUB		sp, sp, #4
	MOV		r1, sp
	BL		scanf
	LDR		r2, [sp, #0] @ or u can use [sp], assembler will imply #0
	ADD		sp, sp, #4
	
	@ print the message
	LDR		r0, =message
	MOV		r1, r2
	BL 		printf
	
	LDR		lr, [sp, #0]
	ADD		sp, sp, #4
	
	MOV		pc, lr

@ data memory ***************
	.data
prompt: .asciz "Enter a number: "
format: .asciz "%d"
message: .asciz "The number entered is %d\n" 
