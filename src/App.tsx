/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorEnum } from './types/ErrorEnum';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import classNames from 'classnames';
import { TodoItem } from './components/TodoItem';
import { Filter } from './types/Filter';

const filterOptions: {
  value: Filter;
  label: string;
  href: string;
  dataCy: string;
}[] = [
  { value: Filter.all, label: 'All', href: '#/', dataCy: 'FilterLinkAll' },
  {
    value: Filter.active,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: Filter.completed,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorEnum | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setError(ErrorEnum.loadTodo);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    switch (filter) {
      case Filter.all:
        setFilteredTodos([...todos]);
        break;
      case Filter.active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case Filter.completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
    }
  }, [filter, todos]);

  useEffect(() => {
    if (!isInputDisabled) {
      inputRef.current?.focus();
    }
  }, [isInputDisabled]);

  const deleteTodoFromServer = async (
    todoId: number,
  ): Promise<ErrorEnum | null> => {
    try {
      await deleteTodo(todoId);

      return null;
    } catch {
      return ErrorEnum.deleteTodo;
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(currentIds =>
      currentIds.includes(todoId) ? currentIds : [...currentIds, todoId],
    );

    try {
      const deleteError = await deleteTodoFromServer(todoId);

      if (deleteError) {
        setError(deleteError);

        return;
      }

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  };

  const handleDeleteCompletedTodo = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(currentIds => [
      ...currentIds,
      ...completedTodoIds.filter(id => !currentIds.includes(id)),
    ]);

    try {
      const results = await Promise.all(
        completedTodos.map(async todo => {
          const deleteError = await deleteTodoFromServer(todo.id);

          return { id: todo.id, error: deleteError };
        }),
      );

      const deletedIds = results
        .filter(result => result.error === null)
        .map(result => result.id);

      setTodos(currentTodos =>
        currentTodos.filter(todo => !deletedIds.includes(todo.id)),
      );

      if (results.some(result => result.error !== null)) {
        setError(ErrorEnum.deleteTodo);
      }
    } finally {
      setLoadingTodoIds(currentIds =>
        currentIds.filter(id => !completedTodoIds.includes(id)),
      );
      inputRef.current?.focus();
    }
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      setError(ErrorEnum.emptyTitle);

      return;
    }

    const todoData = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsInputDisabled(true);

    setTempTodo({
      id: 0,
      ...todoData,
    });

    try {
      const newTodo = await addTodo(todoData);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTodoTitle('');
      setError(null);
    } catch {
      setError(ErrorEnum.addTodo);
    } finally {
      setIsInputDisabled(false);
      setTempTodo(null);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
    setError(null);
  };

  const handleUpdateTodo = async (todo: Todo) => {
    setLoadingTodoIds(currentIds =>
      currentIds.includes(todo.id) ? currentIds : [...currentIds, todo.id],
    );

    try {
      const updatedTodo = await updateTodo(todo);

      setTodos(currentTodos => {
        const todoIndex = currentTodos.findIndex(
          currentTodo => currentTodo.id === todo.id,
        );

        const todosCopy = [...currentTodos];

        todosCopy.splice(todoIndex, 1, updatedTodo);

        return todosCopy;
      });
    } catch {
      setError(ErrorEnum.updateTodo);
      throw new Error(ErrorEnum.updateTodo);
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todo.id));
    }
  };

  const isAllTodosCompleted =
    todos.every(todo => todo.completed) && todos.length > 0;
  const isCompletedTodos = todos.some(todo => todo.completed);
  const todosCounter = todos.filter(todo => !todo.completed).length;
  const clearError = useCallback(() => setError(null), []);

  const handleClickToggleButton = async () => {
    const completed = !isAllTodosCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== completed);

    await Promise.allSettled(
      todosToUpdate.map(todo =>
        handleUpdateTodo({
          ...todo,
          completed,
        }),
      ),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllTodosCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleClickToggleButton}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleInputChange}
              disabled={isInputDisabled}
              autoFocus
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onTodoDelete={handleDeleteTodo}
            onTodoUpdate={handleUpdateTodo}
            loadingTodoIds={loadingTodoIds}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            loading={true}
            onTodoDelete={handleDeleteTodo}
            onTodoUpdate={handleUpdateTodo}
          />
        )}

        {(tempTodo || todos.length > 0) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosCounter} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {filterOptions.map(option => (
                <a
                  href={option.href}
                  className={classNames('filter__link', {
                    selected: filter === option.value,
                  })}
                  data-cy={option.dataCy}
                  onClick={() => setFilter(option.value)}
                  key={option.value}
                >
                  {option.label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!isCompletedTodos}
              onClick={handleDeleteCompletedTodo}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification error={error} onDismiss={clearError} />
    </div>
  );
};
