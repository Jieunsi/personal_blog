import { POST } from '../http';

export function createReply(data) {
  return POST({
    url: `/reply/create`,
    data,
  });
}
