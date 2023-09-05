import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { Header } from './components/Header';
import { SortType } from './types/SortType';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { ErrorType } from './types/ErrorType';

function creatTempTodo(userId: number, title: string): Todo {
  return {
    id: 0,
    userId,
    title,
    completed: false,
  };
}

function sortTodo(todos: Todo[], sortType: SortType) {
  switch (sortType) {
    case SortType.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case SortType.COMPLETED:
      return todos.filter(todo => todo.completed);

    case SortType.ALL:
    default:
      return todos;
  }
}

const USER_ID = 10860;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.ALL);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);
  const [procesingTodos, SetProcesingTodos] = useState<number[]>([]);

  const noneError = (): void => {
    setTimeout(() => {
      setErrorType(ErrorType.NONE);
    }, 3000);
  };

  const newError = (error: ErrorType): void => {
    setErrorType(error);

    noneError();
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
      } catch {
        setErrorType(ErrorType.LOAD);

        noneError();
      }
    };

    loadTodos();
  }, []);

  const handleFilterChange = (
    methodSort: SortType,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ): void => {
    event.preventDefault();

    switch (methodSort) {
      case 'Active':
        setSortType(SortType.ACTIVE);
        break;

      case 'Completed':
        setSortType(SortType.COMPLETED);
        break;

      default:
        setSortType(SortType.ALL);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      newError(ErrorType.TITLE);

      return;
    }

    try {
      noneError();
      setTempTodo(creatTempTodo(USER_ID, todoTitle));

      const todo = await addTodo(USER_ID, todoTitle);

      setTodos(prevTodos => ([...prevTodos, todo]));
      setTodoTitle('');
    } catch {
      newError(ErrorType.ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const hadleDeleteTodo = async (todoId: number): Promise<void> => {
    try {
      noneError();

      SetProcesingTodos([todoId]);

      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      newError(ErrorType.DELETE);
    } finally {
      SetProcesingTodos([]);
    }
  };

  const handleClearCompleted = async () => {
    try {
      const completedTodos = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      noneError();

      SetProcesingTodos(completedTodos);

      await Promise.all(completedTodos.map(todoId => (deleteTodo(todoId))));

      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      newError(ErrorType.DELETE);
    } finally {
      SetProcesingTodos([]);
    }
  };

  const handlePatchTodo = async (todoId: number, patch: object) => {
    try {
      noneError();

      SetProcesingTodos([todoId]);

      await patchTodo(todoId, patch);

      setTodos(todos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          ...patch,
        };
      }));
    } catch {
      newError(ErrorType.UPDATE);
    } finally {
      SetProcesingTodos([]);
    }
  };

  const handleAllCompleted = async (patch: object) => {
    try {
      noneError();

      await todos.map(todo => patchTodo(todo.id, patch));

      setTodos(todos.map(todo => {
        return {
          ...todo,
          ...patch,
        };
      }));
    } catch {
      newError(ErrorType.UPDATE);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = sortTodo(todos, sortType);
  const nrOfTodos = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          nrOfTodos={nrOfTodos}
          lengthTodos={todos.length}
          formSummit={handleFormSubmit}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          patchTodos={handleAllCompleted}
          tempTodo={tempTodo}
        />

        <TodoList
          visibaleTodos={visibleTodos}
          deleteTodo={hadleDeleteTodo}
          tempTodo={tempTodo}
          patchTodo={handlePatchTodo}
          processedTodos={procesingTodos}
        />

        <Footer
          todos={todos}
          sortType={sortType}
          filterChange={handleFilterChange}
          clearCompletedTodos={handleClearCompleted}
        />

      </div>

      <Notification
        errorType={errorType}
        noneError={noneError}
      />
    </div>
  );
};
