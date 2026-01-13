#!/usr/bin/env bun

import { resolve, dirname } from "path";

const VERSION = "0.0.1";

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
  const targetPath = resolve(commandsDir, "vibe.md");

  // Find template relative to this script
  const scriptDir = dirname(Bun.main);
  const templatePath = resolve(scriptDir, "..", "templates", "vibe.md");

  // Check if template exists
  const templateFile = Bun.file(templatePath);
  if (!(await templateFile.exists())) {
    console.error(`Template not found: ${templatePath}`);
    process.exit(1);
  }

  // Create .claude/commands directory
  await Bun.write(resolve(commandsDir, ".gitkeep"), "");

  // Copy template
  const templateContent = await templateFile.text();
  await Bun.write(targetPath, templateContent);

  console.log(`Initialized vibecheck in ${cwd}`);
  console.log(`Created: .claude/commands/vibe.md`);
  console.log(`\nYou can now use /vibe in Claude Code to analyze your tasks.`);
}

async function status() {
  const cwd = process.cwd();
  const vibePath = resolve(cwd, ".claude", "commands", "vibe.md");
  const vibeFile = Bun.file(vibePath);

  if (await vibeFile.exists()) {
    console.log(`vibecheck is enabled in ${cwd}`);
    console.log(`  /vibe command: .claude/commands/vibe.md`);
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
