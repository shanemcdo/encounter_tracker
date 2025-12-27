import { createAsync, useSearchParams } from '@solidjs/router';
import { glob, readdir } from 'fs/promises';
import { For, Show, createResource } from 'solid-js';
import { homedir } from 'os';
import { deleteFileConfirm, getParent } from '~/utils';
import MaybeTitle from '~/components/MaybeTitle';

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
	const [files, { refetch: refetchFiles }] = createResource(path, getFiles);
	const [dirs] = createResource(path, getDirs);

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
		return <>
			<label>{props.file}</label>
			<a
				href={`encounter/?path=${newPath()}`}
			>Play</a>
			<a
				href={`edit/?path=${newPath()}`}
			>Edit</a>
			<button
				onclick={async () => {
					await deleteFileConfirm(decodeURIComponent(newPath()));
					await refetchFiles();
				}}
			>Delete</button>
		</>
	}

	return (
		<main class={styles.explorer}>
			<MaybeTitle text={path()} />
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
			<div class={styles.grid}>
				<For each={files()}>{ file =>
					<File file={file} />
				}</For>
			</div>
			<a href={`edit/?path=${encodeURIComponent(path() + '/untitled encounter.json')}`}>Create New</a>
		</main>
	);
}
