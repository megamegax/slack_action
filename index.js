const core = require('@actions/core');
const axios = require('axios');
import Message from './MessageFactory.js';

async function run() {
    try {
        const channel = core.getInput('channel');
        const message = core.getInput('message');
        const userName = core.getInput('user_name');
        const userIcon = core.getInput('user_icon');
        const jobStatus = core.getInput('job_status');
        const actions = core.getInput('actions');
        const webHookUrl = core.getInput('webhook_url')

        let response = await axios({
            method: 'post',
            url: webHookUrl,
            data: Message.createMessage(jobStatus, channel, userName, message, userIcon, actions),
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        console.log('success', response);
        core.setOutput('result', 'success');
    } catch (error) {
        console.log('error', error);
        console.log('error message', error.message);
        core.setOutput('result', 'failure');
        core.setFailed(error.message);
    }
}

run();
