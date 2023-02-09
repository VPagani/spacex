import { useQuery } from "@tanstack/react-query";

import type { Launch } from "@/services/spacex";
import * as SpaceX from "@/client/spacex";

export default function Home() {
	const { data: queryUpcommingLaunches } = useQuery(["upcomming"], () => SpaceX.getUpcomingLaunches());
	const { data: queryPastLaunches } = useQuery(["past"], () => SpaceX.getPastLaunches());

	const upcommingLaunches = queryUpcommingLaunches?.ok
		? queryUpcommingLaunches.data.sort((a, b) => a.date_unix - b.date_unix)
		: [];
	const pastLaunches = queryPastLaunches?.ok ? queryPastLaunches.data.sort((a, b) => b.date_unix - a.date_unix) : [];

	return (
		<div className="flex flex-row items-start justify-center min-h-screen py-2 gap-8">
			<div className="flex flex-col items-center justify-center">
				<h2 className="text-2xl font-bold underline">Upcoming SpaceX launches</h2>
				{upcommingLaunches.map((launch) => (
					<Launch key={launch.id} launch={launch} />
				))}
			</div>
			<div className="flex flex-col items-center justify-center">
				<h2 className="text-2xl font-bold underline">Past SpaceX launches</h2>
				{pastLaunches.map((launch) => (
					<Launch key={launch.id} launch={launch} />
				))}
			</div>
		</div>
	);
}

function Launch({ launch }: { launch: Launch }) {
	const date = new Date(launch.date_unix * 1000);
	const dateFormat = new Intl.DateTimeFormat(navigator.languages[0] ?? navigator.language, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
	// const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format();

	return (
		<div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
			<div className="flex items-center justify-center">
				{launch.links.patch.small && (
					<img className="object-cover w-16 h-16 rounded-full" src={launch.links.patch.small} alt="avatar" />
				)}

				<h1 className="mx-2 text-lg font-semibold text-gray-700 dark:text-white">{launch.name}</h1>
				<div className="flex items-center justify-center w-6 h-6 text-sm text-white bg-green-500 rounded-full">
					{launch.success ? "✓" : "✗"}
				</div>

				{launch.links.youtube_id && (
					<a
						className="flex items-center justify-center w-6 h-6 ml-2 text-gray-200 bg-gray-600 rounded-full hover:bg-gray-500"
						href={`https://www.youtube.com/watch?v=${launch.links.youtube_id}`}
						target="_blank"
						rel="noreferrer"
					>
						<svg
							className="w-4 h-4"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M10 2a8 8 0 00-8 8 8 8 0 008 8 8 8 0 008-8 8 8 0 00-8-8zm3.5 11.5v-7l-6 3.5 6 3.5z"
								clipRule="evenodd"
							/>
						</svg>
					</a>
				)}

				<div>{dateFormat}</div>
			</div>
			<p className="mt-2 text-gray-600 dark:text-gray-400">{launch.details}</p>
		</div>
	);
}
