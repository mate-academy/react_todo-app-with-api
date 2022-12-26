/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import {
  addTodo,
  changeTodo,
  deleteTodo,
  getTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { AddTodoFieldForm } from './components/AddTodoFieldForm';
import { TodoFilters } from './types/TodoFilters';
import { ErrorNotification } from './components/ErrorNotification';
import { Error } from './types/Errors';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<TodoFilters>(TodoFilters.all);
  const [errorType, setErrorType] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingTodoId, setDeletingTodoId] = useState(0);
  const [updatingTodoId, setUpdatingTodoId] = useState(0);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([0]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const completedTodos = todos.filter(todo => todo.completed);

  const loadUsersTodos = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    } catch {
      setErrorType(Error.LoadTodos);
    }
  }, [user]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadUsersTodos();
  }, []);

  const processedTodos = useCallback(() => {
    const {
      completed,
      active,
      all,
    } = TodoFilters;

    return todos.filter(todo => {
      switch (filter) {
        case completed:
          return todo.completed;

        case active:
          return !todo.completed;

        case all:
        default:
          return todo;
      }
    });
  }, [filter, todos]);

  const visibleTodos = processedTodos();

  const activeTodos = todos.filter(todo => !todo.completed);

  const handleSubmitForm = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsAdding(true);

      if (title.trim() && user) {
        try {
          await addTodo({
            userId: user.id,
            title: title.trim(),
            completed: false,
          });

          await loadUsersTodos();
          setTitle('');
        } catch {
          setErrorType(Error.EmptyTitle);
        } finally {
          setIsAdding(false);
        }
      } else {
        setErrorType(Error.AddTodo);
      }
    }, [title, user],
  );

  const handleDelete = useCallback(async (todoId: number) => {
    setDeletingTodoId(todoId);

    try {
      await deleteTodo(todoId);
      await loadUsersTodos();
    } catch {
      setErrorType(Error.DeleteTodo);
    }

    setDeletingTodoId(0);
  }, []);

  const handleClearCompleteed = useCallback(async () => {
    try {
      setCompletedTodosId(completedTodos.map(todo => todo.id));

      await Promise.all(completedTodos.map(async todo => {
        await deleteTodo(todo.id);
      }));
    } catch {
      setErrorType(Error.DeleteTodo);
    } finally {
      setCompletedTodosId([]);
    }

    await loadUsersTodos();
  }, [completedTodos]);

  const handleCompleteAll = useCallback(async () => {
    setIsUpdating(true);

    try {
      if (todos.every(userTodo => userTodo.completed)) {
        await todos.forEach(async todo => {
          await changeTodo(todo.id, {
            completed: false,
          });
        });

        await loadUsersTodos();
      } else {
        await todos.forEach(async todo => {
          await changeTodo(todo.id, {
            completed: true,
          });
        });

        await loadUsersTodos();
      }

      await loadUsersTodos();
    } catch {
      setErrorType(Error.UpdateTodo);
    }

    setIsUpdating(false);
  }, [todos]);

  const handleChangeStatus = useCallback(
    async (changeTodoStatus: Todo) => {
      setUpdatingTodoId(changeTodoStatus.id);

      try {
        await changeTodo(changeTodoStatus.id, {
          completed: !changeTodoStatus.completed,
        });

        await loadUsersTodos();
      } catch {
        setErrorType(Error.UpdateTodo);
      }

      setUpdatingTodoId(0);
    }, [],
  );

  const handleChangeTitle = useCallback(
    async (id: number, newTitle: string) => {
      if (!newTitle) {
        handleDelete(id);

        return;
      }

      if (newTitle !== title) {
        try {
          await changeTodo(id, { title: newTitle });

          await loadUsersTodos();
        } catch {
          setErrorType(Error.UpdateTodo);
        }
      }
    }, [],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: todos.every(todo => todo.completed),
                },
              )}
              onClick={handleCompleteAll}
            />
          )}

          <AddTodoFieldForm
            onChangeTitle={setTitle}
            title={title}
            onSubmit={handleSubmitForm}
            isAdding={isAdding}
          />
        </header>

        <section
          className="todoapp__main"
          data-cy="TodoList"
        >
          <TodoList
            todos={visibleTodos}
            isAdding={isAdding}
            isUpdating={isUpdating}
            title={title}
            onDelete={handleDelete}
            deletingTodoId={deletingTodoId}
            updatingTodoId={updatingTodoId}
            completedTodosId={completedTodosId}
            onChangeStatus={handleChangeStatus}
            onEditTitle={handleChangeTitle}
          />
        </section>

        {(isAdding || !!todos.length) && (
          <Footer
            activeTodos={activeTodos.length}
            onSetFilter={setFilter}
            filter={filter}
            todos={todos}
            handleClearCompleteed={handleClearCompleteed}
          />
        )}
      </div>

      {errorType && (
        <ErrorNotification
          errorType={errorType}
          onErrorTypeChange={setErrorType}
        />
      )}
    </div>
  );
};
