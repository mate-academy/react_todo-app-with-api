import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

export const addNewTodo = (
  title: string,
  setErrorMessage: (errorMessage: string) => void,
  setTempTodo: (todo: Todo | null) => void,
  setIsLoadingTodo: (isLoading: boolean) => void,
  USER_ID: number,
  setTodos: (todos: React.SetStateAction<Todo[]>) => void,
) => {
  if (!title) {
    setErrorMessage("Title can't be empty");

    return;
  }

  const newTempTodo = {
    id: 0,
    userId: USER_ID,
    completed: false,
    title,
  };

  setTempTodo(newTempTodo);
  setIsLoadingTodo(true);

  addTodo(USER_ID, newTempTodo)
    .then((todos: Todo[]) => {
      setTodos((prevTodos: Todo[]) => {
        return prevTodos.concat(todos);
      });
      setTempTodo(null);
      setIsLoadingTodo(false);
    })
    .catch(() => {
      setErrorMessage('Unable to add a todo!');
      setTempTodo(null);
      setIsLoadingTodo(false);
    });
};

export const removeTodo = (
  id: number,
  setIsLoadingTodo: (isLoading: boolean) => void,
  setTodos: (todos: Todo[]) => void,
  todos: Todo[],
  setErrorMessage: (errorMessage: string) => void,
) => {
  setIsLoadingTodo(true);
  deleteTodo(id)
    .then(() => {
      const newTodosList = todos.filter(todo => todo.id !== id);

      setTodos(newTodosList);
      setIsLoadingTodo(false);
    })
    .catch(() => {
      setErrorMessage('Unable to delete a todo');
      setIsLoadingTodo(false);
    });
};

export const handleUpdateTodo = (
  todo: Todo,
  setTodos: (todos: React.SetStateAction<Todo[]>) => void,
  todos: Todo[],
  setErrorMessage: (errorMessage: string) => void,
) => {
  updateTodo(todo.id, { completed: !todo.completed })
    .then((updatedTodo: Todo) => {
      setTodos((currentTodos: Todo[]) => {
        const todoIndex = todos
          .findIndex(currTodo => currTodo.id === updatedTodo.id);

        if (todoIndex > -1) {
          return [
            ...todos.slice(0, todoIndex),
            updatedTodo,
            ...todos.slice(todoIndex + 1),
          ];
        }

        return currentTodos;
      });
    })
    .catch(() => {
      setErrorMessage('Unable to update a todo');
    });
};

export const handleUpdateAllTodos = (
  completed: boolean,
  setTodos: (todos: Todo[]) => void,
  todos: Todo[],
  setErrorMessage: (errorMessage: string) => void,
) => {
  const updatedTodos = todos.map((todo) => ({
    ...todo,
    completed: !completed,
  }));

  Promise.all(updatedTodos.map((todo) => updateTodo(todo.id,
    {
      completed: !completed,
    })))
    .then((updatedCurrTodos: Todo[]) => {
      setTodos(updatedCurrTodos);
    })
    .catch(() => {
      setErrorMessage('Unable to update todos');
    });
};
