module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 816:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./MessageFactory.js
const github = __webpack_require__(317);

class Message {
  static jobParameters(status) {
    switch (status) {
      case 'success':
        return {
          color: 'good'
        };
      case 'failure':
        return {
          color: 'danger'
        };
      case 'cancelled':
        return {
          color: 'warning'
        };
    }
  }

  static createMessage(jobStatus, channel, userName, message, userIcon, actions) {
    let context = github.context;
    console.log('context', context);
    //let footer = `<${github.context.payload.repository.html_url}|${github.context.payload.repository.full_name}>`;
    let parsedActions;
    if (actions != '') {
      parsedActions = JSON.parse(actions);
    }

    let attachments;
    if (message == '' && parsedActions == '') {
      attachments = {};
    } else {
      attachments = {
        color: Message.jobParameters(jobStatus).color,
        author_name: context.payload.sender.login,
        author_link: context.payload.sender.html_url,
        author_icon: context.payload.sender.avatar_url,
        title: Message.getMessage().title,
        //  "title_link": titleLink,
        text: Message.getMessage().text,
        fields: Message.getMessage().fields,
        // "image_url": image,
        //"thumb_url": thumbnail,
        // "footer": footer,
        //"footer_icon": footerIcon,
        ts: Math.floor(new Date().getTime() / 1000),
        actions: parsedActions
      };
    }

    return {
      channel: channel,
      username: userName,
      icon_url: userIcon,
      text: message,
      attachments: [attachments]
    };
  }

  static getMessage() {
    let context = github.context;
    const eventName = context.eventName;
    const runUrl = `${context.payload.repository.html_url}/actions/runs/${process.env.GITHUB_RUN_ID}`;
    const commitId = context.sha.substring(0, 7);
    switch (eventName) {
      case 'pull_request':
        return {
          text: `(<${context.payload.repository.compare_url}|${commitId}>) for PR <${context.payload.pr
            .url}| #${context.payload.pr.number} ${context.payload.pr.title}>`,
          fields: [
            {
              title: 'Repository',
              value: `<${context.payload.repository.html_url}|${context.payload.repository.full_name}>`,
              short: true
            },
            {
              title: 'Branch',
              value: `<${process.env.GITHUB_HEAD_REF ||
                (process.env.GITHUB_REF && process.env.GITHUB_REF.split('/')[2])}>`,
              short: true
            },
            { title: 'Workflow', value: `<${runUrl}|${process.env.GITHUB_WORKFLOW}>`, short: true }
          ]
        };

      case 'release':
        return {
          title: `<${context.payload.release.url}| ${context.payload.release.title}>`,
          text: '',
          fields: [
            {
              title: 'Repository',
              value: `<${context.payload.repository.html_url}|${context.payload.repository.full_name}>`,
              short: true
            },
            {
              title: 'Release',
              value: `<${process.env.GITHUB_HEAD_REF ||
                (process.env.GITHUB_REF && process.env.GITHUB_REF.split('/')[2])}>`,
              short: true
            },
            { title: 'Workflow', value: `<${runUrl}|${process.env.GITHUB_WORKFLOW}>`, short: true }
          ]
        };

      case 'push':
        return {
          title: `<${context.payload.head_commit.url}| ${context.payload.head_commit.message}>`,
          text: '',
          fields: [
            {
              title: 'Repository',
              value: `<${context.payload.repository.html_url}|${context.payload.repository.full_name}>`,
              short: true
            },
            {
              title: 'Branch',
              value: `<${process.env.GITHUB_HEAD_REF ||
                (process.env.GITHUB_REF && process.env.GITHUB_REF.split('/')[2])}>`,
              short: true
            },
            { title: 'Workflow', value: `<${runUrl}|${process.env.GITHUB_WORKFLOW}>`, short: true }
          ]
        };

      case 'workflow_dispatch':
        return {
          title: `<${runUrl}| triggered manually>`,
          text: '',
          fields: [
            {
              title: 'Repository',
              value: `<${context.payload.repository.html_url}|${context.payload.repository.full_name}>`,
              short: true
            },
            {
              title: 'Branch',
              value: `<${process.env.GITHUB_HEAD_REF ||
                (process.env.GITHUB_REF && process.env.GITHUB_REF.split('/')[2])}>`,
              short: true
            },
            { title: 'Workflow', value: `<${runUrl}|${process.env.GITHUB_WORKFLOW}>`, short: true }
          ]
        };

      default:
        return { text: `We don't support the [${github.context.eventName}] event yet.` };
    }
  }
}

// CONCATENATED MODULE: ./index.js
const core = __webpack_require__(593);
const axios = __webpack_require__(865);


const SLACK_WEBHOOK = process.env['SLACK_WEBHOOK'];

async function run() {
	try {
		const channel = core.getInput('channel');
		const message = core.getInput('message');
		const userName = core.getInput('user_name');
		const userIcon = core.getInput('user_icon');
		const jobStatus = core.getInput('job_status');
		const actions = core.getInput('actions');

		 await axios({
			method: 'post',
			url: `${SLACK_WEBHOOK}`,
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


/***/ }),

/***/ 593:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 317:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 865:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(816);
/******/ })()
;