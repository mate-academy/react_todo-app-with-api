import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';
import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
  USER_ID,
} from '../api/todos';

export const useTodos = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const isAllCompleted =
    todoList.length > 0 && todoList.every(todo => todo.completed);

  // #region effects
  useEffect(() => {
    getTodos()
      .then(setTodoList)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);
  // #endregion

  // #region handlers
  const addTodo = (title: string) => {
    const newTodo = { userId: USER_ID, title, completed: false };

    setErrorMessage('');
    setTempTodo({ id: 0, ...newTodo });

    return createTodo(newTodo)
      .then(result => setTodoList(currentTodos => [...currentTodos, result]))
      .catch(error => {
        setErrorMessage(ErrorMessage.AddTodo);
        throw error;
      })
      .finally(() => setTempTodo(null));
  };

  const toggleTodoStatus = (todo: Todo) => {
    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo =>
        setTodoList(currentTodos =>
          currentTodos.map(todoItem =>
            todoItem.id === todo.id ? updatedTodo : todoItem,
          ),
        ),
      )
      .catch(error => {
        setErrorMessage(ErrorMessage.UpdateTodo);
        throw error;
      })
      .finally(() =>
        setProcessingIds(currentIds => currentIds.filter(id => id !== todo.id)),
      );
  };

  const updateTodoTitle = (todoId: number, data: Partial<Todo>) => {
    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todoId]);

    return updateTodo(todoId, data)
      .then(updatedTodo =>
        setTodoList(currentTodos =>
          currentTodos.map(todoItem =>
            todoItem.id === todoId ? updatedTodo : todoItem,
          ),
        ),
      )
      .catch(error => {
        setErrorMessage(ErrorMessage.UpdateTodo);
        throw error;
      })
      .finally(() =>
        setProcessingIds(currentIds => currentIds.filter(id => id !== todoId)),
      );
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todoId]);

    return removeTodo(todoId)
      .then(() =>
        setTodoList(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setErrorMessage(ErrorMessage.DeleteTodo))
      .finally(() =>
        setProcessingIds(currentIds => currentIds.filter(id => id !== todoId)),
      );
  };

  const toggleAllStatus = () => {
    const newStatus = !isAllCompleted;

    todoList
      .filter(todo => todo.completed !== newStatus)
      .forEach(todo => toggleTodoStatus(todo));
  };

  const clearCompleted = () => {
    todoList
      .filter(todo => todo.completed)
      .forEach(todo => deleteTodo(todo.id));
  };
  // #endregion

  return {
    todoList,
    errorMessage,
    setErrorMessage,
    tempTodo,
    processingIds,
    addTodo,
    deleteTodo,
    toggleAllStatus,
    toggleTodoStatus,
    updateTodoTitle,
    clearCompleted,
    isAllCompleted,
  };
};
