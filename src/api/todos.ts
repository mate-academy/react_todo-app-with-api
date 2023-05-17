import { Todo } from '../types/Todo';
import { TodoData } from '../types/TodoData';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (data: TodoData) => {
  return client.post('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const changeTodo = (
  todoId: number,
  data: string | boolean,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};

// Lilia's help _||_
//              \  /
//               \/

// export const changeTodoStatus = (id: number, completed: boolean) => {
//   return client.patch(`/todos/${id}`, completed);
// };

// export const changeTodoTitle = (id: number, title: string) => {
//   return client.patch(`/todos/${id}`, title);
// };

// updateTodo(todo.id, data)
//       .then((updatedTodo: Todo) => {
//         setTodos((prevTodos) => {
//           const prevTodosCopy = [...prevTodos];

//           const indexOfUpdatedTodo = prevTodosCopy.findIndex(
//             (currentTodo) => currentTodo.id === updatedTodo.id,
//           );

//           prevTodosCopy[indexOfUpdatedTodo] = updatedTodo;

//           return prevTodosCopy;
//         });
//       })
//       .catch(() => {
//         setError('Unable to update a todo');
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

// export const updateTodo = (todoId: number, data: TodoUpdate): Promise<Todo> => {
//   return client.patch(`/todos/${todoId}`, data);
// };

// зробити уніфіковану функцію для редагування туду
// ддати стейт на клік який перевіряє чи було оновлення статусів
// в залежнсті від стейту міняти значення кмплітед у всіх тут аб тільки у невикнаних

// My code      _||_
//              \  /
//               \/
// const updateTodoStatus = useCallback(async (
//   id: number,
//   completed: boolean,
// ) => {
//   try {
//     setIsLoading(true);
//     await changeTodoStatus(id, { completed });
//   } catch {
//     setErrorMessage('Unable to change a todo');
//   } finally {
//     getTodos();
//     setIsLoading(false);
//   }
// }, []);

// const autoComplite = useCallback(async () => {
//   try {
//     setIsLoading(true);
//     if (todos.length > completedTodos.length) {
//       activeTodos.map(({
//         id,
//         completed,
//       }) => updateTodoStatus(id, !completed));
//     }

//     todos.map(({ id, completed }) => updateTodoStatus(id, true));
//   } catch {
//     setErrorMessage('Unable to change a todo');
//   } finally {
//     getTodos();
//     setIsLoading(false);
//   }
// }, []);

// const updateTodoTitle = useCallback(async (
//   id: number,
//   title: string,
// ) => {
//   try {
//     setIsLoading(true);
//     await changeTodoTitle(id, { title });
//   } catch {
//     setErrorMessage('Unable to change a todo');
//   } finally {
//     getTodos();
//     setIsLoading(false);
//   }
// }, []);
