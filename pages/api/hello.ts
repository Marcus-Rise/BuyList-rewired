// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler } from "next";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

const handler: NextApiHandler = async (req, res) => {
  const { accessToken } = await getAccessToken(req, res);

  res.status(200).json({ token: accessToken });
};

export default withApiAuthRequired(handler);
