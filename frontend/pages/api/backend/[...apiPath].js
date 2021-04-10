import urljoin from "url-join";
import { getSession } from "next-auth/client";

const PUBLIC_ROUTES = ["gifts"];

export default async (req, res) => {
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

    let fullUrl = urljoin(host, ...apiPath);
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: req.headers,
      ...(req.method !== "GET" && { body: JSON.stringify({ ...req.body }) }),
    });

    res.status(response.status).json(await response.json());
  } else {
    // Not Signed in
    res.status(401).send("Unauthorized");
  }
  res.end();
};
