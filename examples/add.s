@ Write an ARM program to
@	- load two values to registers
@	- add the values
@	- print the answer as a formated string

	.text
	.global main
main:                        
	sub		sp, sp, #4
	str		lr, [sp, #0]	
	
	ldr		r0, =format
	mov		r1, #7
	mov		r2, #123
	add		r3, r1, r2
	bl  	printf
	
	ldr		lr, [sp, #0]
	add		sp, sp, #4
	
	mov		pc, lr

	.data
format: .asciz "Sum of %d and %d is %d!" 
