import urljoin from "url-join";
import { getSession } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from "next";

const PUBLIC_ROUTES = [
  { path: "gifts", method: "GET" },
  { path: "allergy", method: "PUT" },
];

const compareRoute = (apiPath: string, method: string) => (route) =>
  route.path === apiPath && route.method === method;

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
  if (session || PUBLIC_ROUTES.some(compareRoute(apiPath[0], req.method))) {
    if (req.body?.user_email) {
      if (req.body.user_email !== session.user.email) {
        res.status(401).send("Unauthorized");
      }
    }
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

    res.status(response.status).send(await response.text());
  } else {
    // Not Signed in
    res.status(401).send("Unauthorized");
  }
  res.end();
};
