/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/Todo/Header/Header';
import { TodoList } from './components/Todo/List/List';
import { ErrorMessageComponent } from './components/ErrorMessage/ErrorMessage';
import { TodoFooter } from './components/Todo/Footer/Footer';
import { FilterOption } from './types/FilterOptions';
import { ErrorType as ErrorMessage } from './types/ErrorTypes';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { getInitialFilterFromHash } from './utils/getUrlHash';

const prepareTodos = (list: Todo[], filterBy: FilterOption) => {
  if (filterBy !== FilterOption.ALL) {
    return list.filter(todo => {
      switch (filterBy) {
        case FilterOption.ACTIVE: {
          return !todo.completed;
        }

        case FilterOption.COMPLETED: {
          return todo.completed;
        }

        default: {
          return true;
        }
      }
    });
  }

  return list;
};

export const App: React.FC = () => {
  // #region states
  const [filterBy, setFilterBy] = useState<FilterOption>(
    getInitialFilterFromHash(),
  );
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NO_ERROR);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);

  const [todoIdsInProcess, setTodoIdsInProcess] = useState<number[]>([]);
  // #endregion

  // #region handlers
  const handleFilterChange = (newType: FilterOption) => {
    setFilterBy(newType);
  };

  const handleAddTodo = useCallback(async (todoTitle: string) => {
    const sanitizedTitle = todoTitle.trim();

    if (!sanitizedTitle) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: sanitizedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTemporaryTodo(newTodo);

    try {
      const response: Todo = await addTodo(newTodo);

      setTodos(current => [...current, response]);
    } catch (error) {
      setErrorMessage(ErrorMessage.FAIL_CREATING);
      throw error;
    } finally {
      setTemporaryTodo(null);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (id: number) => {
    setTodoIdsInProcess(current => [...current, id]);

    try {
      await deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessage.FAIL_DELETING);
      throw error;
    } finally {
      setTodoIdsInProcess(current =>
        current.filter(currentId => currentId !== id),
      );
    }
  }, []);

  const handleDeleteCompleted = async () => {
    const ids = todos.filter(todo => todo.completed).map(todo => todo.id);
    const promises = ids.map(id => handleDeleteTodo(id));

    await Promise.allSettled(promises);
  };

  const handleUpdateTodo = useCallback(
    async (todoToUpdate: Todo, dataToPatch: Partial<Todo>) => {
      setTodoIdsInProcess(current => [...current, todoToUpdate.id]);

      try {
        const result = await updateTodo({ ...todoToUpdate, ...dataToPatch });

        setTodos(prevTodos => {
          const index = prevTodos.findIndex(
            todo => todo.id === todoToUpdate.id,
          );

          const splicedArr = prevTodos.toSpliced(index, 1, result);

          return splicedArr;
        });
      } catch (error) {
        setErrorMessage(ErrorMessage.FAIL_UPDATING);
        throw error;
      } finally {
        setTodoIdsInProcess(current =>
          current.filter(id => id !== todoToUpdate.id),
        );
      }
    },
    [],
  );

  const handleToggleAllTodos = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToToggle = allCompleted
      ? todos
      : todos.filter(todo => !todo.completed);
    const promises = todosToToggle.map(todo =>
      handleUpdateTodo(todo, { completed: !allCompleted }),
    );

    await Promise.allSettled(promises);
  };

  const handleRenameTodo = useCallback(
    async (todoToUpdate: Todo, newTitle: Todo['title']) => {
      if (!newTitle) {
        return handleDeleteTodo(todoToUpdate.id);
      }

      return handleUpdateTodo(todoToUpdate, { title: newTitle });
    },
    [handleDeleteTodo, handleUpdateTodo],
  );

  // #endregion

  // #region useEffects
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const result = await getTodos();

        setTodos(result);
        setErrorMessage(ErrorMessage.NO_ERROR);
      } catch (error) {
        setErrorMessage(ErrorMessage.FAIL_LOADING);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setErrorMessage(ErrorMessage.NO_ERROR);
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [errorMessage]);

  // #endregion

  const visibleTodos = useMemo(
    () => prepareTodos(todos, filterBy),
    [todos, filterBy],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onAddTodo={handleAddTodo}
          isLoading={temporaryTodo !== null}
          onToggleAll={handleToggleAllTodos}
        />
        <TodoList
          todos={visibleTodos}
          todoIdsInProcess={todoIdsInProcess}
          temporaryTodo={temporaryTodo}
          onTodoRemove={handleDeleteTodo}
          onTodoUpdate={handleUpdateTodo}
          onTodoRename={handleRenameTodo}
        />
        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filterBy={filterBy}
            onFilterChange={handleFilterChange}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorMessageComponent
        message={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
