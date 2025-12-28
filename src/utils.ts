import { writeFile, readFile, unlink } from 'fs/promises';

const API_URL = 'https://www.dnd5eapi.co/api/2014/monsters/';
const REFERENCE_URL = 'https://5thsrd.org/gamemaster_rules/monsters/';

export function getIndexFromName(name: string) {
	return name.toLocaleLowerCase().replace(' ', '-')
}

function getReferencePageByName(name: string) {
	return name.toLocaleLowerCase().replace(' ', '_')
}

export function getReferenceURL(name: string) {
	return REFERENCE_URL + getReferencePageByName(name);
}

export async function getEncounter(filename: string): Promise<Encounter> {
	"use server";
	try {
		const file = await readFile(filename, 'utf-8');
		const encounters = JSON.parse(file);
		return encounters;
	} catch(e) {
		console.error(e)
		return [];
	}
}

const fetched: Record<string, any> = {};
async function memoFetch(url: string) {
	if(url in fetched) {
		return fetched[url];
	}
	const res = await fetch(url);
	if(!res.ok) {
		return [false, null];
	}
	const json = await res.json();
	fetched[url] = [true, json];
	return fetched[url];
}

export async function fetchMonsterAPI(index: string) {
	return await memoFetch(`${API_URL}${index}`);
}

export function getParent(path: string) {
	if(path === '/' || path === '.' || path === './' || path === '/') {
		return path;
	}
	const split = path.split('/');
	let end;
	do {
		end = split.pop();
	} while(end === '')
	const result = split.join('/');
	return result === '' ? '/' : result;
}

export function getName(path: string) {
	return path.split('/').at(-1)?.split('.')[0];
}

export async function writeJSON(path: string, data: any) {
	"use server";
	await writeFile(path, JSON.stringify(data), 'utf-8');
}

export async function deleteFile(path: string) {
	"use server";
	await unlink(path)
}

export async function deleteFileConfirm(path: string) {
	if(confirm(`Are you sure you want to delete file "${path}"`))
		await deleteFile(path);
}

export function rollD20() {
	return Math.floor(Math.random() * 20) + 1;
}
