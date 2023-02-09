import { getLaunch } from "@/services/spacex";
import type { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";

const schemaQuery = z.object({
	id: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		return res.status(405).json({ ok: false, error: "Method not allowed" });
	}

	const queryParams = schemaQuery.safeParse(req.query);
	if (!queryParams.success) {
		return res.status(400).json({ ok: false, error: "Invalid query parameters" });
	}

	const id = queryParams.data.id;

	const launch = await getLaunch(id);
	if (launch === null) {
		return res.status(500).json({ ok: false, error: "Failed to fetch launches" });
	}

	res.status(200).json({ ok: true, data: launch });
}
