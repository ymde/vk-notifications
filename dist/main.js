"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const request = __importStar(require("request-promise-native"));
const apiUri = 'https://api.vk.com/methods/messages.send';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const botToken = core.getInput('botToken');
            const chatId = core.getInput('chatId');
            const jobStatus = core.getInput('jobStatus');
            core.debug(`sending message, chatId=${chatId}, status=${jobStatus} payload=${JSON.stringify(github_1.context.payload)}`);
            yield sendMessage(botToken, chatId, jobStatus);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
/**
 * Send a VK message.
 * @param botToken the VK bot token to send the message
 * @param chatId id of targeted chat id or userid, to which the message will be sent
 * @param jobStatus status of the job
 */
function sendMessage(botToken, chatId, jobStatus = 'success') {
    return __awaiter(this, void 0, void 0, function* () {
        const status = (jobStatus || '').toLowerCase();
        const { repo, ref, sha, workflow, actor } = github_1.context;
        const repoFullname = `${repo.owner}/${repo.repo}`;
        const repoUrl = `https://github.com/${repoFullname}`;
        let icon;
        switch (status) {
            case 'success':
                icon = '✅';
                break;
            case 'failure':
                icon = '🔴';
                break;
            default:
                icon = '⚠️';
                break;
        }
        return request.post(apiUri, {
            body: {
                access_token: botToken,
                message: 'test message',
                peer_id: chatId,
            }
        });
    });
}
run();
