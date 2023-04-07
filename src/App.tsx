import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { Header } from './components/Header';
import { UserWarning } from './UserWarning';
import {
  addTodo, completeTodo, deleteTodo, getTodos, renameTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotice } from './types/ErrorNotice';
import { Filter } from './types/Filter';
import { getVisibleTodos } from './helper/getVisibleTodos';

const USER_ID = 6762;

export const App: React.FC = () => {
  const [todosFromServer, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setMessageError] = useState('');
  const [filter, setFilter] = useState(Filter.ALL);
  const [title, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inProcessing, setProcessingIDs] = useState<number[]>([0]);
  const hasError = !!errorMessage;
  const isDisableInput = tempTodo !== null;

  const showError = (message: string) => {
    setMessageError(message);
    setTimeout(() => setMessageError(''), 3000);
  };

  const loadingTodos = async () => {
    try {
      const todos = await getTodos(USER_ID);

      setTodos(todos);
    } catch (error) {
      showError(ErrorNotice.LOADING);
    }
  };

  useEffect(() => {
    loadingTodos();
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        showError(ErrorNotice.TITLE);

        return;
      }

      const createTodo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(createTodo);

      try {
        await addTodo(createTodo);
        setTodos(state => [...state, createTodo]);

        setNewTitle('');
        setTempTodo(null);
        loadingTodos();
      } catch (error) {
        showError(ErrorNotice.ADD);
        setTempTodo(null);
      }
    }, [title],
  );

  const handleDelete = useCallback(async (todoId: number) => {
    try {
      setProcessingIDs([todoId]);
      await deleteTodo(todoId);
      loadingTodos();
    } catch (error) {
      showError(ErrorNotice.DELETE);
    } finally {
      setProcessingIDs([0]);
    }
  }, []);

  const handleDeleteCompleted = useCallback(
    async (todos: Todo[]) => {
      try {
        setProcessingIDs(todos.map(todo => todo.id));
        const removeAllComleted = todos.map(todo => (
          deleteTodo(todo.id)
        ));

        await Promise.all(removeAllComleted);

        loadingTodos();
      } catch (error) {
        showError(ErrorNotice.DELETE);
      } finally {
        setProcessingIDs([0]);
      }
    }, [inProcessing],
  );

  const handleComplete = useCallback(
    async (todoId: number[], data: boolean) => {
      setProcessingIDs(todoId);

      try {
        const completingTodos = todoId.map(id => (
          completeTodo(id, data)
        ));

        await Promise.all(completingTodos);

        loadingTodos();
      } catch (error) {
        showError(ErrorNotice.UPDATE);
      } finally {
        setProcessingIDs([0]);
      }
    }, [],
  );

  const changeTitle = useCallback(async (id: number, newTitle: string) => {
    setProcessingIDs([id]);

    try {
      await renameTodo(id, newTitle);
      loadingTodos();
    } catch (error) {
      setMessageError(ErrorNotice.UPDATE);
    } finally {
      setProcessingIDs([0]);
    }
  }, []);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(todosFromServer, filter)
  ), [todosFromServer, filter]);

  const completedTodos = useMemo(
    () => todosFromServer.filter(todo => (todo.completed)),
    [todosFromServer, tempTodo],
  );

  const activeTodos = useMemo(
    () => todosFromServer.filter(todo => !todo.completed),
    [todosFromServer],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isDisableInput={isDisableInput}
          title={title}
          handleSubmit={handleSubmit}
          createNewTitle={setNewTitle}
          completedTodos={completedTodos}
          activeTodos={activeTodos}
          updateTodos={handleComplete}
        />

        <TodoList
          todos={visibleTodos}
          creating={tempTodo}
          onDelete={handleDelete}
          inProcessing={inProcessing}
          updateTodo={handleComplete}
          onChangeTitle={changeTitle}
        />

        {todosFromServer.length > 0 && (
          <Footer
            filter={filter}
            onFilterChange={setFilter}
            completedTodos={completedTodos}
            activeTodosCount={activeTodos.length}
            deleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>
      <Notification
        error={hasError}
        errorNotice={errorMessage}
        closeErrorNotice={setMessageError}
      />
    </div>
  );
};
