// scripts/apply-template.ts
// Apply this template repo's structure/files to an existing BHVR app repo.
//
// Usage (from template repo root):
//   bun run scripts/apply-template.ts --target ../my-new-app
// Options:
//   --target <path>   Required. Path to target repo root.
//   --dry-run         Show what would change, write nothing.
//   --force           Overwrite even if target files exist (default: true for "template files").
//   --no-merge-pkg    Overwrite package.json instead of merging (default: merge).
//
// Notes:
// - This script intentionally copies a curated set of paths. Expand as needed.
// - package.json merge is shallow for most fields and deep for scripts/deps.
// - It preserves the target repo name/version and any existing custom fields.

import { existsSync } from "node:fs";
import {
	mkdir,
	readFile,
	stat,
	writeFile,
	readdir,
	copyFile,
} from "node:fs/promises";
import * as path from "node:path";

type Json = Record<string, unknown>;
type PkgJson = {
	name?: string;
	version?: string;
	private?: boolean;
	type?: string;
	workspaces?: unknown;
	scripts?: Record<string, string>;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;
	[key: string]: unknown;
};

const TEMPLATE_ROOT = process.cwd();

function parseArgs(argv: string[]) {
	const args = new Map<string, string | boolean>();
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (!a.startsWith("--")) continue;
		const key = a.slice(2);
		const next = argv[i + 1];
		if (next && !next.startsWith("--")) {
			args.set(key, next);
			i++;
		} else {
			args.set(key, true);
		}
	}
	return {
		target: (args.get("target") as string | undefined) ?? "",
		dryRun: Boolean(args.get("dry-run")),
		force: args.has("force") ? Boolean(args.get("force")) : true,
		mergePkg: args.has("no-merge-pkg") ? false : true,
	};
}

async function readJson<T extends Json>(filePath: string): Promise<T> {
	const raw = await readFile(filePath, "utf8");
	return JSON.parse(raw) as T;
}

async function writeJson(filePath: string, data: unknown, dryRun: boolean) {
	const out = `${JSON.stringify(data, null, "\t")}\n`;
	if (dryRun) return;
	await writeFile(filePath, out, "utf8");
}

async function ensureDir(dirPath: string, dryRun: boolean) {
	if (dryRun) return;
	await mkdir(dirPath, { recursive: true });
}

function rel(p: string) {
	return path.relative(TEMPLATE_ROOT, p) || ".";
}

async function copyPath(
	srcAbs: string,
	dstAbs: string,
	opts: { dryRun: boolean; force: boolean },
) {
	const s = await stat(srcAbs);
	if (s.isDirectory()) {
		await ensureDir(dstAbs, opts.dryRun);
		const entries = await readdir(srcAbs);
		for (const entry of entries) {
			await copyPath(path.join(srcAbs, entry), path.join(dstAbs, entry), opts);
		}
		return;
	}

	// file
	const dstExists = existsSync(dstAbs);
	if (dstExists && !opts.force) return;

	await ensureDir(path.dirname(dstAbs), opts.dryRun);

	if (!opts.dryRun) {
		await copyFile(srcAbs, dstAbs);
	}
}

function mergeStringMap(
	a: Record<string, string> | undefined,
	b: Record<string, string> | undefined,
) {
	return { ...(a ?? {}), ...(b ?? {}) };
}

function mergePackageJson(targetPkg: PkgJson, templatePkg: PkgJson): PkgJson {
	// Preserve target identity fields by default
	const preserved: (keyof PkgJson)[] = ["name", "version"];

	const out: PkgJson = {
		...templatePkg,
		...targetPkg,
	};

	for (const k of preserved) {
		if (targetPkg[k] !== undefined) out[k] = targetPkg[k];
	}

	// Deep-ish merge maps
	out.scripts = mergeStringMap(templatePkg.scripts, targetPkg.scripts);
	out.dependencies = mergeStringMap(
		templatePkg.dependencies,
		targetPkg.dependencies,
	);
	out.devDependencies = mergeStringMap(
		templatePkg.devDependencies,
		targetPkg.devDependencies,
	);
	out.peerDependencies = mergeStringMap(
		templatePkg.peerDependencies,
		targetPkg.peerDependencies,
	);
	out.optionalDependencies = mergeStringMap(
		templatePkg.optionalDependencies,
		targetPkg.optionalDependencies,
	);

	return out;
}

/**
 * Curated copy list.
 * Add/remove entries based on what you want the template to enforce.
 *
 * - Files are copied to the same relative path.
 * - Dirs are recursively copied.
 */
const COPY_PATHS: string[] = [
	// Root config
	"biome.json",
	"turbo.json",
	".gitignore",
	".gitattributes",
	".github/workflows/ci.yml",
	".husky",
	"docker-compose.yml",
	"fly.server.toml",

	// Root scripts/util
	"scripts/apply-template.ts",

	// Shared
	"shared/tsconfig.json",
	"shared/src",

	// Server
	"server/Dockerfile",
	"server/tsconfig.json",
	"server/drizzle.config.ts",
	"server/src/app.ts",
	"server/src/dev.ts",
	"server/src/index.ts",
	"server/src/client.ts",
	"server/src/lib/env.ts",
	"server/src/lib/db",
	"server/src/lib/auth",
	"server/src/lib/middleware",
	"server/src/routes",

	// Client
	"client/tsconfig.json",
	"client/tsconfig.node.json",
	"client/vite.config.ts",
	"client/index.html",
	"client/src",
	"client/components.json",
];

async function main() {
	const { target, dryRun, force, mergePkg } = parseArgs(process.argv.slice(2));

	if (!target) {
		console.error("Missing --target <path>");
		process.exit(1);
	}

	const targetRoot = path.resolve(TEMPLATE_ROOT, target);
	const targetPkgPath = path.join(targetRoot, "package.json");
	const templatePkgPath = path.join(TEMPLATE_ROOT, "package.json");

	if (!existsSync(targetPkgPath)) {
		console.error(
			`Target does not look like a repo root (missing package.json): ${targetRoot}`,
		);
		process.exit(1);
	}

	// Copy files/dirs
	for (const p of COPY_PATHS) {
		const srcAbs = path.join(TEMPLATE_ROOT, p);
		const dstAbs = path.join(targetRoot, p);

		if (!existsSync(srcAbs)) {
			console.warn(`(skip) missing in template: ${p}`);
			continue;
		}

		// Avoid copying the apply script into itself if target is template
		if (path.resolve(dstAbs) === path.resolve(srcAbs)) continue;

		if (dryRun) {
			console.log(`[dry-run] copy ${p}`);
		}
		await copyPath(srcAbs, dstAbs, { dryRun, force });
	}

	// Merge root package.json
	const templatePkg = await readJson<PkgJson>(templatePkgPath);
	const targetPkg = await readJson<PkgJson>(targetPkgPath);

	const nextPkg = mergePkg
		? mergePackageJson(targetPkg, templatePkg)
		: templatePkg;

	if (dryRun) {
		console.log("[dry-run] update target package.json");
	} else {
		await writeJson(targetPkgPath, nextPkg, false);
	}

	// Optional: normalize client/server/shared package.json scripts/deps by copying (no merge).
	// If you want merges there too, add similar merge logic.
	const wsPkgs = [
		"client/package.json",
		"server/package.json",
		"shared/package.json",
	] as const;
	for (const ws of wsPkgs) {
		const src = path.join(TEMPLATE_ROOT, ws);
		const dst = path.join(targetRoot, ws);
		if (!existsSync(src)) continue;

		if (dryRun) {
			console.log(`[dry-run] copy ${ws}`);
		}
		await copyPath(src, dst, { dryRun, force: true });
	}

	console.log(dryRun ? "Done (dry-run)." : "Done.");
	console.log("Next steps in target:");
	console.log("- bun install");
	console.log("- (optional) bun run lint && bun run type-check");
	console.log("- docker compose up -d db && (cd server && bun run db:migrate)");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
