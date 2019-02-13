const readline = require('readline');
const { spawn } = require('child_process');

const handleClose = () => {
    console.log('Time to pawty! 🐾');
    process.exit(0);
};

function runShell() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'Here kitty kitty 😻 > '
    });

    rl.on('line', (line) => {
        line = line.trim();
        const [command, ...args] = line.split(' ');
        executeCommand(command, args, () => { rl.prompt() });
    }).on('close', handleClose); // handle eof terminal control character

    rl.prompt();
}

function executeCommand(command, args, cb) {
    const builtins = {
        'pawty': handleClose,
        'exit': handleClose
        // TODO: cd, type, help
    };

    if (builtins[command]) {
        builtins[command]();
        return cb();
    }

    // This is what makes the CLI a shell -- we are wrapping another process
    const childProcess = spawn(command, args);
    childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    childProcess.on('error', (err) => {
        console.log('Error: command not found');
    });
    childProcess.on('close', (code) => {
        // console.log(`child process exited with code ${code}`);
        cb();
    });
}

runShell();