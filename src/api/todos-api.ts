import { NewTodo } from '../types/NewTodo';
import { Todo } from '../types/Todo';
import { UpdateTodosArgs } from '../types/UpdateTodoArgs';
import { client } from '../utils/fetchClient';

const getByUser = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

const create = (todo: NewTodo) => {
  return client.post<Todo>('/todos', todo);
};

const remove = (ids: number[]) : Promise<number[]> => {
  return Promise
    .all(ids.map(id => client.delete(`/todos/${id}`))) as Promise<number []>;
};

const update = (todos: UpdateTodosArgs[])
: Promise<Todo[]> => {
  return Promise
    .all(todos.map(todo => client.patch(`/todos/${todo.id}`, todo.data))) as Promise<Todo []>;
};

export const todosApi = {
  getByUser,
  create,
  remove,
  update,
};
