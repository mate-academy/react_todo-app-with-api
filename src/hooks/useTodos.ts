import * as TodosService from '../api/todos';
import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../types/ErrorMessages';

export const useTodos = () => {
  //#region States and Constants
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoLoadingIds, setLoadingTodoIds] = useState<number[]>([]);

  const completedTodos = todos.filter(todo => todo.completed);
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const isAllCompleted = todos.every(todo => todo.completed);
  //#endregion

  useEffect(() => {
    setErrorMessage(ErrorMessages.DEFAULT_ERROR);
    TodosService.getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.LOAD_ERROR))
      .finally();
  }, []);

  const addTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessages.TITLE_ERROR);

      return Promise.resolve(false);
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: TodosService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    const temporaryTodo: Todo = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(temporaryTodo);
    setLoadingTodoIds(prev => [...prev, 0]);

    try {
      const todoFromServer = await TodosService.addTodo(newTodo);

      setTodos(prev => [...prev, todoFromServer]);

      return true;
    } catch {
      setErrorMessage(ErrorMessages.ADD_ERROR);

      return false;
    } finally {
      setTempTodo(null);
      setLoadingTodoIds([]);
    }
  };

  const updateTodoStatus = async (
    todoId: number,
    completed: boolean,
  ): Promise<boolean> => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      const updatedTodo = await TodosService.updateTodo(todoId, { completed });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId
            ? { ...todo, completed: updatedTodo.completed }
            : todo,
        ),
      );

      return true;
    } catch {
      setErrorMessage(ErrorMessages.UPDATE_ERROR);

      return false;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const updateTodoTitle = async (
    todoId: number,
    newTitle: string,
  ): Promise<boolean> => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      const updatedTodo = await TodosService.updateTodo(todoId, {
        title: newTitle,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, title: updatedTodo.title } : todo,
        ),
      );

      return true;
    } catch {
      setErrorMessage(ErrorMessages.UPDATE_ERROR);

      return false;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const deleteTodo = async (todoId: number): Promise<boolean> => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      await TodosService.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      setErrorMessage(ErrorMessages.DELETE_ERROR);

      return false;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const idsToDelete = completedTodos.map(todo => todo.id);

    await Promise.allSettled(idsToDelete.map(id => deleteTodo(id)));
  };

  const handleToggleAllCompleted = async () => {
    const todosToUpdate = isAllCompleted ? completedTodos : uncompletedTodos;
    const newStatus = !isAllCompleted;

    await Promise.all(
      todosToUpdate.map(todo => updateTodoStatus(todo.id, newStatus)),
    );
  };

  return {
    todos,
    tempTodo,
    errorMessage,
    todoLoadingIds,
    setErrorMessage,
    addTodo,
    updateTodoStatus,
    updateTodoTitle,
    deleteTodo,
    handleClearCompleted,
    handleToggleAllCompleted,
  };
};
