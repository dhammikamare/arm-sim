	.text
	.global main
main:    
    mov r0, #4
    mov r1, #78
    add r2, r0, r1
    cmp r0, r1
    bne cool
    mov r3, #6
    
cool:
    mov r2, #9
    