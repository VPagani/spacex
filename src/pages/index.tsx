/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Script from "next/script";
import { useQuery } from "@tanstack/react-query";

import * as SpaceX from "@/client/spacex";
import type { Launch } from "@/server/spacex";
import { formatUnixTimestamp } from "@/client/format";

import IconSuccess from "@/components/success";
import IconFailure from "@/components/failure";
import { useExperimentSearchInput } from "@/client/google";

export default function Home() {
	const [selectedLaunch, setSelectedLaunch] = React.useState<Launch | null>(null);

	const toggleSearchInput = useExperimentSearchInput();
	const [searchInput, setSearchInput] = React.useState("");

	return (
		<>
			<GoogleSetup />

			<div className="flex min-h-screen flex-col items-center justify-center py-2 dark:bg-slate-800 dark:text-white">
				<div className="flex w-full flex-1 flex-col items-center justify-center gap-5 px-20 pt-5 text-center">
					<h1 className="text-4xl font-bold">SpaceX Launches</h1>

					{toggleSearchInput && (
						<div className="flex">
							<input
								className="flex-1 rounded-md border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-slate-700 dark:text-white"
								type="text"
								placeholder="Search for a launch"
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
							/>
						</div>
					)}

					<div className="flex w-full flex-1 flex-row items-start justify-center gap-4 px-20 text-center">
						<PastLaunches
							searchInput={searchInput}
							selectedLaunch={selectedLaunch}
							setSelectedLaunch={setSelectedLaunch}
						/>
						<UpcomingLaunches
							searchInput={searchInput}
							selectedLaunch={selectedLaunch}
							setSelectedLaunch={setSelectedLaunch}
						/>
					</div>
				</div>

				{selectedLaunch && <ModalLaunch launch={selectedLaunch} onClose={() => setSelectedLaunch(null)} />}
			</div>
		</>
	);
}

export function GoogleSetup() {
	React.useEffect(() => {
		const dataLayer = (window.dataLayer = window.dataLayer ?? []);

		function gtag(...args: unknown[]) {
			dataLayer.push(args);
		}

		gtag("js", new Date());
		gtag("config", "G-JNW55GWE94");
	}, []);

	return (
		<>
			<Script async src="https://www.googleoptimize.com/optimize.js?id=OPT-KTW99F9" />
			<Script async src="https://www.googletagmanager.com/gtag/js?id=G-JNW55GWE94" />
		</>
	);
}

function PastLaunches({
	searchInput,
	selectedLaunch,
	setSelectedLaunch,
}: {
	searchInput: string;
	selectedLaunch: Launch | null;
	setSelectedLaunch: (launch: Launch | null) => void;
}) {
	const { data: launches } = useQuery(["past"], () => SpaceX.getPastLaunches());
	const pastLaunches = launches?.ok
		? SpaceX.sortLaunchesReverseChronologically(SpaceX.filterLaunchesSearch(launches.data, searchInput))
		: [];

	console.log(selectedLaunch?.id);

	return (
		<div className="flex w-1/2 flex-col items-center justify-start gap-2">
			<h2 className="text-xl font-bold">Past SpaceX launches</h2>
			{pastLaunches.map((launch) => (
				<Launch
					key={launch.id}
					launch={launch}
					selected={launch.id === selectedLaunch?.id}
					onClick={() => {
						if (launch.id === selectedLaunch?.id) {
							setSelectedLaunch(null);
						} else {
							setSelectedLaunch(launch);
						}
					}}
				/>
			))}
		</div>
	);
}

function UpcomingLaunches({
	searchInput,
	selectedLaunch,
	setSelectedLaunch,
}: {
	searchInput: string;
	selectedLaunch: Launch | null;
	setSelectedLaunch: (launch: Launch | null) => void;
}) {
	const { data: launches } = useQuery(["upcomming"], () => SpaceX.getUpcomingLaunches());
	const upcommingLaunches = launches?.ok
		? SpaceX.sortLaunchesChronologically(SpaceX.filterLaunchesSearch(launches.data, searchInput))
		: [];

	return (
		<div className="flex w-1/2 flex-col items-center justify-start gap-2">
			<h2 className="text-xl font-bold">Upcoming SpaceX launches</h2>

			{upcommingLaunches.map((launch) => (
				<Launch
					key={launch.id}
					launch={launch}
					selected={launch.id === selectedLaunch?.id}
					onClick={() => {
						if (launch.id === selectedLaunch?.id) {
							setSelectedLaunch(null);
						} else {
							setSelectedLaunch(launch);
						}
					}}
				/>
			))}
		</div>
	);
}

function Launch(props: { launch: Launch; selected: boolean; onClick: () => void }) {
	const { launch, selected, onClick } = props;

	const dateFormat = formatUnixTimestamp(launch.date_unix, "en-US");

	return (
		<div
			className={
				"mx-auto flex w-full cursor-pointer flex-col items-center justify-center rounded-md bg-white px-4 py-6 shadow-lg transition-colors hover:bg-sky-100 dark:bg-slate-500 hover:dark:bg-sky-900" +
				(selected ? " bg-sky-300 dark:bg-sky-900" : "")
			}
			onClick={onClick}
		>
			<div className="flex w-full items-center justify-start gap-1">
				{launch.links.patch.small ? (
					<img
						className="h-16 w-16 object-contain"
						src={launch.links.patch.small}
						alt="avatar"
						referrerPolicy="no-referrer"
						loading="lazy"
					/>
				) : (
					<div className="justify-cente flex h-16 w-16 items-center p-1">
						<div className="h-full w-full rounded-full border-2 border-dashed border-gray-400 bg-gray-300 opacity-50"></div>
					</div>
				)}

				<h1 className="text-left text-lg font-semibold text-gray-700 dark:text-white">{launch.name}</h1>
			</div>
			<div className="flex w-full flex-row justify-end gap-2">
				{launch.success != null && (launch.success ? <IconSuccess /> : <IconFailure />)}
				<div className="">{dateFormat}</div>
			</div>
			{/* <p className="mt-2 text-gray-600 dark:text-gray-400">{launch.details}</p> */}
		</div>
	);
}

function ModalLaunch({ launch, onClose }: { launch: Launch; onClose: () => void }) {
	const dateFormat = formatUnixTimestamp(launch.date_unix, "en-US");

	return (
		<div className="fixed inset-0 z-10 overflow-y-auto">
			<div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
				<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

				{/* This element is to trick the browser into centering the modal contents. */}
				<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
					&#8203;
				</span>
				<div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
					<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div className="sm:flex sm:items-start">
							<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<p className="mb-2 text-xs text-gray-500">{dateFormat}</p>
								<h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
									{launch.name}
								</h3>
								<div className="mt-2 flex flex-col gap-2">
									<p className="text-sm text-gray-500">
										{launch.details?.replace("\n", "\n\n") ?? "No details"}
									</p>
									{launch.links.article && (
										<a
											className="text-sm text-blue-500 hover:text-blue-700"
											href={launch.links.article}
											target="_blank"
											rel="noreferrer"
										>
											Article
										</a>
									)}
								</div>
							</div>
							<div className="ml-auto flex h-24 w-24 flex-shrink-0">
								{launch.links.patch.small && (
									<img
										className="h-full w-full object-contain"
										src={launch.links.patch.small}
										alt=""
									/>
								)}
							</div>
						</div>
					</div>
					<div className="flex h-full w-full">
						{launch.links.youtube_id && (
							<div className="aspect-video h-full w-full">
								<iframe
									width="853"
									height="480"
									className="aspect-video h-full w-full"
									src={`https://www.youtube.com/embed/${launch.links.youtube_id}`}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									title="Embedded youtube"
								/>
							</div>
						)}
					</div>
					<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
							onClick={onClose}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
