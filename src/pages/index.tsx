/* eslint-disable @next/next/no-img-element */
import { useQuery } from "@tanstack/react-query";

import * as SpaceX from "@/client/spacex";
import type { Launch } from "@/server/spacex";
import { formatUnixTimestamp } from "@/client/format";

import IconSuccess from "@/components/icons/success";
import IconFailure from "@/components/icons/failure";

export default function Home() {
	return (
		<div className="flex flex-col items-center min-h-screen gap-10 pt-10">
			<h1 className="text-4xl font-bold text-center">SpaceX Launches</h1>

			<div className="flex flex-row items-start justify-center w-screen max-w-7xl py-2 px-8 gap-8">
				<PastLaunches />
				<UpcomingLaunches />
			</div>
		</div>
	);
}

function PastLaunches() {
	const { data: queryPastLaunches } = useQuery(["past"], () => SpaceX.getPastLaunches());
	const pastLaunches = queryPastLaunches?.ok ? queryPastLaunches.data.sort((a, b) => b.date_unix - a.date_unix) : [];

	return (
		<div className="w-1/2 flex flex-col items-center justify-start gap-2">
			<h2 className="text-2xl font-bold">Past SpaceX launches</h2>
			{pastLaunches.map((launch) => (
				<Launch key={launch.id} launch={launch} />
			))}
		</div>
	);
}

function UpcomingLaunches() {
	const { data: launches, isLoading } = useQuery(["upcomming"], () => SpaceX.getUpcomingLaunches());
	const upcommingLaunches = launches?.ok ? launches.data.sort((a, b) => a.date_unix - b.date_unix) : [];

	return (
		<div className="w-1/2 flex flex-col items-center justify-start gap-2">
			<h2 className="text-2xl font-bold">Upcoming SpaceX launches</h2>

			{upcommingLaunches.map((launch) => (
				<Launch key={launch.id} launch={launch} />
			))}
		</div>
	);
}

function Launch({ launch }: { launch: Launch }) {
	const dateFormat = formatUnixTimestamp(launch.date_unix);
	// const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format();

	return (
		<div className="flex flex-col items-center justify-center w-full px-4 py-6 mx-auto bg-white rounded-md shadow-lg dark:bg-gray-800">
			<div className="w-full flex items-center justify-start">
				{launch.links.patch.small ? (
					<img
						className="object-contain w-16 h-16"
						src={launch.links.patch.small}
						alt="avatar"
						referrerPolicy="no-referrer"
					/>
				) : (
					<div className="flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full border-2 border-dashed border-gray-500"></div>
				)}

				<h1 className="mx-2 text-lg font-semibold text-gray-700 dark:text-white">{launch.name}</h1>
				{launch.success != null && (launch.success ? <IconSuccess /> : <IconFailure />)}
			</div>
			<div>{dateFormat}</div>
			<p className="mt-2 text-gray-600 dark:text-gray-400">{launch.details}</p>
		</div>
	);
}
