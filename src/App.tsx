import React, {
  useCallback,
  useContext, useEffect, useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Erorr } from './components/Error/Error';
import { FilterTodoList } from './components/FilterTodoList/FilterTodoList';
import { TodoList } from './components/TodoList/TodoList';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TypeError } from './types/ErrorType';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodos,
  deleteTodos,
  toggleTodo,
  renameTodo,
} from './api/todos';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<TypeError>(TypeError.NONE);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodosIds, setDeletedTodoIds] = useState<number[]>([]);
  const [isTogled, setIsTogled] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number[]>([]);

  const loadTodosFromServer = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setHasError(true);
        setErrorType(TypeError.LOAD);
      }
    }
  }, []);

  const newTodoTitleHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setNewTodoTitle(event.target.value);

  const removeErorrHandler = () => {
    setHasError(false);
    setErrorType(TypeError.NONE);
  };

  const submitNewTodoHandler = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (user) {
      setIsAdding(true);

      try {
        if (newTodoTitle.trim().length === 0) {
          setHasError(true);
          setErrorType(TypeError.TITLE);
          setIsAdding(false);

          return;
        }

        setTimeout(async () => {
          await addTodos(newTodoTitle, user.id);
          await loadTodosFromServer();
        }, 100);

        setIsAdding(false);
        setNewTodoTitle('');
      } catch {
        setErrorType(TypeError.ADD);
        setHasError(true);
      }
    }
  };

  const clearAllHandler = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    todos.forEach(async todo => {
      if (todo.completed) {
        try {
          setDeletedTodoIds(completedTodoIds);
          await deleteTodos(todo.id);
          await loadTodosFromServer();
        } catch {
          setErrorType(TypeError.DELETE);
          setHasError(true);
          setDeletedTodoIds([]);
        }
      }
    });
  };

  const deleteTodoHandler = async (todoId: number) => {
    setDeletedTodoIds([todoId]);

    try {
      await deleteTodos(todoId);
      await loadTodosFromServer();
    } catch {
      setErrorType(TypeError.DELETE);
      setHasError(true);
      setDeletedTodoIds([]);
    }
  };

  const togleAllHandler = async () => {
    try {
      setIsTogled(!isTogled);

      visibleTodos.forEach(todo => {
        toggleTodo(todo.id, !todo.completed);

        return todo;
      });

      await loadTodosFromServer();
    } catch {
      setErrorType(TypeError.LOAD);
      setHasError(true);
    }
  };

  const handleChangeTodoTittle = useCallback(
    async (todoId: number, title: string) => {
      setSelectedTodoId([todoId]);

      try {
        await renameTodo(todoId, { title });
        await loadTodosFromServer();

        setSelectedTodoId([]);
      } catch {
        setErrorType(TypeError.UPDATE);
        setHasError(true);

        setSelectedTodoId([]);
      }
    }, [],
  );

  useEffect(() => {
    loadTodosFromServer();
  }, [todos]);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterType) {
        case FilterType.All:
          return todo;

        case FilterType.Active:
          return !todo.completed;

        case FilterType.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            aria-label="Toggle"
            onClick={togleAllHandler}
          />

          <NewTodo
            newTodoTitle={newTodoTitle}
            newTodoTitleHandler={newTodoTitleHandler}
            submitNewTodoHandler={submitNewTodoHandler}
            isAdding={isAdding}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          deleteTodoHandler={deleteTodoHandler}
          deletedTodosIds={deletedTodosIds}
          isTogled={isTogled}
          handleChangeTodoTittle={handleChangeTodoTittle}
          selectedTodoId={selectedTodoId}
          isAdding={isAdding}
          newTodoTitle={newTodoTitle}
        />

        <FilterTodoList
          todosLeft={visibleTodos.length}
          setFilterType={setFilterType}
          filterType={filterType}
          visibleTodos={visibleTodos}
          clearAllHandler={clearAllHandler}
        />
      </div>

      {hasError
        && (
          <Erorr
            errorType={errorType}
            onRemoveErrorHandler={removeErorrHandler}
          />
        )}
    </div>
  );
};
