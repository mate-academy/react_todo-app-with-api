import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { CreateNewTodo } from './components/CreateNewTodo';
import { Todo, TodoUpdateData } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import {
  getTodos,
  addTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';
import { StatusFilter } from './types/StatusFilter';
import { TodoInfo } from './components/TodoInfo';

const USER_ID = 10906;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<
  StatusFilter>(StatusFilter.ALL);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const isToggleActive = todos.every(todo => todo.completed);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [errorMessage]);

  const clearForm = () => {
    setTempTodo(null);
    setIsLoading(false);
  };

  const handleAddTodo = useCallback(async (newTitle: string) => {
    if (!newTitle) {
      setErrorMessage(ErrorMessage.TITLE);

      return;
    }

    try {
      setIsLoading(true);

      const newTodoData = {
        userId: USER_ID,
        title: newTitle,
        completed: false,
      };

      setTempTodo({ ...newTodoData, id: 0 });

      const addedTodo = await addTodos(USER_ID, newTodoData);

      setTodos((prevTodos => [...prevTodos, addedTodo]));
      clearForm();
    } catch {
      clearForm();
      setErrorMessage(ErrorMessage.ADD);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodoIds((prevIds) => [...prevIds, todoId]);
      await removeTodo(todoId);

      setTodos((prevTodos => (
        prevTodos.filter(todo => todo.id !== todoId)
      )));

      setLoadingTodoIds((prevIds) => (
        prevIds.filter(prevId => prevId !== todoId)
      ));
    } catch {
      setErrorMessage(ErrorMessage.REMOVE);
    }
  }, []);

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const visibleTodos = useMemo(() => {
    const { ACTIVE, COMPLETED } = StatusFilter;

    switch (selectedFilter) {
      case ACTIVE:
        return activeTodos;

      case COMPLETED:
        return completedTodos;

      default:
        return todos;
    }
  }, [todos, selectedFilter]);

  const deleteCompletedTodos = async () => {
    try {
      await completedTodos.forEach(todo => {
        handleDeleteTodo(todo.id);
      });
    } catch {
      setErrorMessage(ErrorMessage.REMOVE);
    }
  };

  const handleUpdateTodo = useCallback(async (
    todoToUpdate: Todo, newTitle?: string,
  ) => {
    if (newTitle === todoToUpdate.title) {
      return;
    }

    if (newTitle === '') {
      handleDeleteTodo(todoToUpdate.id);

      return;
    }

    try {
      setLoadingTodoIds((prevIds) => [...prevIds, todoToUpdate.id]);
      const newTitleData = {
        title: newTitle,
      };

      const newCompletedData = {
        completed: !todoToUpdate.completed,
      };

      const updateTodoData: TodoUpdateData = newTitle
        ? newTitleData
        : newCompletedData;

      const updatedTodo: Todo = await (
        updateTodo(todoToUpdate.id, updateTodoData)
      );

      setTodos(prevTodos => (
        prevTodos.map(todo => (
          todo.id === todoToUpdate.id
            ? updatedTodo
            : todo
        ))));

      setLoadingTodoIds((prevIds) => (
        prevIds.filter(prevId => prevId !== todoToUpdate.id)));
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    }
  }, []);

  const handleToggleAll = async () => {
    try {
      const todosToUpdate = isToggleActive
        ? completedTodos
        : activeTodos;

      await todosToUpdate.forEach(todo => {
        handleUpdateTodo(todo);
      });
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="togggle"
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isToggleActive,
            })}
            onClick={handleToggleAll}
          />

          <CreateNewTodo
            setErrorMessage={setErrorMessage}
            onAddTodo={handleAddTodo}
            isLoading={isLoading}
          />

        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={handleDeleteTodo}
              loadingTodoIds={loadingTodoIds}
              onUpdateTodo={handleUpdateTodo}
            />
            {tempTodo && (
              <TodoInfo
                todo={tempTodo}
                loadingTodoId={tempTodo.id}
              />
            )}

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodos.length} items left`}
              </span>

              <Filter
                setSelectedFilter={setSelectedFilter}
                selectedFilter={selectedFilter}
              />

              {completedTodos && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={deleteCompletedTodos}
                >
                  Clear completed
                </button>
              )}

            </footer>
          </>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          aria-label="delete"
          type="button"
          className="delete"
          onClick={handleCloseError}
        />

        {errorMessage}
        <br />
      </div>
    </div>
  );
};
