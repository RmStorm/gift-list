import urljoin from "url-join";
import { getSession } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from "next";
import { ADMIN_USERS } from "../../../components/navbar";

const PUBLIC_ROUTES = [{ path: "gifts", method: "GET" }];
const LOGGED_IN_ROUTES = [
  { path: "allergy", method: "PUT" },
  { path: "gift_claim", method: "GET" },
  { path: "gift_claim", method: "POST" },
];

const compareRoute = (apiPath: string, method: string) => (route) =>
  route.path === apiPath && route.method === method;

const doRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  apiPath: string | string[],
  queryParams: URLSearchParams
) => {
  const host = `http://${process.env.GIFT_LIST_API_SERVICE_HOST}:${process.env.GIFT_LIST_API_SERVICE_PORT}/`;

  // Typescript does not allow passing the headers straight in,
  // they have to be parsed to string[][]
  const responseHeaders = req.rawHeaders.reduce(
    (r, e, i) =>
      i % 2 === 0 ? r.push([e]) && r : r[r.length - 1].push(e) && r,
    []
  );

  let fullUrl = urljoin(host, ...apiPath);
  const response = await fetch(`${fullUrl}?${queryParams}`, {
    method: req.method,
    headers: responseHeaders,
    ...(req.method !== "GET" && {
      body: JSON.stringify({ ...req.body }),
    }),
  });
  res.status(response.status).send(await response.text());
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await getSession({ req });

  const {
    query: { apiPath, ...rest },
  } = req;
  const queryParams = new URLSearchParams(
    Object.keys(rest).map((key) => [`${key}`, `${rest[key]}`])
  );

  // apiPath is an array of / seperated url parts, the 0th part is the path I care about for now
  if (PUBLIC_ROUTES.some(compareRoute(apiPath[0], req.method))) {
    await doRequest(req, res, apiPath, queryParams);
  } else if (session) {
    const subjectUser = req.body?.user_email || queryParams.get("user_email");
    if (
      subjectUser === session.user.email &&
      LOGGED_IN_ROUTES.some(compareRoute(apiPath[0], req.method))
    ) {
      // user affected by request matched session user, life is cool
      await doRequest(req, res, apiPath, queryParams);
    } else if (ADMIN_USERS.includes(session.user.email)) {
      // admin's gonna admin
      await doRequest(req, res, apiPath, queryParams);
    } else {
      // Not authorized due to session mismatch
      res.status(401).send("Unauthorized, user mismatch");
    }
  } else {
    // Not Signed in and not public route
    res.status(401).send("Unauthorized, endpoint not public");
  }
  res.end();
};
