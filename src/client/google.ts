import * as React from "react";

interface DataLayer {
	push: (event: { event: string }) => Promise<void>;
}

interface GoogleOptimize {
	get: (experimentId: string) => number;
}

declare global {
	interface Window {
		dataLayer?: DataLayer;
		google_optimize?: GoogleOptimize;
	}
}

export function useExperiment(experimentId: string) {
	const [variant, setVariant] = React.useState<number>(0);

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

export function useExperimentSearchInput() {
	const variant = useExperiment("oX6wVLxTRryCffOMVagcwg");

	return variant === 1;
}