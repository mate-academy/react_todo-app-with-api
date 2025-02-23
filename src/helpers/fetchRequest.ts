import { deleteTodo } from '../api/todos';

type FetchRequest = {
  request: typeof deleteTodo;
  id: number;
  onSuccess: () => void;
  onError: () => void;
  onTheEnd: () => void;
};

export const fetchRequest = ({
  request,
  id,
  onSuccess,
  onError,
  onTheEnd,
}: FetchRequest) => {
  return request(id).then(onSuccess).catch(onError).finally(onTheEnd);
};
