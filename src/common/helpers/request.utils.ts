import axios from 'axios';
import * as process from 'process';

const defaultUrlFreemo = process.env.FREEMO_API || '';
export function apiCall(
  auth: boolean,
  route: string,
  met: string,
  queryParam: object | null,
  bodyParam: object | null,
  token: string | null,
) {
  const headers = {};
  if (auth) {
    axios.defaults.headers.common.Authorization = `Token ${token}`;
  } else axios.defaults.headers.common.Authorization = ``;

  const config: any = {
    url: defaultUrlFreemo + route,
    method: met,
    headers: headers,
  };

  if (queryParam != null) config.params = queryParam;
  if (bodyParam != null) config.data = bodyParam;

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
      } else {
        return err;
      }
    });
}
