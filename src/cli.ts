#!/usr/bin/env bun

import { resolve, dirname } from "path";

const VERSION = "0.0.1";

interface Command {
  name: string;
  template: string;
}

const COMMANDS: Command[] = [
  { name: "vibe", template: "vibe.md" },
  { name: "plain-language", template: "plain-language.md" },
  { name: "vibe-init", template: "vibe-init.md" },
  { name: "vibe-what", template: "vibe-what.md" },
  { name: "vibe-how", template: "vibe-how.md" },
];

function printVersion() {
  console.log(`vibecheck v${VERSION}`);
}

function printHelp() {
  console.log(`vibecheck v${VERSION}

Usage: vc <command>

Commands:
  init       Initialize vibecheck in current directory (adds /vibe command)
  status     Check if vibecheck is enabled in current directory
  version    Show version information
  help       Show this help message
`);
}

async function init() {
  const cwd = process.cwd();
  const commandsDir = resolve(cwd, ".claude", "commands");
  const scriptDir = dirname(Bun.main);
  const templatesDir = resolve(scriptDir, "..", "templates");

  await Bun.write(resolve(commandsDir, ".gitkeep"), "");

  for (const cmd of COMMANDS) {
    const template = Bun.file(resolve(templatesDir, cmd.template));
    if (!(await template.exists())) continue;
    await Bun.write(resolve(commandsDir, cmd.template), await template.text());
  }

  console.log(`Initialized vibecheck in ${cwd}`);
  console.log(`Created: ${COMMANDS.map(c => `/${c.name}`).join(", ")}`);
}

async function status() {
  const cwd = process.cwd();
  const vibePath = resolve(cwd, ".claude", "commands", "vibe.md");
  const vibeFile = Bun.file(vibePath);

  if (await vibeFile.exists()) {
    console.log(`vibecheck is enabled in ${cwd}`);
  } else {
    console.log(`vibecheck is not enabled in ${cwd}`);
    console.log(`Run 'vc init' to enable it.`);
    process.exit(1);
  }
}

const command = process.argv[2];

switch (command) {
  case "init":
    await init();
    break;
  case "status":
    await status();
    break;
  case "version":
  case "-v":
  case "--version":
    printVersion();
    break;
  case "help":
  case "-h":
  case "--help":
  case undefined:
    printHelp();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
}
