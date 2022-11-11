/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotifications } from './components/ErrorNotifications';
import { Footer } from './components/Footer';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList';

import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<ErrorType>({
    status: false,
    message: '',
  });
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const user = useContext(AuthContext);

  const hasTodos = todos.length > 0;
  const firstTodoIsAdding = isAdding && !hasTodos;
  const isEachTodoCompleted = useMemo(
    () => todos.every(todo => todo.completed), [todos],
  );

  const showError = useCallback((message: string) => {
    setError({ status: true, message });

    setTimeout(() => {
      setError({ status: false, message: '' });
    }, 3000);
  }, []);

  const loadTodos = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        showError('Unable to load todos');
      }
    }
  }, []);

  const handleAddNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      setIsAdding(true);

      try {
        if (!todoTitle.trim().length) {
          showError('Title can\'t be empty');
          setIsAdding(false);

          return;
        }

        await createTodo(todoTitle, user.id);
        await loadTodos();

        setIsAdding(false);
        setTodoTitle('');
      } catch {
        showError('Unable to add a todo');
        setIsAdding(false);
      }
    }
  };

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setDeletedTodoIds(currentTodoIds => [...currentTodoIds, todoId]);

    try {
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      showError('Unable to delete a todo');
      setDeletedTodoIds([]);
    }
  }, []);

  const handleDeleteCompletedTodos = useCallback(async () => {
    try {
      const completedTodoIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setDeletedTodoIds(completedTodoIds);

      await Promise.all(todos.map(async (todo) => {
        if (todo.completed) {
          await deleteTodo(todo.id);
        }

        return todo;
      }));

      await loadTodos();
    } catch {
      showError('Unable to delete a todo');
      setSelectedTodoIds([]);
    }
  }, [todos]);

  const handleToggleTodo = useCallback(
    async (todoId: number, completed: boolean) => {
      setSelectedTodoIds(currentTodoIds => [...currentTodoIds, todoId]);

      try {
        await updateTodo(todoId, { completed: !completed });
        await loadTodos();

        setSelectedTodoIds(currentTodoIds => (
          currentTodoIds.filter(id => id !== todoId)
        ));
      } catch {
        showError('Unable to update a todo');
        setSelectedTodoIds([]);
      }
    }, [],
  );

  const handleToggleAllTodos = useCallback(async () => {
    try {
      await Promise.all(todos.map(async (todo) => {
        if (!todo.completed || isEachTodoCompleted) {
          setSelectedTodoIds(currentTodoIds => [...currentTodoIds, todo.id]);

          await updateTodo(todo.id, { completed: !todo.completed });
        }
      }));

      await loadTodos();

      setSelectedTodoIds([]);
    } catch {
      showError('Unable to update a todo');
      setSelectedTodoIds([]);
    }
  }, [selectedTodoIds]);

  const handleChangeTodoTitle = useCallback(
    async (todoId: number, title: string) => {
      setSelectedTodoIds([todoId]);

      try {
        await updateTodo(todoId, { title });
        await loadTodos();

        setSelectedTodoIds([]);
      } catch {
        showError('Unable to update a todo');
        setSelectedTodoIds([]);
      }
    }, [],
  );

  const handleFilterSelect = useCallback((filterType: FilterType) => {
    setFilterBy(filterType);
  }, []);

  const handleCloseError = useCallback(() => {
    setError({ status: false, message: '' });
  }, []);

  const handleSetTodoTitle = useCallback((title: string) => {
    setTodoTitle(title);
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterBy) {
        case FilterType.ALL:
          return todo;

        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return true;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [filterBy, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cn('todoapp__toggle-all', {
                active: isEachTodoCompleted,
              })}
              onClick={handleToggleAllTodos}
            />
          )}

          <NewTodo
            todoTitle={todoTitle}
            onSetTodoTitle={handleSetTodoTitle}
            submitNewTodo={handleAddNewTodo}
            isAdding={isAdding}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          isAdding={isAdding}
          todoTitle={todoTitle}
          onDeleteTodo={handleDeleteTodo}
          deletedTodoIds={deletedTodoIds}
          onToggleTodo={handleToggleTodo}
          selectedTodoId={selectedTodoIds}
          onChangeTodoTitle={handleChangeTodoTitle}
        />

        {(hasTodos || firstTodoIsAdding) && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            onFilter={handleFilterSelect}
            onDeleteAllTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotifications error={error} onCloseError={handleCloseError} />
    </div>
  );
};
