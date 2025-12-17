import { createAsync, useSearchParams } from '@solidjs/router';
import { glob, readdir } from 'fs/promises';
import { For, Show } from 'solid-js';
import { homedir } from 'os';
import { getParent } from '~/utils';

import styles from './index.module.css';

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

async function getHomedir() {
	"use server";
	return homedir();
}

export default function Home() {
	const [searchParams,] = useSearchParams();
	const home = createAsync(getHomedir);
	const path = () => (
		(searchParams.path ? decodeURIComponent(searchParams.path as string) : null )
		?? home()
		?? '/'
	) as string;
	const files = createAsync(() => getFiles(path()));
	const dirs = createAsync(() => getDirs(path()));

	function Directory(props: {
		dir: string,
		path?: string,
	}) {
		const newPath = () => encodeURIComponent(
			props.path !== undefined
			? props.path
			:  `${path()}/${props.dir}`
		);
		return <li>
			<a
				href={`./?path=${newPath()}`}
			>{props.dir}</a>
		</li>
	}

	function File(props: {
		file: string,
	}) {
		const newPath = () => encodeURIComponent(`${path()}/${props.file}`);
		return <li>
			<a
				href={`encounter/?path=${newPath()}`}
			>{props.file}</a>
		</li>
	}

	return (
		<main class={styles.explorer}>
			<h1>{path()}</h1>
			<h2>Directories</h2>
			<ul>
				<Directory path={home()} dir='~' />
				<Show when={path() !== '/'}>
					<Directory path={getParent(path())} dir='..' />
				</Show>
				<For each={dirs()}>{ dir =>
					<Directory dir={dir} />
				}</For>
			</ul>
			<h2>JSON Files</h2>
			<ul>
				<For each={files()}>{ file =>
					<File file={file} />
				}</For>
			</ul>
			<a href={`edit/?path=${encodeURIComponent(path() + '/untitled encounter.json')}`}>Create New</a>
		</main>
	);
}
