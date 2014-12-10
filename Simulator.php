<?php

session_start();
$sid = session_id();

$type = $_POST['type'];
$code = $_POST['code'];
$stdin = $_POST['stdin'];

// **** make files
$fileName = 'prog_' . $sid;
$file = fopen($fileName . '.s', 'w');
fwrite($file, $code);
fclose($file);
$file = fopen($fileName . '.in', 'w');
fwrite($file, $stdin);
fclose($file);

// **** assemble
$ext = "s";
$compiler = '';
if ($type == 'arm-windows') {
    $compiler = "arm-elf-gcc";
} else if ($type == 'arm-linux') {
    $compiler = "arm-linux-gnueabi-gcc";
}
$compile = $compiler . " -Wall -o " . $fileName . ".o " . $fileName . "." . $ext . " > " . $fileName . ".cout";
exec("$compile 2>&1", $cout, $cerr);
readfile($fileName . ".cout");

// **** simulate
if (file_exists($fileName . '.o')) {
    $simulator = '';
    if ($type == 'arm-windows') {
        $simulator = 'arm-elf-run ';
    } else if ($type == 'arm-linux') {
        $simulator = 'qemu-arm -L /usr/arm-linux-gnueabi ';
    }
    $simulate = $simulator . $fileName . ".o < " . $fileName . ".in > " . $fileName . ".out";
    exec("$simulate 2>&1", $sout, $serr);
    readfile($fileName . ".out");
    if (!file_exists($fileName . '.out')) {
        echo $serr;
    }
} else {
    echo $cerr;
}

// **** delete temp files
unlink($fileName . '.s');
unlink($fileName . '.in');
if (file_exists($fileName . '.o')) {
    unlink($fileName . '.o');
}
if (file_exists($fileName . '.cout')) {
    unlink($fileName . '.cout');
}
if (file_exists($fileName . '.out')) {
    unlink($fileName . '.out');
}
?>
