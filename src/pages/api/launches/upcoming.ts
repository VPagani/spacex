import { getUpcomingLaunches } from "@/services/spacex";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		return res.status(405).json({ ok: false, error: "Method not allowed" });
	}

	const launches = await getUpcomingLaunches();
	if (launches == null) {
		return res.status(500).json({ ok: false, error: "Failed to fetch launch" });
	}

	res.status(200).json({ ok: true, data: launches });
}
