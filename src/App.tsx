/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { Todo, TodoStatus, TodoTitle } from './types/Todo';
import { TodoList } from './component/TodoList';
import { Footer } from './component/Footer';
import { Error } from './component/Error';
import { FilterBy } from './types/typedefs';
import { getTodosByFilter } from './helpers';
import { Header } from './component/Header';

const USER_ID = 10363;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodos, setFilterTodos] = useState(FilterBy.ALL);
  const [titleError, setTitleError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isloadingId, setIsloadingId] = useState(0);

  const handleFilterTodos = useCallback((userFilter: FilterBy) => {
    setFilterTodos(userFilter);
  }, []);

  const handleCloseError = useCallback(() => {
    setTitleError('');
  }, []);

  const handleError = useCallback((titleToError: string) => {
    setTitleError(titleToError);

    setTimeout(() => setTitleError(''), 3000);
  }, []);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      handleError('Unable to connect to server');
    }
  };

  const handleAddTodo = useCallback(async (todoTitle: string) => {
    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      await postTodo(USER_ID, newTodo);
      await getTodosFromServer();
    } catch {
      handleError('Unable to add new todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const patchTodoOnServer = async (
    todoId: number,
    data: TodoTitle | TodoStatus,
  ) => {
    setIsloadingId(todoId);

    try {
      await patchTodo(todoId, data);
    } catch {
      handleError('Unable to update a todo');
    } finally {
      setIsloadingId(0);
    }
  };

  const handlePatchTodo = useCallback(async (
    todoId: number, data: TodoTitle | TodoStatus,
  ) => {
    await patchTodoOnServer(todoId, data);

    await getTodosFromServer();
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setIsloadingId(todoId);

    try {
      await deleteTodo(todoId);
    } catch {
      handleError('Unable to delete todo');
    } finally {
      setIsloadingId(0);
      await getTodosFromServer();
    }
  }, []);

  const handleDeleteCompletedTodo = useCallback(async () => {
    try {
      await Promise.all(
        todos
          .filter(({ completed }) => completed)
          .map(({ id }) => deleteTodo(id)),
      );
    } catch {
      handleError('Unable to delete todos');
    }

    await getTodosFromServer();
  }, [todos]);

  const handleChangeCompletedTodos = useCallback(async () => {
    const newStatus = {
      completed: true,
    };

    const noCompletedTodos = todos.filter(({ completed }) => !completed);

    if (noCompletedTodos.length > 0) {
      try {
        await Promise.all(
          noCompletedTodos.map(({ id }) => patchTodoOnServer(id, newStatus)),
        );
      } catch {
        handleError('Unable to update a todo');
      }

      getTodosFromServer();

      return;
    }

    await Promise.all(
      todos.map(({ id }) => patchTodoOnServer(id, { completed: false })),
    );

    getTodosFromServer();
  }, [todos]);

  const prepareTodos = useMemo(() => {
    let visibleTodos = [...todos];

    if (filterTodos) {
      visibleTodos = getTodosByFilter(visibleTodos, filterTodos);
    }

    return visibleTodos;
  }, [filterTodos, todos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onSubmit={handleAddTodo}
          onError={handleError}
          onCompleted={handleChangeCompletedTodos}
        />

        <TodoList
          todos={prepareTodos}
          tempTodo={tempTodo}
          isloadingId={isloadingId}
          onDelete={handleDeleteTodo}
          onEdit={handlePatchTodo}
        />

        {!!todos.length && (
          <Footer
            filterTodos={filterTodos}
            todos={todos}
            onSelect={handleFilterTodos}
            onDeleteCompleted={handleDeleteCompletedTodo}
          />
        )}
      </div>

      <Error
        error={titleError}
        onClose={handleCloseError}
      />
    </div>
  );
};
