import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodosList } from './components/TodosList';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { FilterBy } from './utils/Enums/FilterBy';
import { Header } from './components/Header';
import { ErrorType } from './utils/Enums/ErrorType';

import { Todo } from './types/Todo';
import { FilterByType } from './types/FilterBy';

import {
  getTodos, post, remove, patchToggleTodo, patchTitle,
} from './api/todos';

const USER_ID = 10217;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [isQueryDisabled, setIsQueryDisabled] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterByType>(FilterBy.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.INITIAL);
  const [processedIds, setProcessedIds] = useState<number[]>([]);
  const [inputTitle, setInputTitle] = useState('');
  const [currTodoId, setCurrTodoId] = useState<number | null>(null);
  const [isEditingFinished, setIsEditingFinished] = useState(false);

  const filteredTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.ACTIVE:
          return !todo.completed;

        case FilterBy.COMPLETED:
          return todo.completed;

        default:
          return true;
      }
    })
  ), [todos, filterBy]);

  const isSomeTodoCompleted = useMemo(() => (
    todos.some(todo => todo.completed) || false
  ), [filteredTodos]);

  const isEveryTodoCompleted = useMemo(() => (
    filteredTodos.every(todo => todo.completed) || false
  ), [filteredTodos]);

  const counter = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [filteredTodos]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsQueryDisabled(true);

    const newTodo = {
      userId: USER_ID,
      title: query,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    if (query.trim().length) {
      try {
        const newTodoFromServer = await post(USER_ID, query);

        setTodos(currTodos => [...currTodos, newTodoFromServer]);
        setQuery('');
      } catch (errorFromServer) {
        setError(ErrorType.POST);
      } finally {
        setTempTodo(null);
      }
    } else {
      setError(ErrorType.QUERY);
    }

    setIsQueryDisabled(false);
    setTempTodo(null);
  };

  const handleRemove = async (todoId: number | number[]) => {
    try {
      if (typeof todoId === 'number') {
        setProcessedIds(currIds => [...currIds, todoId]);
        await remove(todoId);
        setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
      } else {
        setProcessedIds(todoId);
        await Promise.all(todoId.map(remove));
        setTodos(currTodos => currTodos
          .filter(todo => !todoId.includes(todo.id)));
      }
    } catch (errorFromServer) {
      setError(ErrorType.DELETE);
    } finally {
      setProcessedIds(currIds => currIds.filter(id => id !== todoId));
    }
  };

  const handleErrorHide = () => {
    if (error !== ErrorType.GET && error !== ErrorType.INITIAL) {
      setError(ErrorType.INITIAL);
    }
  };

  const handleFilterButtonClick = (filterByType: FilterByType) => {
    setFilterBy(filterByType);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleClear = () => {
    const idsOfCompletedTodos
      = todos.filter(todo => todo.completed).map(todo => todo.id);

    handleRemove(idsOfCompletedTodos);
  };

  const handleToggle = async (
    todoId: number | { id: number; completed: boolean }[],
    completed?: boolean,
  ) => {
    try {
      const newCompleted = completed || false;

      if (typeof todoId === 'number') {
        setProcessedIds(currIds => [...currIds, todoId]);
        await patchToggleTodo(todoId, !newCompleted);
        setTodos(currTodos => {
          return currTodos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, completed: !newCompleted };
            }

            return todo;
          });
        });
      } else {
        setProcessedIds(todoId.map(singleId => singleId.id));
        const idsToUpdate = todoId.map(todo => todo.id);

        await Promise.all(
          todoId.map(todo => patchToggleTodo(todo.id, !todo.completed)),
        );
        setTodos(currTodos => {
          return currTodos.map(todo => {
            if (idsToUpdate.includes(todo.id)) {
              return { ...todo, completed: !newCompleted };
            }

            return todo;
          });
        });

        if (isEveryTodoCompleted) {
          setProcessedIds(todos.map(todo => todo.id));
          await Promise.all(
            todos.map(todo => patchToggleTodo(todo.id, !todo.completed)),
          );
          setTodos(currTodos => {
            return currTodos.map(todo => ({
              ...todo,
              completed: !todo.completed,
            }));
          });
        }
      }
    } catch {
      setError(ErrorType.PATCH);
    } finally {
      setProcessedIds([0]);
    }
  };

  const handleToggleAll = () => {
    const idsOfNotCompleted
      = todos
        .filter(todo => !todo.completed)
        .map(todo => ({ id: todo.id, completed: todo.completed }));

    handleToggle(idsOfNotCompleted);
  };

  const handleInputRename = (id: number, title: string) => {
    setInputTitle(title);
    setCurrTodoId(id);
  };

  const handleCancelEditing = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCurrTodoId(null);
      setTodos(todos);
    }
  };

  const handleInputBlur = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setIsEditingFinished(true);

    if (!inputTitle.length && currTodoId) {
      handleRemove(currTodoId);

      return;
    }

    try {
      if (currTodoId) {
        const editedTodo = todos.find(todo => todo.id === currTodoId);

        if (editedTodo) {
          if (editedTodo.title !== inputTitle) {
            editedTodo.title = inputTitle;
            await patchTitle(currTodoId, inputTitle);
          }
        }
      }
    } catch {
      setError(ErrorType.PATCH);
    } finally {
      setIsEditingFinished(false);
      setCurrTodoId(null);
    }
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorType.GET);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          query={query}
          isQueryDisabled={isQueryDisabled}
          filteredTodosLength={filteredTodos.length}
          handleQueryChange={handleQueryChange}
          handleToggleAll={handleToggleAll}
          isEveryTodoCompleted={isEveryTodoCompleted}
          handleSubmit={handleSubmit}
        />

        <TodosList
          todos={filteredTodos}
          handleRemove={handleRemove}
          handleToggle={handleToggle}
          handleInputRename={handleInputRename}
          inputTitle={inputTitle}
          setInputTitle={setInputTitle}
          handleInputBlur={handleInputBlur}
          handleCancelEditing={handleCancelEditing}
          isEditingFinished={isEditingFinished}
          tempTodo={tempTodo}
          processedIds={processedIds}
          currTodoId={currTodoId}
        />

        {!!todos.length && (
          <Footer
            filterBy={filterBy}
            isSomeTodoCompleted={isSomeTodoCompleted}
            handleFilterButtonClick={handleFilterButtonClick}
            handleClear={handleClear}
            counter={counter}
          />
        )}
      </div>

      <div className={
        classNames('notification is-danger is-light has-text-weight-normal',
          { hidden: error === ErrorType.INITIAL })
      }
      >
        <Error
          error={error}
          handleErrorHide={handleErrorHide}
        />
      </div>
    </div>
  );
};
