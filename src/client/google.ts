import * as React from "react";

interface GoogleOptimize {
	get: (experimentId: string) => string;
}

declare global {
	interface Window {
		dataLayer?: unknown[];
		google_optimize?: GoogleOptimize;
	}
}

export function useExperiment(experimentId: string): string {
	const [variant, setVariant] = React.useState<string>("0");

	React.useEffect(() => {
		(async () => {
			if (window.dataLayer != null) {
				await window.dataLayer.push({ event: "optimize.activate" });
			}

			const intervalId = setInterval(() => {
				if (window.google_optimize != null) {
					// Set the variant to the state.
					setVariant(window.google_optimize.get(experimentId));

					clearInterval(intervalId);
				}
			}, 100);
		})();
	}, [experimentId]);

	return variant;
}

export function useExperimentSearchInput(): boolean {
	const variant = useExperiment("oX6wVLxTRryCffOMVagcwg");

	return variant === "1";
}
