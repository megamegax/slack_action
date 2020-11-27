const core = require('@actions/core');
const axios = require('axios');
import Message from './MessageFactory.js';

async function run() {
  try {
    const webHook = core.getInput('webHook');
    const channel = core.getInput('channel');
    const message = core.getInput('message');
    const userName = core.getInput('user_name');
    const userIcon = core.getInput('user_icon');
    const jobStatus = core.getInput('job_status');
    const actions = core.getInput('actions');

    await axios({
      method: 'post',
      url: webHook,
      data: Message.createMessage(jobStatus, channel, userName, message, userIcon, actions),
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });


    core.setOutput('result', 'success');
  } catch (error) {
    console.log('error', error);
    core.setOutput('result', 'failure');
    core.setFailed(error.message);
  }
}

run();
