#!/usr/bin/env bun

import { resolve, dirname } from "path";
import { readdir } from "node:fs/promises";
import { homedir } from "node:os";

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
  { name: "vibe-bookkeep", template: "vibe-bookkeep.md" },
];

function printVersion() {
  console.log(`vibecheck v${VERSION}`);
}

function printHelp() {
  console.log(`vibecheck v${VERSION}

Usage: vc <command>

Commands:
  init              Initialize vibecheck in current directory
  branch <desc>     Create numbered feature branch (e.g., 001-add-auth)
  status            Check if vibecheck is enabled
  version           Show version information
  help              Show this help message
`);
}

// Check if any branch (local or remote) starts with the given prefix.
// Strips the "* " marker from current branch before comparing.
async function branchExists(prefix: string): Promise<boolean> {
  const result = await Bun.$`git branch -a`.text().catch(() => "");
  return result.split("\n").some(b => b.trim().replace(/^\*\s*/, "").startsWith(prefix));
}

// Spec directories under arch/specs/ also reserve numbers — even after their
// branches are merged and deleted, the dir remains. Without this, recycled
// branch numbers collide with prior plan/spec dirs.
async function specDirExists(prefix: string): Promise<boolean> {
  const root = (await Bun.$`git rev-parse --show-toplevel`.text().catch(() => "")).trim();
  if (!root) return false;
  const entries = await readdir(resolve(root, "arch", "specs")).catch(() => [] as string[]);
  return entries.some(name => name.startsWith(prefix));
}

async function listSpecNumbers(): Promise<number[]> {
  const root = (await Bun.$`git rev-parse --show-toplevel`.text().catch(() => "")).trim();
  if (!root) return [];
  const entries = await readdir(resolve(root, "arch", "specs")).catch(() => [] as string[]);
  return entries
    .map(name => /^(\d{3})-/.exec(name)?.[1])
    .filter((n): n is string => n !== undefined)
    .map(n => parseInt(n));
}

async function getNextBranchNumber(): Promise<number> {
  const result = await Bun.$`git branch -a`.text().catch(() => "");
  const matches = result.match(/(\d{3})-/g) || [];
  const branchNumbers = matches.map(m => parseInt(m.replace("-", "")));
  const specNumbers = await listSpecNumbers();
  const numbers = [...branchNumbers, ...specNumbers];
  let next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  // Sanity check: increment past any number reserved by a branch or spec dir.
  while (true) {
    const prefix = String(next).padStart(3, "0") + "-";
    if (!(await branchExists(prefix)) && !(await specDirExists(prefix))) break;
    next++;
  }
  return next;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

async function branch(description: string) {
  if (!description) {
    console.error("Usage: vc branch <feature description>");
    process.exit(1);
  }
  const num = await getNextBranchNumber();
  const slug = slugify(description);
  const branchName = `${String(num).padStart(3, "0")}-${slug}`;

  await Bun.$`git checkout -b ${branchName}`;
  console.log(`Created branch: ${branchName}`);
}

async function init() {
  const cwd = process.cwd();
  if (resolve(cwd) === resolve(homedir())) {
    console.error("Refusing to init in $HOME — that would install commands globally into ~/.claude/commands.");
    console.error("Run 'vc init' from inside a project directory.");
    process.exit(1);
  }
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
  case "branch":
    await branch(process.argv.slice(3).join(" "));
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
