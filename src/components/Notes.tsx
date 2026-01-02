import style from './Notes.module.css'

export default function Notes(props: {
	ref?: HTMLTextAreaElement,
	value?: string,
}) {
	return <div class={style.notes}>
		<h2>Notes</h2>
		<textarea {...props} />
	</div>
}
