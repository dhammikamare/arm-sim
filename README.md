arm-sim: A Web based ARM Instruction Set Simulator
-----------------------------------------
DEPARTMENT OF COMPUTER ENGINEERING<br>
UNIVERSITY OF PERADENIYA<br>
CO227: Computer Engineering Project - 2014

Project Advisor: Dr. Roshan Ragel<br>
Scrum Master: Mr. Pramod Herath<br>
Group Number: ARM6<br>
Project Members: Marasinghe M.M.D.B. (E/11/258),  Senavirathna A.S.D. (E/11/379)

 1. ABSTRACT<br>
ARM is a popular family of instruction set architecture (ISA) used in embedded processors that are based on reduced instruction set computers (RISC). An instruction set simulator (ISS) is a well known simulation model, usually programmed in a high level language, that simulates the behaviour of a microprocessor by taking instructions as input and producing the outputs expected by the execution of the instructions. ISS are widely used by embedded system programmers as it is not always possible to run embedded applications on the target device. In addition, an ISS is also very useful in a teaching/learning environment to under-stand the ISA of a computer and how it works.<br>
In this project, you will build a web based instruction set simulator for ARM instruction set architecture. The target is to use this simulator as a teaching tool.

 2. PREREQUISITES<br>
Computer Programming, Web Programming and Computer Architecture

 3. PROJECT OBJECTIVE<br>
The objective of the project is to provide a web interface to users who can either enter ARM assembly code in a web based editor or browse and upload ARM assembly code to web server and then the web server should produce the output by compiling and executing the ARM assembly.
The product will be built via two iterations and the details are given below.

 3.1. ITERATION 1: CORE REQUIREMENT<br>
In iteration 1, the simulator should be able perform the following actions:
 - provide an online editor to type ARM assembly program(with syntax highlighting, etc.)
 - provide an option to load an ARM assembly file to the editor
 - upload the file to the web server
 - compile the assembly file in the web server
 - run/simulate the binary file (that was produced in the compilation in the last step)
 - produce the output of the simulation in the website
 
 The web server can run all possible cross compiler tool chain including a command line ARM simulator (such as qemu). The web page should be built to act as an interface that will take the assembly program, compile it, run it and the output is produced in an appropriate format on the web page.
Therefore, the first iteration of the project is more of an integration exercise with some dynamic web programming.
 
 3.2 ITERATION 2: ENHANCEMENTS<br>
In iteration 2, the web based simulator should display the internal state of the processor in the website. In addition to the actions required in Iteration 1, iteration 2 should allow the following actions:
 - allow users to simulate their assembly program, either step by step or in a single go
 - allow users to visualize the internal state of a processor including<br>
- registers (user registers and special registers such as IR, PC)<br>
- instruction memory<br>
- data memory (segments such as stack, heap, and data)<br>
- a count of the number of instructions executed
 - allow users to toggle between different representations (such as binary/decimal/hex) of the register/memory values
 - allow users to clear/reinitialize registers and memories
 - allow users to set values to registers
 
 Iteration 2 can be (not necessarily) achieved by writing your own ISS using a web programming language so that you can provide intermediate states of the processor (such as registers, memory, etc.) to the user via the web interface. See the references for possible GUIs.


 4. REFERENCES<br>
[1] ARMSim# - A desktop based ARM Simulator - Available at http://armsim.cs.uvic.ca/<br>
[2] QtSPIM - A desktop based MIPS Simulator - Available at http://sourceforge.net/projects/spimsimulator/<br>
[3] Ace - A high performance code editor for the web - Available at http://ace.c9.io/
