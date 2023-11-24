/* eslint-disable max-len */
import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  deleteTodo, getTodos, createTodo, editTodo,
} from './api/todos';
import { FilterBy } from './types/FilterBy';
import { ErrorMessage } from './types/ErrorMessage';
import { filter } from './utils/helpers';
import { FocusFiled } from './types';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 11825;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>('All');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const [editedTitle, setEditedTitle] = useState(editedTodo?.title);
  const [focus, setFocus] = useState<FocusFiled>('input');

  const newTitleTodoRef = useRef<HTMLInputElement | null>(null);
  const editedTitleTodoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch((error) => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const refs = {
      edit: editedTitleTodoRef,
      input: newTitleTodoRef,
    };

    if (focus) {
      const refToFocus = refs[focus];

      if (refToFocus.current) {
        refToFocus.current.focus();
      }
    }
  }, [focus, isLoading]);

  const handleNewTodo = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setIsLoading(true);
      const normalizedTitle = newTodoTitle.trim();
      const newTodo = {
        title: normalizedTitle,
        userId: USER_ID,
        completed: false,
      };
      const temporaryTodo = {
        ...newTodo,
        id: 0,
      };

      if (!normalizedTitle) {
        setErrorMessage('Title should not be empty');
        setTimeout(() => setErrorMessage(''), 3000);
        setIsLoading(false);

        return;
      }

      setTempTodo(temporaryTodo);
      setLoadingTodos([temporaryTodo]);
      setFocus(null);

      const createdTodo = await createTodo(USER_ID, newTodo);

      setNewTodoTitle('');
      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setTempTodo(null);
      setErrorMessage('Unable to add a todo');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
      setLoadingTodos([]);
      setTempTodo(null);
      setFocus('input');
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setIsLoading(true);
      setLoadingTodos(prev => [...prev, ...todos.filter(t => (t.id === todoId))]);

      const isTodoDelete = await deleteTodo(todoId);

      if (isTodoDelete) {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } else {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setFocus('input');
      setIsLoading(false);
      setLoadingTodos([]);
    }
  };

  const handleDeleteCompletedTodos = async () => {
    setIsLoading(true);
    const todosToDelete = todos.filter(todo => todo.completed);

    setLoadingTodos(todosToDelete);

    await Promise.allSettled(todosToDelete.map(todo => (
      handleDeleteTodo(todo.id)
    )));
  };

  const handleUpdateTodoTitle = async (event: FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement, Element>) => {
    try {
      if (event.preventDefault) {
        event.preventDefault();
      }

      const prevTitle = editedTodo?.title;
      const updatedTitle = editedTitle?.trim();

      if (prevTitle === updatedTitle) {
        setEditedTodo(null);

        return;
      }

      if (updatedTitle === '' && editedTodo) {
        handleDeleteTodo(editedTodo.id);

        return;
      }

      if (editedTodo) {
        const tempTodos = todos.map(t => (t.id === editedTodo.id ? { ...editedTodo, title: updatedTitle || '' } : t));

        setTodos(tempTodos);
        setIsLoading(true);
        setLoadingTodos(prev => [...prev, { ...editedTodo, title: updatedTitle || '' }]);

        const updatedTodo = await editTodo(editedTodo.id, {
          title: updatedTitle,
        });

        setTodos(prev => {
          const filtred = prev.map((t) => (
            t.id === updatedTodo.id ? updatedTodo : t));

          return filtred;
        });
      }
    } catch {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setEditedTodo(null);
      setEditedTitle('');
      setIsLoading(false);
      setLoadingTodos([]);
    }
  };

  const handleUpdateTodoStatus = async (todo: Todo) => {
    try {
      setIsLoading(true);
      setLoadingTodos(prev => [...prev, todo]);

      const updatedTodo = await editTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prev => {
        const filtred = prev.map((t) => (
          t.id === updatedTodo.id ? updatedTodo : t));

        return filtred;
      });
    } catch {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
      setLoadingTodos([]);
      setFocus(null);
    }
  };

  const handleUpdateAllTodoStatus = async () => {
    setIsLoading(true);
    const allActive = todos.every(t => t.completed);
    let todosToUpdateStatus: Todo[] = [];

    if (allActive) {
      todosToUpdateStatus = [...todos];
      setLoadingTodos(todosToUpdateStatus);
    } else {
      todosToUpdateStatus = todos.filter(t => !t.completed);
      setLoadingTodos(todosToUpdateStatus);
    }

    await Promise.allSettled(todosToUpdateStatus.map(todo => (
      handleUpdateTodoStatus(todo)
    )));
  };

  const filteredTodos = filter(todos, filterBy);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleUpdateAllTodoStatus={handleUpdateAllTodoStatus}
          handleNewTodo={handleNewTodo}
          newTitleTodoRef={newTitleTodoRef}
          setNewTodoTitle={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
          isLoading={isLoading}
          setEditedTodo={setEditedTodo}
        />

        <TodoList
          todos={todos}
          filteredTodos={filteredTodos}
          setEditedTodo={setEditedTodo}
          setEditedTitle={setEditedTitle}
          setFocus={setFocus}
          handleUpdateTodoStatus={handleUpdateTodoStatus}
          editedTodo={editedTodo}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
          editedTitleTodoRef={editedTitleTodoRef}
          editedTitle={editedTitle}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={isLoading}
          loadingTodos={loadingTodos}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          handleDeleteCompletedTodos={handleDeleteCompletedTodos}
          tempTodo={tempTodo}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
