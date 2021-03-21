import urljoin from "url-join";

export default async (req, res) => {
  const host = `http://${process.env.GIFT_LIST_API_SERVICE_HOST}:${process.env.GIFT_LIST_API_SERVICE_PORT}/`;
  const {
    query: { apiPath },
  } = req;

  // console.log(`hit api at '${apiPath}', with`, req);

  let fullUrl = urljoin(host, ...apiPath);
  const response = await fetch(fullUrl, {
    method: req.method,
    headers: req.headers,
    ...(req.method !== "GET" && { body: JSON.stringify({ ...req.body }) }),
  });

  res.status(response.status).json(await response.json());
};
