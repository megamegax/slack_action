const github = require('@actions/github');

export default class Message {
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
			let login = 'Scheduled';
			let html_url = '';
			let avatar_url = '';
			if (context.payload.sender != null) {
				login = context.payload.sender.login;
				html_url = context.payload.sender.html_url;
				avatar_url = context.payload.sender.avatar_url;
			}
			attachments = {
				color: Message.jobParameters(jobStatus).color,
				author_name: login,
				author_link: html_url,
				author_icon: avatar_url,
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
		let htmlUrl = '';
		if (context.payload.repository != null) {
			htmlUrl = context.payload.repository.html_url;
		}
		const runUrl = `${htmlUrl}/actions/runs/${process.env.GITHUB_RUN_ID}`;
		const commitId = context.sha.substring(0, 7);
		switch (eventName) {
			case 'pull_request':
				return {
					text: `(<${context.payload.repository.compare_url}|${commitId}>) for PR <${context.payload.pull_request.html_url}| #${context.payload.pull_request.number} ${context.payload.pull_request.title}>`,
					fields: [
						{
							title: 'Repository',
							value: `<${context.payload.repository.html_url}|${context.payload.repository.full_name}>`,
							short: true
						},
						{
							title: 'Branch',
							value: `${process.env.GITHUB_HEAD_REF ||
								(process.env.GITHUB_REF && process.env.GITHUB_REF.split('/')[2])}`,
							short: true
						},
						{ title: 'Workflow', value: `<${runUrl}|${process.env.GITHUB_WORKFLOW}>`, short: true }
					]
				};

			case 'release':
				let commitMessage = context.payload.release.title.split('\n');
				let text = commitMessage.slice(1, commitMessage.length).join('\n');
				return {
					title: `<${context.payload.release.url}| ${context.payload.release.title.split('\n')[0]}>`,
					text: text,
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
				let pushCommitMessage = context.payload.head_commit.message.split('\n');
				let pushText = pushCommitMessage.slice(1, pushCommitMessage.length).join('\n');
				return {
					title: `<${context.payload.head_commit.url}| ${context.payload.head_commit.message.split(
						'\n'
					)[0]}>`,
					text: pushText,
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
			case 'schedule':
				console.log(context);
				console.log(context.payload);
				return {
					title: `scheduled build`,
					text: '',
					fields: [						
						{
							title: 'Branch',
							value: `<${process.env.GITHUB_HEAD_REF ||
								(process.env.GITHUB_REF && process.env.GITHUB_REF.split('/')[2])}>`,
							short: true
						},
						{ title: 'Workflow', value: `${process.env.GITHUB_WORKFLOW}`, short: true }
					]
				};
			default:			
				return { text: `We don't support the [${github.context.eventName}] event yet.` };
		}
	}
}
