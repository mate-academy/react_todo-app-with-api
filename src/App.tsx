/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { prepareTodos } from './utils/prepareTodos';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  callAddTodo,
  callDeleteTodo,
  callEditTodo,
  callGetTodos,
} from './api/todos';
import { Notifications } from './components/Notifications';
import { ErrorType } from './types/ErrorType';
import { FilterBy } from './types/FilterBy';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { RequestTodo } from './types/RequestTodo';

const USER_ID = 6332;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.LOAD);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoWithLoader, setTodoWithLoader] = useState(0);
  const [isToggle, setIsToggle] = useState(false);
  const [isClearCompleted, setClearCompleted] = useState(false);
  const [editingId, setEditingId] = useState(0);
  const isAllTodosActive = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);
  const [isEdit, setIsEdit] = useState(false);

  const getTodos = async () => {
    try {
      const todosFromServer = await callGetTodos(USER_ID);

      setTodos(todosFromServer);
      setHasError(false);
    } catch (error) {
      setHasError(true);
      if (error instanceof Error) {
        setErrorType(ErrorType.LOAD);
      }
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = useCallback(async (titleOfTodo: string) => {
    const preparedTitle = titleOfTodo.trim();

    if (!preparedTitle) {
      setErrorType(ErrorType.TITLE);
      setHasError(true);
      setTitle('');

      return;
    }

    const newTodo: RequestTodo = {
      userId: USER_ID,
      title: preparedTitle,
      completed: false,
    };

    try {
      setTempTodo({ ...newTodo, id: 0 });
      await callAddTodo(newTodo);
      await getTodos();
      setTempTodo(null);
      setTitle('');
      setHasError(false);
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.ADD);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    setTodoWithLoader(id);

    try {
      await callDeleteTodo(id);
      await getTodos();
    } catch (error) {
      setErrorType(ErrorType.DELETE);
      setHasError(true);
    } finally {
      setTodoWithLoader(0);
    }
  }, []);

  const deleteCompleted = async (id: number) => {
    setClearCompleted(true);

    try {
      await deleteTodo(id);
      setTodos((currentTodos) => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorType(ErrorType.DELETE);
    } finally {
      setClearCompleted(false);
    }
  };

  const editTodoStatus = useCallback(async (editedTodo: Todo) => {
    setTodoWithLoader(editedTodo.id);

    const undatedTodo = {
      ...editedTodo,
      completed: !editedTodo.completed,
    };

    try {
      await callEditTodo(undatedTodo);
      await getTodos();
    } catch {
      setErrorType(ErrorType.UPDATE);
      setHasError(true);
    } finally {
      setTodoWithLoader(0);
    }
  }, []);

  const editTodoTitle = useCallback(async (editedTodo: Todo,
    newTitle: string) => {
    setIsEdit(true);
    if (newTitle === editedTodo.title) {
      setEditingId(0);

      return;
    }

    setTodoWithLoader(editedTodo.id);
    const undatedTodo = { ...editedTodo, title: newTitle };

    try {
      await callEditTodo(undatedTodo);
      await getTodos();
    } catch {
      setErrorType(ErrorType.UPDATE);
      setHasError(true);
    } finally {
      setTodoWithLoader(0);
      setEditingId(0);
      setIsEdit(false);
    }
  }, []);

  const handleTitleTodo = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, [title]);

  const handleToggleStatus = async () => {
    try {
      setIsToggle(true);
      const updatedCompleted = !todos.every(todo => todo.completed);

      await Promise.all(
        todos
          .filter(todo => todo.completed !== updatedCompleted)
          .map(async (todo) => {
            const todoUpdated = { ...todo, completed: updatedCompleted };

            return callEditTodo(todoUpdated);
          }),
      );

      await getTodos();
    } catch {
      setErrorType(ErrorType.UPDATE);
    } finally {
      setIsToggle(false);
    }
  };

  const handleEditingId = (id: number) => {
    setEditingId(id);
  };

  const visibleTodos = useMemo(() => {
    return prepareTodos(filterBy, todos);
  }, [filterBy, todos]);

  const clearNotification = useCallback(() => {
    setHasError(false);
  }, []);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        setIsEdit(false);
        setEditingId(0);
      }
    }

    document.addEventListener('keydown', handleEscapeKey);

    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isEdit]);

  const isTodosNotEmpty = !!todos.length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllTodosActive={isAllTodosActive}
          isTodosNotEmpty={isTodosNotEmpty}
          title={title}
          handleTitleTodo={handleTitleTodo}
          addTodo={addTodo}
          tempTodo={tempTodo}
          handleToggleStatus={handleToggleStatus}
        />

        {visibleTodos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            isClearCompleted={isClearCompleted}
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
            deletingTodoId={todoWithLoader}
            editTodoStatus={editTodoStatus}
            isToggle={isToggle}
            editTodoTitle={editTodoTitle}
            editingId={editingId}
            handleEditingId={handleEditingId}
          />
        )}

        {isTodosNotEmpty && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            onFilterBy={setFilterBy}
            onClearCompleted={deleteCompleted}
          />
        )}
      </div>

      <Notifications
        errorType={errorType}
        hasError={hasError}
        clearNotification={clearNotification}
      />
    </div>
  );
};
