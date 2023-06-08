import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Todo } from './types/Todo';
import { SortType } from './types/SortType';
import {
  deleteTodos, getTodos, patchTodos, postTodos,
} from './api/todos';
import { Notification } from './components/Notification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 10354;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [sortType, setSortType] = useState(SortType.All);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [isConnection, setIsConnection] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessageName, setErrorMessageName] = useState<string | null>(null);
  const [todosLoading, setTodosLoading] = useState<number[]>([]);

  const isActiveTodos = todos.filter((todo) => !todo.completed);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCreateTodo = () => {
    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTodosLoading((prevState) => [...prevState, 0]);

    setTempTodo(newTodo);

    postTodos(USER_ID, newTodo)
      .then((response) => {
        setTodos((prevTodos) => [...prevTodos, response]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setIsConnection(false);
        setIsErrorMessage(true);
        setErrorMessageName(ErrorMessages.AddTodo);
        setTempTodo(null);
      })
      .finally(() => {
        setTodosLoading((prevState) => prevState.filter((id) => id));
      });
  };

  const handleUpdateTodo = useCallback((
    todoId: number,
    data: Partial<Todo>,
  ) => {
    setTodosLoading((prevState) => [...prevState, todoId]);

    patchTodos(todoId, data)
      .then((response) => {
        setTodos(prevTodos => prevTodos.map(todo => {
          return todo.id === todoId ? { ...todo, ...response } : todo;
        }));
      })
      .catch(() => {
        setIsErrorMessage(true);
        setErrorMessageName(ErrorMessages.UpdateTodo);
      })
      .finally(() => {
        setTodosLoading((prevState) => prevState.filter((id) => id !== todoId));
      });
  }, []);

  const handleToggleCompleted = () => {
    const allCompleted = todos.every(({ completed }) => completed);

    todos.forEach(({ id, completed }) => {
      if (allCompleted) {
        handleUpdateTodo(id, { completed: !completed });
      } else if (!completed) {
        handleUpdateTodo(id, { completed: !completed });
      }
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setIsErrorMessage(true);
      setErrorMessageName(ErrorMessages.TitleIsEmpty);
    } else if (title.trim()) {
      handleCreateTodo();
      setTitle('');
    }
  };

  const closeErrorMessage = () => {
    setIsErrorMessage(false);
  };

  const sortBy = {
    sortByAll: () => {
      setSortType(SortType.All);
    },

    sortByActive: () => {
      setSortType(SortType.Active);
    },

    sortByCompleted: () => {
      setSortType(SortType.Completed);
    },
  };

  const handleRemoveTodo = (todoId: number) => {
    setTodosLoading((prevState) => [...prevState, todoId]);

    return deleteTodos(todoId)
      .then(() => getTodos(USER_ID))
      .then((prevTodos: Todo[]) => {
        setTodos(prevTodos);
      })
      .catch(() => {
        setIsErrorMessage(true);
        setErrorMessageName(ErrorMessages.DeleteTodo);
      })
      .finally(() => {
        setTodosLoading((prevState) => prevState.filter((id) => id !== todoId));
      });
  };

  const visibleTodos = useMemo(() => {
    return todos.filter((todo: Todo) => {
      switch (sortType) {
        case SortType.Active:
          return !todo.completed;
        case SortType.Completed:
          return todo.completed;
        default:
          return todos;
      }
    });
  }, [todos, sortType]);

  const handleRemoveCompleted = useCallback(() => {
    const completedTodoIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    Promise.all(completedTodoIds.map((todoId) => handleRemoveTodo(todoId)))
      .then(() => getTodos(USER_ID))
      .then((prevTodos: Todo[]) => {
        setTodos(prevTodos);
        setIsConnection(true);
      })
      .catch(() => {
        setIsErrorMessage(true);
        setErrorMessageName(ErrorMessages.DeleteTodo);
      });
  }, [todos]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos(USER_ID)
      .then(setTodos)
      .then(() => setIsConnection(true))
      .catch(() => {
        setIsErrorMessage(true);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          handleChange={handleChangeTitle}
          handleSubmit={handleSubmit}
          todosLoading={todosLoading}
          toggleCompleted={handleToggleCompleted}
          isActiveTodos={isActiveTodos}
        />

        <TodoList
          visibleTodos={visibleTodos}
          remove={handleRemoveTodo}
          tempTodo={tempTodo}
          isConnection={isConnection}
          todosLoading={todosLoading}
          todosUpdate={handleUpdateTodo}
          removeTodo={handleRemoveTodo}
        />

        <Footer
          sortType={sortType}
          sortBy={sortBy}
          todos={todos}
          removeCompleted={handleRemoveCompleted}
          isActiveTodos={isActiveTodos}
        />
      </div>

      <Notification
        isErrorMessage={isErrorMessage}
        closeErrorMessage={closeErrorMessage}
        errorMessage={errorMessageName}
      />
    </div>
  );
};
