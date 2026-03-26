import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.INPUT_CHANNEL = process.env.SLACK_CHANNEL || '#test-channel';
process.env.INPUT_MESSAGE = 'Test message from local testing';
process.env.INPUT_USER_NAME = process.env.SLACK_USER_NAME || 'Test Bot';
process.env.INPUT_USER_ICON = process.env.SLACK_USER_ICON || 'https://example.com/icon.png';
process.env.INPUT_JOB_STATUS = 'success';
process.env.INPUT_ACTIONS = '';
process.env.INPUT_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';

process.env.GITHUB_WORKFLOW = 'Local Test Workflow';
process.env.GITHUB_RUN_ID = '12345678';
process.env.GITHUB_REF = 'refs/heads/main';
process.env.GITHUB_REPOSITORY = 'owner/repo';
process.env.GITHUB_EVENT_NAME = 'push';
process.env.GITHUB_EVENT_PATH = join(__dirname, 'test-event.json');

console.log('Starting test...\n');


import('./index.js')
	.then(() => {
		console.log('\nTest completed successfully!');
	})
	.catch((error) => {
		console.error('\nTest failed:', error);
		process.exit(1);
	});
