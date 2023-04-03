import { deleteTodo, patchTodo } from '../api/todos';

export const deleteTodoPromise = (userId: number, idTodo: number) => (
  new Promise((response, reject) => {
    deleteTodo(userId, idTodo)
      .then(() => {
        response(idTodo);
      })
      .catch(() => {
        reject();
      });
  })
);

export const completedTodoPromise = (idCompl: number, completed: boolean) => (
  new Promise((response, reject) => {
    patchTodo(idCompl, { completed: !completed })
      .then(() => {
        response(!completed);
      })
      .catch(() => {
        reject();
      });
  })
);
