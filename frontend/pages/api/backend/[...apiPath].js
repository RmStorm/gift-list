import urljoin from "url-join";

export default async (req, res) => {
  const host = `http://${process.env.GIFT_LIST_API_SERVICE_HOST}:${process.env.GIFT_LIST_API_SERVICE_PORT}/`;
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query: { apiPath, ...otherQueryParams },
  } = req;

  // console.log(`hit api at '${apiPath}', with`, otherQueryParams);

  const fullUrl = urljoin(host, ...apiPath);
  const response = await fetch(fullUrl, { method: req.method });

  res.status(response.status).json(await response.json());
};
