"use strict";
// write a function to read all file paths in a repo
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const fs = __importStar(require("fs"));
const codeownersFile = 'CODEOWNERS';
async function run() {
    try {
        const token = core.getInput('github-token');
        core.info(`Token: ${token}`);
        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;
        //read from the codeowners file
        const codeownersContent = fs.readFileSync(codeownersFile, 'utf8');
        core.info(`Codeowners content: ${codeownersContent}`);
        const codeownersLines = codeownersContent.split('\n');
        core.info(`Codeowners lines: ${codeownersLines}`);
        const codeownersPaths = codeownersLines
            .filter(line => line.startsWith('*'))
            .map(line => line.split(' ')[1]);
        core.info(`Codeowners paths: ${codeownersPaths}`);
        core.info(`Owner: ${owner}`);
        core.info('before we read file list in PR');
        const { data: files } = await octokit.rest.pulls.listFiles({
            owner,
            repo,
            pull_number: github.context.issue.number
        });
        const filesPaths = files.map((file) => file.filename);
        core.info(`Files paths: ${filesPaths}`);
        const filesNotOwned = filesPaths.filter((filePath) => !codeownersPaths.includes(filePath));
        if (filesNotOwned.length > 0) {
            core.setFailed(`The following files are not owned by anyone: ${filesNotOwned.join(', ')}`);
        }
    }
    catch (error) {
        core.setFailed('Errors were found while running the action.');
    }
}
exports.run = run;
//# sourceMappingURL=main.js.map