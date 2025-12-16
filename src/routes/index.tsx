import { createAsync, useSearchParams } from "@solidjs/router";
import { glob, readdir } from "fs/promises";
import { For, Show } from "solid-js";

// https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
async function getDirs(cwd: string) {
	"use server";
	return (await readdir(cwd, { withFileTypes: true }))
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);
}

async function getFiles(cwd: string) {
	"use server";
	const result = [];
	for await(const file of glob('*.json', { cwd })) {
		result.push(file);
	}
	return result;
}

async function getCwd() {
	"use server";
	return process.cwd();
}

export default function Home() {
	const [searchParams,] = useSearchParams();
	const cwd = createAsync(() => getCwd());
	const path = () => (
		(searchParams.path ? decodeURIComponent(searchParams.path as string) : null )
		?? "/"
	) as string;
	const files = createAsync(() => getFiles(path()));
	const dirs = createAsync(() => getDirs(path()));
	return (
		<main>
			<Show when={searchParams.prev}>
				<a href={`/?path=${decodeURIComponent(searchParams.prev as string)}`}>Back</a>
			</Show>
			<p>{path()}</p>
			<br />
			<For each={dirs()}>{ dir =>
				<a href={`./?path=${encodeURIComponent(path())}/${encodeURIComponent(dir)}&prev=${encodeURIComponent(path())}`}>{dir}</a>
			}</For>
			<br />
			<For each={files()}>{ file =>
				<a href={`encounter/?encounter=${encodeURIComponent(path())}/${encodeURIComponent(file)}&prev=${encodeURIComponent(path())}`}>{file}</a>
			}</For>
		</main>
	);
}
