import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";

type PatchBody = {
  page_id: string;
  newVotes: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;

  if (method === "PATCH") {
    const { page_id, newVotes } = JSON.parse(body) as PatchBody;

    const notion = new Client({
      auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
    });
    const result = await notion.pages.update({
      page_id,
      properties: {
        votes: { number: newVotes },
      },
    });

    res.json(result)
  }
}
