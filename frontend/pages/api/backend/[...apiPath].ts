import urljoin from "url-join";
import { getSession } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from "next";

const PUBLIC_ROUTES = ["gifts"];

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await getSession({ req });

  const host = `http://${process.env.GIFT_LIST_API_SERVICE_HOST}:${process.env.GIFT_LIST_API_SERVICE_PORT}/`;
  const {
    query: { apiPath },
  } = req;

  // apiPath is an array of / seperated url parts
  if (session || (PUBLIC_ROUTES.includes(apiPath[0]) && req.method === "GET")) {
    // console.log("Session", JSON.stringify(session, null, 2));
    // console.log(`hit api at '${apiPath}', with`, req);
    // console.log(`hit api at '${apiPath}', with`);

    // Typescript does not allow passing the headers straight in,
    // they have to be parsed to string[][]
    const responseHeaders = req.rawHeaders.reduce(
      (r, e, i) =>
        i % 2 === 0 ? r.push([e]) && r : r[r.length - 1].push(e) && r,
      []
    );
    let fullUrl = urljoin(host, ...apiPath);
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: responseHeaders,
      ...(req.method !== "GET" && { body: JSON.stringify({ ...req.body }) }),
    });

    res.status(response.status).json(await response.json());
  } else {
    // Not Signed in
    res.status(401).send("Unauthorized");
  }
  res.end();
};
