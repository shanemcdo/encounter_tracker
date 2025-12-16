import "./Creature.module.css";

interface Props {
	creature: Creature,
};

export default function Creature(props: Props) {
  return (
  	<p>{props.creature.name}: {props.creature.max_hp}/{props.creature.max_hp}</p>
  );
}
