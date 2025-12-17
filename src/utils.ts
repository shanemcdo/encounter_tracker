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
