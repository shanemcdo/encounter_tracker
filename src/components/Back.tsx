import { mergeProps, Show } from 'solid-js';

export default function Back(p: {
	path?: string,
	text?: string,
}) {
	const props = mergeProps({
		text: 'Back',
	}, p);
	return <Show
		when={props.path}
	>
		<a
			href={`../?path=${encodeURIComponent(props.path!)}`}
		>{props.text}</a>
	</Show>;
}
