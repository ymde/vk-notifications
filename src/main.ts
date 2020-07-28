import * as core from '@actions/core'
import {context} from '@actions/github'
import * as request from 'request-promise-native'
import queryString from 'query-string'

const apiUri = 'https://api.vk.com/method/messages.send'

async function run(): Promise<void> {
  try {
    const botToken = core.getInput('botToken')
    const chatId = core.getInput('chatId')
    const message = core.getInput('message')
    const jobStatus = core.getInput('jobStatus')

    core.debug(
      `sending message, chatId=${
        Number(chatId) + 5
      }, status=${jobStatus} payload=${JSON.stringify(context.payload)}`
    )

    const result = await sendMessage(botToken, chatId, jobStatus, message)

    core.debug(`output from vk ${JSON.stringify(result)}`)
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

  core.debug(
    `request: ${JSON.stringify({
      access_token: botToken,
      message: message || 'test message',
      peer_id: chatId,
      v: 5.111,
      random_id: getRandomInt(9e3)
    })}`
  )

  return request.post(apiUri, {
    body: queryString.stringify({
      access_token: botToken,
      message: message || 'test message',
      peer_id: chatId,
      v: 5.111,
      random_id: getRandomInt(9e3)
    })
  })
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max))
}

run()
