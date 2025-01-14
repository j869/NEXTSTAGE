// testUpdateUsers.cjs
const { updateUsers } = require('./updateUserTable.cjs');

async function testUpdateUsers() {
    try {
        await updateUsers();
        console.log("put9    Terminating the script.");
        process.exit(); // This will terminate the Node.js process
        console.log("put8   This line will not be executed.");
    } catch (error) {
        console.error('Error executing updateUsers:', error);
    }
}

console.log('put1     Starting updateUsers test');
testUpdateUsers();

