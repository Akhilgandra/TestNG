const { exec } = require('child_process');

// Function to execute shell commands
function runCommand(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    callback();
  });
}

// Build job
function buildJob() {
  console.log('Running Build Job...');
  runCommand('bazel build //dotnet:all', () => {
    console.log('Build Job Completed.');
  });
}

// Integration Tests job
function integrationTestsJob() {
  console.log('Running Integration Tests Job...');
  runCommand('fsutil 8dot3name set 0', () => {
    runCommand(
      'bazel test //dotnet/test/common:ElementFindingTest-firefox //dotnet/test/common:ElementFindingTest-chrome --pin_browsers=true',
      () => {
        console.log('Integration Tests Job Completed.');
      }
    );
  });
}

// Main function to run the jobs
function main() {
  console.log('Starting CI Jobs...');
  buildJob();
  integrationTestsJob();
}

main();
