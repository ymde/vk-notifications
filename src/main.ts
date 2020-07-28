import * as core from '@actions/core'
import {context} from '@actions/github'
import * as request from 'request-promise-native'

const apiUri = 'https://api.vk.com/methods/messages.send'

async function run(): Promise<void> {
  try {
    const botToken = core.getInput('botToken')
    const chatId = core.getInput('chatId')
    const message = core.getInput('message')
    const jobStatus = core.getInput('jobStatus')

    core.debug(
      `sending message, chatId=${chatId}, status=${jobStatus} payload=${JSON.stringify(
        context.payload
      )}`
    )

    await sendMessage(botToken, chatId, jobStatus, message)

  } catch (error) {
    core.setFailed(error.message)
  }
}

/**
 * Send a VK message.
 * @param botToken the VK bot token to send the message
 * @param chatId id of targeted chat id or userid, to which the message will be sent
 * @param jobStatus status of the job
 * @param message
 */
async function sendMessage(
  botToken: String,
  chatId: String,
  jobStatus: String = 'success',
  message: String = ''
) {
  const status = (jobStatus || '').toLowerCase()

  const {repo, ref, sha, workflow, actor} = context
  const repoFullname = `${repo.owner}/${repo.repo}`
  const repoUrl = `https://github.com/${repoFullname}`
  let icon: String
  switch (status) {
    case 'success':
      icon = '✅'
      break
    case 'failure':
      icon = '🔴'
      break
    default:
      icon = '⚠️'
      break
  }

  return request.post(apiUri, {
    body: {
      access_token: botToken,
      message: message || 'test message',
      peer_id: chatId
    }
  });

}

run()
