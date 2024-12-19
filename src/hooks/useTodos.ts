import { useLayoutEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import * as todoApi from '../api/todos';
import { TodoErrors } from '../utils/enums/TodoErrors';
import {
  getCompletedTodos,
  getInCompletedTodos,
  hasInCompletedTodos,
} from '../utils/todos/getTodos';
import { revomesTodosById } from '../utils/todos/removeTodos';
import { validTodoIds, validUpdatedTodos } from '../utils/todos/validationTodo';
import { updateTodosCompleted } from '../utils/todos/updateTodo';

export const useTodos = (showError: (err: TodoErrors) => void) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const fetchTodos = async () => {
    try {
      const data = await todoApi.getTodos();
      setTodos(data);
    } catch {
      showError(TodoErrors.load);
    }
  };

  const addTodo = async (title: string): Promise<Todo | void> => {
    try {
      const todo = { title, userId: todoApi.USER_ID, completed: false };

      setTempTodo({ ...todo, id: 0 });

      const newTodo = await todoApi.addTodo(todo);

      setTodos(prevState => [...prevState, newTodo]);
      setTempTodo(null);
    } catch (err) {
      showError(TodoErrors.add);
      setTempTodo(null);
      throw err;
    }
  };

  const deleteTodo = async (todoId: number): Promise<number | void> => {
    try {
      await todoApi.deleteTodo(todoId);

      setTodos(current => current.filter(({ id }) => id !== todoId));

      return todoId;
    } catch {
      showError(TodoErrors.delete);
    }
  };

  const deleteCompletedTodos = async () => {
    const completedTodos = getCompletedTodos(todos);

    const res = await Promise.all(
      completedTodos.map(({ id }) => deleteTodo(id)),
    );

    const todoIds = validTodoIds(res);

    if (!!validTodoIds.length) {
      setTodos(revomesTodosById(todos, todoIds));
    }
  };

  const updateTodo = async (todo: Todo): Promise<Todo | void> => {
    try {
      const updatedTodo: Todo = await todoApi.updateTodo(todo, todo.id);

      setTodos(prevState =>
        prevState.map(existingTodo =>
          existingTodo.id === todo.id ? todo : existingTodo,
        ),
      );

      return updatedTodo;
    } catch {
      showError(TodoErrors.update);
    }
  };

  const updatedAllTodo = async (): Promise<void> => {
    const isIncompletedTodo = hasInCompletedTodos(todos);

    const newTodos = isIncompletedTodo
      ? updateTodosCompleted(getInCompletedTodos(todos))
      : updateTodosCompleted(todos);

    const res = await Promise.all(newTodos.map(todo => updateTodo(todo)));

    const updatedTodos = validUpdatedTodos(res);

    if (!!updatedTodos.length) {
      setTodos(prevState => {
        const updatedState = prevState.map(todo => {
          const updatedTodo = updatedTodos.find(
            updated => updated.id === todo.id,
          );

          return updatedTodo ? updatedTodo : todo;
        });

        return updatedState;
      });
    }
  };

  useLayoutEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    tempTodo,
    fetchTodos,
    addTodo,
    deleteTodo,
    deleteCompletedTodos,
    updateTodo,
    updatedAllTodo,
  };
};
