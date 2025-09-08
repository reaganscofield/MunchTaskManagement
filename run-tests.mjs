import { execSync } from 'child_process';

try {
  console.log('Running Cucumber Tests Script');
  // Set environment variables for tsx
  process.env.NODE_OPTIONS = '--loader tsx/esm';
  // Command to run the tests and point to the features and steps files
  const command = [
    'cucumber-js',
    'tests/features/*.feature',
    '--import tests/steps/**/*.ts',
    '--format progress-bar',
  ].join(' ');
  // Execute the command
  execSync(command, { 
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--loader tsx/esm' }
  });
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}