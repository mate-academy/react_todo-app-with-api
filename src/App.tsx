/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { FilterBy } from './types/FilterBy';
import { TodoList } from './components/TodoList';
import { ErrorsType } from './types/ErrorsType';
import { AddTodoField } from './components/AddTodoField';
import { Errors } from './components/Errors';
import { ClearAllButton } from './components/ClearAllButton';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<ErrorsType>(ErrorsType.NONE);
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);
  const [selectingTodoIds, setSelectingTodoIds] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getTodosFromApi = useCallback(async () => {
    if (user) {
      let todosApi;

      try {
        todosApi = await getTodos(user?.id);
      } catch {
        throw new Error('Todos not found');
      }

      setTodos(todosApi);
    }
  }, []);

  useEffect(() => {
    getTodosFromApi();
  }, [isDeleting]);

  useEffect(() => {
    setTimeout(() => setError(ErrorsType.NONE), 3000);
  }, [error]);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.ACTIVE:
          return !todo.completed;
        case FilterBy.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [filterBy, todos]);

  const handleFilter = useCallback((filter: FilterBy) => {
    setFilterBy(filter);
  }, []);

  const clearErrors = useCallback(() => {
    setError(ErrorsType.NONE);
  }, []);

  const todosLeft = todos.filter(todo => !todo.completed);

  const handleAddTodo = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const trimTitle = newTitle.trim();

    if (!trimTitle) {
      setError(ErrorsType.ISEMPTY);
    }

    if (user && trimTitle) {
      setIsAdding(true);

      const newTodo = {
        userId: user.id,
        title: trimTitle,
        completed: false,
      };

      try {
        await addTodo(newTodo);
      } catch {
        setError(ErrorsType.ADD);
      }
    }

    await getTodosFromApi();
    setNewTitle('');
    setIsAdding(false);
  }, [newTitle, user]);

  const handleNewTitle = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTitle(event.target.value);
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setIsDeleting(true);

    if (user) {
      try {
        await deleteTodo(todoId);
      } catch {
        setError(ErrorsType.DELETE);
      }
    }

    setIsDeleting(false);
  }, [user]);

  const handleClearCompleted = useCallback(() => {
    const deletingTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingTodosIds(deletingTodoIds);

    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  }, [todos]);

  const toggleTodo = useCallback(
    async (todoId: number, completed: boolean) => {
      setSelectingTodoIds(currentTodoIds => [...currentTodoIds, todoId]);

      try {
        await updateTodo(todoId, { completed: !completed });
        await getTodosFromApi();

        setSelectingTodoIds(currentTodoIds => (
          currentTodoIds.filter(id => id !== todoId)
        ));
      } catch {
        setError(ErrorsType.UPDATE);
        setSelectingTodoIds([]);
      }
    }, [],
  );

  const isAllTodoCompleted = useMemo(
    () => todos.every(todo => todo.completed), [todos],
  );

  const toggleAllTodos = useCallback(async () => {
    try {
      await Promise.all(todos.map(async (todo) => {
        if (!todo.completed || isAllTodoCompleted) {
          setSelectingTodoIds(currentTodoIds => [...currentTodoIds, todo.id]);

          await updateTodo(todo.id, { completed: !todo.completed });
        }
      }));

      await getTodosFromApi();
      setSelectingTodoIds([]);
    } catch {
      setError(ErrorsType.UPDATE);
      setSelectingTodoIds([]);
    }
  }, [selectingTodoIds]);

  const changeTodoTitle = useCallback(
    async (todoId: number, title: string) => {
      setSelectingTodoIds([todoId]);

      try {
        await updateTodo(todoId, { title });
        await getTodosFromApi();

        setSelectingTodoIds([]);
      } catch {
        setError(ErrorsType.UPDATE);
        setSelectingTodoIds([]);
      }
    }, [],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddTodoField
          isAdding={isAdding}
          handleAddTodo={handleAddTodo}
          newTodoField={newTodoField}
          newTitle={newTitle}
          handleNewTitle={handleNewTitle}
          toggleAllTodos={toggleAllTodos}
          isAllTodoCompleted={isAllTodoCompleted}
          todos={todos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              newTitle={newTitle}
              isAdding={isAdding}
              handleDeleteTodo={handleDeleteTodo}
              deletingTodosIds={deletingTodosIds}
              toggleTodo={toggleTodo}
              changeTodoTitle={changeTodoTitle}
              selectingTodoIds={selectingTodoIds}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${todosLeft.length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames(
                    'filter__link',
                    { selected: filterBy === FilterBy.ALL },
                  )}
                  onClick={() => handleFilter(FilterBy.ALL)}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames(
                    'filter__link',
                    { selected: filterBy === FilterBy.ACTIVE },
                  )}
                  onClick={() => handleFilter(FilterBy.ACTIVE)}
                >
                  Active
                </a>

                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames(
                    'filter__link',
                    { selected: filterBy === FilterBy.COMPLETED },
                  )}
                  onClick={() => handleFilter(FilterBy.COMPLETED)}
                >
                  Completed
                </a>
              </nav>
              <ClearAllButton
                handleClearCompleted={handleClearCompleted}
                todos={todos}
              />
            </footer>
          </>
        )}
      </div>
      <Errors
        clearErrors={clearErrors}
        error={error}
      />
    </div>
  );
};
