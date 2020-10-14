var cron = require('node-cron');
const {exec} = require('child_process');

//running the script every 3rd month, on the first day of the month
cron.schedule('2 3 1 1,3,7,10 *', function() {
    exec("node script.js", (error, stdout, stderr)=> {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});


