#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const Project = require('./project');
const utils = require('./utils');
const settings = require('./settings');
const gitHandler = require('./gitHandler');
const githubHandler = require('./githubHandler');
const questionnaire = require('./questionnaire');
const template = require('./template');

async function run() {
  const TEMPLATE_PATH = path.join(__dirname, '..', 'template');

  // First arg = path
  const destPath = utils.fs.resolvePath(process.argv[2]);
  if (!destPath) {
    throw new Error('A path for the new project is required');
  }

  // TODO Include here a way to get "options" for the other args

  // Do not continue if the project folder already exists.
  if (fs.existsSync(destPath)) {
    throw new Error(`The project folder '${destPath} already exists. You need to specify a different path.`);
  }

  // Setup the defaults
  const defaults = {
    projectName: utils.string.normalizeName(destPath),
    gitUserName: await gitHandler.userValue('name'),
    gitUserEmail: await gitHandler.userValue('email'),
    license: settings.default.license,
    version: settings.default.version,
  };

  // Questionnaire for the options
  const answers = await questionnaire.run(defaults);

  // Add extra values to the answers
  Object.assign(answers, {
    path: destPath,
  });

  // Create project object
  const project = new Project(answers);

  // Create folder
  try {
    fs.mkdirSync(project.path);
  } catch (error) {
    console.error('The folder project was not created');
    throw error;
  }

  // Initialize git in the dest folder
  await gitHandler.init(project.path);

  // Create github repository and include properties to the project object
  if (project.useGithub) {
    const resp = await githubHandler.create(project);
    if (resp !== false) {
      project.setGithubValues(resp);
      gitHandler.addRemote(project.path, project.git.sshUrl);
    }
  }

  // Copy template files
  template.copy(TEMPLATE_PATH, project.path);

  // TODO Copy license and update with project data


  // Update readme with project data
  template.updateFile(path.join(project.path, 'README.md'), project.dictionary);
  template.updateFile(path.join(project.path, 'package.json'), project.dictionary);

  // Install devDependencies
  console.log('Installing dev dependencies...');
  const args = ['install', '-D'].concat(settings.lintPkgs, answers.testPackages);
  await utils.process.spawnp(
    'npm',
    args,
    destPath,
  );

  // Commit and push
  console.log(await gitHandler.commit(project.path));

  if (project.hasRemote) {
    await gitHandler.push(project.path);
    console.log(`Code pushed to ${project.git.sshUrl}`);
  }
}

run();
