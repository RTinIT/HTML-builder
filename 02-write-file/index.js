const fs = require('fs');
const path = require('path');
const {stdin, stdout, exit} = require('process');

fs.writeFile(path.join(__dirname, './favorite-colors.txt'),
  '', (error) => {
    if (error) throw error;
  });

stdout.write('Hi! Enter your favorite color.\n');

stdin.on('data', data => {
  const input = data.toString();
  if (input.trim() === 'exit') exit();
  fs.appendFile(path.join(__dirname, './favorite-colors.txt'), `${input}`,
    (error) => {
      if (error) throw error; 
    });

  stdout.write('And another one?\n');
});

process.on('exit', () => {
  stdout.write('Thanks! Good luck!');
});

process.on('SIGINT', () => {
  exit();
});

