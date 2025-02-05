import { SetStateAction } from 'react';

import { USER_ID } from '../api/todos';

import { useAppContext } from '../context/AppContext';

import * as todoService from '../services/todo';

import { LoadingTodo } from '../types/LoadingTodo';
import { Todo } from '../types/Todo';

function showSpinner(setState: React.Dispatch<SetStateAction<LoadingTodo[]>>) {
  setTimeout(() => setState([]), 900);
}

export function useRemoveTodo() {
  const { setTodos, setLoadingTodos, setError, inputRef } = useAppContext();

  async function removeTodo(todoId: number) {
    try {
      setLoadingTodos(prev => [...prev, { id: todoId, action: 'removing' }]);
      showSpinner(setLoadingTodos);
      await todoService.deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(item => item.id !== todoId));
    } catch (error) {
      setError('Unable to delete a todo');
    } finally {
      return inputRef.current && inputRef.current.focus();
    }
  }

  return removeTodo;
}

export function useAddTodo() {
  const {
    query,
    setQuery,
    setIsFormDisabled,
    setError,
    setLoadingTodos,
    setTodos,
  } = useAppContext();

  const tempTodo: Todo = {
    id: 0,
    userId: USER_ID,
    title: '',
    completed: false,
  };

  const newTodo: Omit<Todo, 'id'> = {
    userId: USER_ID,
    title: query.trim(),
    completed: false,
  };

  async function addTempTodo() {
    tempTodo.title = query;

    await setTodos(prev => [...prev, tempTodo]);
    await setLoadingTodos([{ id: tempTodo.id, action: 'adding' }]);
    await showSpinner(setLoadingTodos);
  }

  async function addTodo() {
    if (!query.trim()) {
      setError('Title should not be empty');

      return;
    }

    try {
      setIsFormDisabled(true);
      addTempTodo();

      const createdTodo = await todoService.createTodo(newTodo);

      await setLoadingTodos([]); // reset loading state after tempTodo

      setTodos(prev => [
        ...prev.filter(todo => todo !== tempTodo),
        createdTodo,
      ]);

      setLoadingTodos([{ id: createdTodo.id, action: 'adding' }]);
      setQuery('');
    } catch (error) {
      setError('Unable to add a todo');
      setTodos(prev => [...prev.filter(todo => todo !== tempTodo)]);
    } finally {
      setIsFormDisabled(false);
    }
  }

  return addTodo;
}

export function useRenameTodo(
  todoQuery: string,
  setTodoQuery: React.Dispatch<SetStateAction<string>>,
  setIsTodoEdited: React.Dispatch<SetStateAction<boolean>>,
) {
  const { setTodos, setError, setIsNewTodoFieldEdited, setLoadingTodos } =
    useAppContext();

  const isInputEmpty = !todoQuery.trim();

  async function renameTodo(todo: Todo, e?: React.KeyboardEvent) {
    if (e && e.key === 'Escape') {
      setIsTodoEdited(false);

      return;
    }

    if (e && e.key !== 'Enter') {
      return;
    }

    if (isInputEmpty) {
      try {
        setLoadingTodos(prev => [...prev, { id: todo.id, action: 'removing' }]);
        await todoService.deleteTodo(todo.id);
        showSpinner(setLoadingTodos);
        await setTodos(prevTodos =>
          prevTodos.filter(prevTodo => prevTodo !== todo),
        );
      } catch (error) {
        setError('Unable to delete a todo');
        setLoadingTodos([]);
      }

      return;
    }

    if (todoQuery === todo.title) {
      setIsTodoEdited(false);

      return;
    }

    const updatedTodo = { ...todo, title: todoQuery.trim() };

    try {
      setLoadingTodos(prev => [...prev, { id: todo.id, action: 'updating' }]);
      showSpinner(setLoadingTodos);
      await todoService.renameTodo(updatedTodo);
      setTodos(prev =>
        prev.map(item => (item.id === todo.id ? updatedTodo : item)),
      );
      setTodoQuery(updatedTodo.title);
      setIsNewTodoFieldEdited(false);
      setIsTodoEdited(false);
    } catch (error) {
      setLoadingTodos([]);
      setError('Unable to update a todo');
    }
  }

  return renameTodo;
}

export function useToggleTodoCompletion() {
  const { todos, setTodos, setLoadingTodos, setError } = useAppContext();

  async function ToggleTodoCompletion(id: number) {
    let updatedTodo: Todo | null = null;

    const updateTodos = (items: Todo[]) =>
      items.map(item => {
        if (item.id === id) {
          updatedTodo = { ...item, completed: !item.completed };

          return updatedTodo;
        }

        return item;
      });

    setLoadingTodos(prev => [...prev, { id, action: 'updating' }]);

    try {
      const updatedTodos = updateTodos(todos);

      if (!updatedTodo) {
        throw new Error('todo for update not found');
      }

      await showSpinner(setLoadingTodos);
      await todoService.changeCompletedStatus(updatedTodo);
      setTodos(updatedTodos);
    } catch (error) {
      setError('Unable to update a todo');
      setLoadingTodos([]);
    }
  }

  return ToggleTodoCompletion;
}

export function useToggleAllTodosCompletion() {
  const { todos, setTodos, setLoadingTodos, setError } = useAppContext();

  const hasUncompletedTodo = todos.some(todo => !todo.completed);
  const isAllCompleted = todos.every(todo => todo.completed);
  const shouldToggleAllToCompleted = hasUncompletedTodo || !isAllCompleted;

  async function toggleAllTodosCompletion() {
    try {
      if (shouldToggleAllToCompleted) {
        setTodos(prevTodos =>
          prevTodos.map(todo => {
            const updatedTodo = { ...todo, completed: true };

            if (!todo.completed) {
              setLoadingTodos(prev => [
                ...prev,
                { id: updatedTodo.id, action: 'updating' },
              ]);
              todoService.changeCompletedStatus(updatedTodo);
            }

            return updatedTodo;
          }),
        );
      } else {
        setTodos(prevTodos =>
          prevTodos.map(todo => {
            const updatedTodo = { ...todo, completed: false };

            setLoadingTodos(prev => [
              ...prev,
              { id: updatedTodo.id, action: 'updating' },
            ]);
            todoService.changeCompletedStatus(updatedTodo);

            return updatedTodo;
          }),
        );
      }

      showSpinner(setLoadingTodos);
    } catch (error) {
      setError('Unable to update todos');
      setLoadingTodos([]);
    }
  }

  return toggleAllTodosCompletion;
}

export function useRemoveCompletedTodos() {
  const { todos, setLoadingTodos, setError, inputRef, setTodos } =
    useAppContext();

  async function removeCompletedTodos(
    setRemovalError: React.Dispatch<SetStateAction<boolean>>,
  ) {
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      await Promise.all(
        completedTodos.map(async todo => {
          setLoadingTodos(prev => [
            ...prev,
            { id: todo.id, action: 'removing' },
          ]);
          try {
            await todoService.deleteTodo(todo.id);
            await setTodos(prev => prev.filter(item => item.id !== todo.id));
          } catch (error) {
            setRemovalError(true);
            setError('Unable to delete a todo');
          } finally {
            setLoadingTodos(prev => prev.filter(item => item?.id !== todo.id));

            return inputRef.current && inputRef.current.focus();
          }
        }),
      );
    } catch (error) {
      setError('Unable to delete a todo');
      setLoadingTodos([]);
    }
  }

  return removeCompletedTodos;
}
