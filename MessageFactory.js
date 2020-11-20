const github = require('@actions/github');

export default class Message {

  static jobParameters(status) {
    switch (status) {
      case "success": return {
        color: 'good',
      }
      case "failure": return {
        color: 'danger',
      }
      case "cancelled": return {
        color: 'warning',
      }
    }
  };

  static createMessage(
    jobStatus,
    channel,
    userName,
    message,
    userIcon,
    actions
  ) {
    let context = github.context;
    console.log("context", context)
    console.log("github", github)
    //let footer = `<${github.context.payload.repository.html_url}|${github.context.payload.repository.full_name}>`;

    //  if (actions != '') {
    //    actions = JSON.parse(actions);
    //  }

    let attachments;
    if (message == '' && actions == '') {
      attachments = {};
    } else {
      attachments = {
        "color": Message.jobParameters(jobStatus).color,
        "author_name": context.payload.sender.login,
        "author_link": context.payload.sender.html_url,
        "author_icon": context.payload.sender.avatar_url,
        "title": message,
        //  "title_link": titleLink,
        "text": Message.getMessage().text,
        "fields": Message.getMessage().fields,
        // "image_url": image,
        //"thumb_url": thumbnail,
        // "footer": footer,
        //"footer_icon": footerIcon,
        "ts": Math.floor(new Date().getTime() / 1000),
        //  "actions": actions,
      };
    }

    data = {
      "channel": channel,
      "username": userName,
      "icon_url": userIcon,
      "text": message,
      "attachments": [attachments]
    };
  }

  static getMessage() {
    let context = github.context;
    const eventName = context.eventName;
    const runUrl = `${context.payload.repository.html_url}/actions/runs/${process.env.GITHUB_RUN_ID}`;
    const commitId = context.sha.substring(0, 7);
    switch (eventName) {
      case 'pull_request': return {
        text: `(<${compareUrl}|${commitId}>) for PR <${pr.url}| #${pr.number} ${pr.title}>`,
        fields: [
          { "title": "Repository", "value": `<${context.repository}|${context.payload.repository.html_url}`, "short": true },
          { "title": "Branch", "value": `<${process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF && process.env.GITHUB_REF.split('/')[2]}>`, "short": true },
          { "title": "Workflow", "value": `<${runUrl}|${process.env.GITHUB_WORKFLOW}>`, "short": true }
        ]
      }

      case 'release': return {
        text: `<${release.url}| ${release.title}>`,
        fields: [
          { "title": "Repository", "value": `<${context.payload.repository}|${context.payload.repository.html_url}`, "short": true },
          { "title": "Branch", "value": `<${process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF && process.env.GITHUB_REF.split('/')[2]}>`, "short": true },
          { "title": "Workflow", "value": `<${runUrl}|${process.env.GITHUB_WORKFLOW}>`, "short": true }
        ]
      }

      case 'push': return {
        text: `<${headCommit.url}| ${headCommit.title}>`,
        fields: [
          { "title": "Repository", "value": `<${context.payload.repository}|${context.payload.repository.html_url}`, "short": true },
          { "title": "Branch", "value": `<${process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF && process.env.GITHUB_REF.split('/')[2]}>`, "short": true },
          { "title": "Workflow", "value": `<${runUrl}|${process.env.GITHUB_WORKFLOW}>`, "short": true }
        ]
      }

      default:
        return { text: `We don't support the [${github.context.eventName}] event yet.` };
    }
  }
}
