import { useState } from "react";
import { timeBetweenGames } from "../../../common";
import playThroughInjuriesFactor from "../../../common/playThroughInjuriesFactor";
import { HelpPopover } from "../../components";
import { toWorker } from "../../util";

const Slider = ({
	className,
	initialValue,
	playoffs,
	tid,
}: {
	className?: string;
	initialValue: number;
	playoffs?: boolean;
	tid: number;
}) => {
	const [value, setValue] = useState(initialValue);

	const id = `play-through-injury-${playoffs ? "playoffs" : "regular-season"}`;

	return (
		<div className={className}>
			<label className="mb-1" htmlFor={id}>
				{playoffs ? "Playoffs" : "Regular Season"}
			</label>
			<input
				type="range"
				className="form-control-range"
				id={id}
				value={value}
				min="0"
				max="10"
				step="1"
				onChange={async event => {
					const parsed = parseInt(event.target.value, 10);
					if (!Number.isNaN(parsed)) {
						setValue(parsed);
						await toWorker(
							"main",
							"updatePlayThroughInjuries",
							tid,
							parsed,
							playoffs,
						);
					}
				}}
			/>
			<div className="mt-1">
				{value === 0 ? (
					"Only play fully healthy players"
				) : (
					<>
						{value} {timeBetweenGames(value)} (
						{Math.round(100 * playThroughInjuriesFactor(value))}% performance)
					</>
				)}
			</div>
		</div>
	);
};

const PlayThroughInjuriesSliders = ({
	t,
}: {
	t: {
		tid: number;
		playThroughInjuries: [number, number];
	};
}) => {
	return (
		<div
			style={{
				width: 200,
			}}
		>
			<b>
				Play Through Injuries{" "}
				<HelpPopover title="Play Through Injuries">
					<p>
						This allows you to determine when players should play through minor
						injuries. You can set the cutoff separately for the regular season
						and playoffs.
					</p>
					<p>
						The earlier a player comes back, the worse he will play. "90%
						performance" means a 70 ovr player will perform more like a 63 ovr
						player.
					</p>
					<p>
						Additionally, the injury rate is 50% higher when playing through an
						injury, which includes the possibility of a player either
						reaggrivating his current injury or getting a new injury.
					</p>
				</HelpPopover>
			</b>
			<form className="mt-2">
				<Slider
					className="mb-3"
					initialValue={t.playThroughInjuries[0]}
					tid={t.tid}
				/>
				<Slider playoffs initialValue={t.playThroughInjuries[1]} tid={t.tid} />
			</form>
		</div>
	);
};

export default PlayThroughInjuriesSliders;
