import { useState, useEffect, useCallback } from 'react';
import { addTodo, deleteTodo, getTodos, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../types/ErrorMessages';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NO_ERROR,
  );
  const [isReceivingAnswer, setIsReceivingAnswer] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleErrorReset = useCallback(() => {
    setErrorMessage(ErrorMessages.NO_ERROR);
  }, [setErrorMessage]);

  const handleErrorMessage = (error: ErrorMessages) => {
    setErrorMessage(error);
  };

  const getTodosOnLoad = () => {
    getTodos()
      .then(setTodos)
      .catch(() => handleErrorMessage(ErrorMessages.UNABLE_TO_LOAD_TODO));
  };

  const handleAddTodo = (newTodo: Todo) => {
    setTempTodo(newTodo);
    setIsReceivingAnswer(true);

    addTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTitle('');
      })
      .catch(() => handleErrorMessage(ErrorMessages.UNABLE_TO_ADD_TODO))
      .finally(() => {
        setTempTodo(null);
        setIsReceivingAnswer(false);
      });
  };

  const handleTodoDelete = (todoId: number) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);
    setIsReceivingAnswer(true);
    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => handleErrorMessage(ErrorMessages.UNABLE_TO_DELETE_TODO))
      .finally(() => {
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
        setIsReceivingAnswer(false);
      });
  };

  const handleTodoUpdate = (id: number, updatedTodo: Partial<Todo>) => {
    setIsReceivingAnswer(true);
    setLoadingTodoIds(currentIds => [...currentIds, id]);

    updateTodo(id, updatedTodo)
      .then(todo => {
        setTodos(currentTodos =>
          currentTodos.map(todoToUpdate =>
            todoToUpdate.id === id
              ? { ...todoToUpdate, ...todo }
              : todoToUpdate,
          ),
        );
        setEditedTodoId(null);
      })
      .catch(() => handleErrorMessage(ErrorMessages.UNABLE_TO_UPDATE_TODO))
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== id),
        );
        setIsReceivingAnswer(false);
      });
  };

  const handleCompletedDelete = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    setIsReceivingAnswer(true);

    Promise.all(
      completedTodos.map(completedTodo => handleTodoDelete(completedTodo.id)),
    ).finally(() => setIsReceivingAnswer(false));
  };

  const handleToggleAll = () => {
    const newStatus = !todos.every(todo => todo.completed);

    const todosToUpdate = !newStatus
      ? todos
      : todos.filter(todo => !todo.completed);

    setIsReceivingAnswer(true);
    Promise.all(
      todosToUpdate.map(todo =>
        handleTodoUpdate(todo.id, { completed: newStatus }),
      ),
    ).finally(() => setIsReceivingAnswer(false));
  };

  useEffect(() => {
    getTodosOnLoad();
  }, []);

  return {
    todos,
    tempTodo,
    errorMessage,
    isReceivingAnswer,
    loadingTodoIds,
    newTitle,
    editedTodoId,
    setEditedTodoId,
    setNewTitle,
    handleAddTodo,
    handleTodoDelete,
    handleTodoUpdate,
    handleCompletedDelete,
    handleToggleAll,
    handleErrorMessage,
    handleErrorReset,
  };
};
