import type { Result } from "@/types/result";
import type { Launch, Launches } from "@/server/spacex";

export { Launch, Launches };

function request<T>(url: string): Promise<Result<T>> {
	return fetch(url, { next: { revalidate: 20 } }).then((res) => res.json());
}

export const getLaunch = (id: string) => request<Launch>(`/api/launches/${id}`);
export const getLatestLaunch = () => request<Launch>("/api/launches/latest");
export const getNextLaunch = () => request<Launch>("/api/launches/next");
export const getPastLaunches = () => request<Launches>("/api/launches/past");
export const getUpcomingLaunches = () => request<Launches>("/api/launches/upcoming");
