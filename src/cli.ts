#!/usr/bin/env bun

import { resolve, dirname, join } from "path";
import { homedir } from "os";

const VERSION = "0.0.1";
const GLOBAL_CONFIG_DIR = join(homedir(), ".config", "vibecheck");
const GLOBAL_RULES_PATH = join(GLOBAL_CONFIG_DIR, "rules.md");

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

  // Create .claude/commands directory
  await Bun.write(resolve(commandsDir, ".gitkeep"), "");

  // Copy vibe template with global rules
  const vibeTemplate = Bun.file(resolve(templatesDir, "vibe.md"));
  if (!(await vibeTemplate.exists())) {
    console.error(`Template not found: vibe.md`);
    process.exit(1);
  }
  let vibeContent = await vibeTemplate.text();

  const globalRulesFile = Bun.file(GLOBAL_RULES_PATH);
  if (await globalRulesFile.exists()) {
    vibeContent += "\n" + await globalRulesFile.text();
    console.log(`Found global rules: ${GLOBAL_RULES_PATH}`);
  }
  await Bun.write(resolve(commandsDir, "vibe.md"), vibeContent);

  // Copy plain-language template
  const plainTemplate = Bun.file(resolve(templatesDir, "plain-language.md"));
  if (await plainTemplate.exists()) {
    await Bun.write(resolve(commandsDir, "plain-language.md"), await plainTemplate.text());
  }

  // Copy init template
  const initTemplate = Bun.file(resolve(templatesDir, "vibe-init.md"));
  if (await initTemplate.exists()) {
    await Bun.write(resolve(commandsDir, "vibe-init.md"), await initTemplate.text());
  }

  console.log(`Initialized vibecheck in ${cwd}`);
  console.log(`Created:`);
  console.log(`  .claude/commands/vibe.md`);
  console.log(`  .claude/commands/plain-language.md`);
  console.log(`  .claude/commands/vibe-init.md`);
  console.log(`\nCommands: /vibe, /plain-language, /init`);
}

async function status() {
  const cwd = process.cwd();
  const vibePath = resolve(cwd, ".claude", "commands", "vibe.md");
  const vibeFile = Bun.file(vibePath);
  const globalRulesFile = Bun.file(GLOBAL_RULES_PATH);

  const hasGlobalRules = await globalRulesFile.exists();
  console.log(`Global rules: ${hasGlobalRules ? GLOBAL_RULES_PATH : "not configured"}`);

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
