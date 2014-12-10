# ARM program to print "Hello World!"

# *************** instruction memory 
    .text
    .global main
main:  
    # store(push) lr to the stack                 
    sub		sp, sp, #4
    str		lr, [sp, #0]

    # your code here
    ldr		r0, =hello
    bl  	printf

    # retrive(pop) lr from the stack
    ldr		lr, [sp, #0]
    add		sp, sp, #4

    # return
    mov		pc, lr

# *************** data memory 
	.data
hello:
	.asciz "Hello World!\n" 