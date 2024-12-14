const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Hashed Password:', hashedPassword);
  rl.close();
}

async function verifyPassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Password Match:', isMatch);
  rl.close();
}

rl.question('Enter a password to hash: ', (plainPassword) => {
  hashPassword(plainPassword);
});

rl.question('Enter a password to verify: ', (plainPassword) => {
  rl.question('Enter the hashed password: ', (hashedPassword) => {
    verifyPassword(plainPassword, hashedPassword);
  });
});
