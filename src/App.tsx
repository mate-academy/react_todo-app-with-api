/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { TodoStatus } from './types/TodoStatus';
import { TodoErrors } from './types/TodoErrors';
import { Footer } from './components/Footer';

function getFilteredTodos(
  todos: Todo[],
  { status }: { status: TodoStatus },
): Todo[] {
  let filteredTodos = [...todos];

  switch (status) {
    case TodoStatus.Active:
      filteredTodos = filteredTodos.filter(todo => todo.completed === false);
      break;
    case TodoStatus.Completed:
      filteredTodos = filteredTodos.filter(todo => todo.completed === true);
      break;
    default:
      break;
  }

  return filteredTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(TodoStatus.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [changedTodo, setChangedTodo] = useState<Todo | null>(null);
  const [todoTitleToChange, setTodoTitleToChange] = useState('');
  const [loadingTodos, setLoadingTodos] = useState<Todo['id'][]>([]);

  const completedTodos = todos.filter(todo => todo.completed);

  const inputRef = useRef<HTMLInputElement>(null);

  function hideErrorMessage() {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(TodoErrors.UnableLoadError);
        hideErrorMessage();
      });
  }, []);

  const handleStatus = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.All:
        setStatus(TodoStatus.All);
        break;
      case TodoStatus.Active:
        setStatus(TodoStatus.Active);
        break;
      case TodoStatus.Completed:
        setStatus(TodoStatus.Completed);
        break;
      default:
        break;
    }
  };

  const handleSetLoadingTodo = (todoId: Todo['id']) => {
    setLoadingTodos(currentIds => [...currentIds, todoId]);
  };

  const handleSetTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value.trimStart());
    setErrorMessage('');
  };

  const handleSetTodoTitleToChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitleToChange(event.target.value.trimStart());
    setErrorMessage('');
  };

  const handleSetChangedTodo = (todo: Todo) => {
    setTodoTitleToChange(todo.title);
    setChangedTodo(todo);
  };

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  function handleTodoSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (todoTitle === '') {
      setErrorMessage(TodoErrors.TitleError);
      hideErrorMessage();
    }

    if (todoTitle !== '') {
      setIsDisabled(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      });
      handleSetLoadingTodo(0);

      postTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      })
        .then(todo => {
          setTodos(currentTodos => [...currentTodos, todo]);
          setTodoTitle('');
        })
        .catch(() => {
          setErrorMessage(TodoErrors.UnableAddError);
          hideErrorMessage();
        })
        .finally(() => {
          setLoadingTodos(currentTodos => currentTodos.filter(id => id !== 0));
          setTempTodo(null);
          setIsDisabled(false);
        });
    }
  }

  function handleDeleteTodo(todoId: Todo['id']) {
    handleSetLoadingTodo(todoId);
    setIsDisabled(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(TodoErrors.UnableDeleteError);
        hideErrorMessage();
      })
      .finally(() => {
        setIsDisabled(false);
      });
  }

  function handleDeleteCompletedTodo() {
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setIsDisabled(true);

    setLoadingTodos(currentIds => [...currentIds, ...completedTodosIds]);
    Promise.allSettled(
      completedTodos.map(completedtodo =>
        deleteTodo(completedtodo.id)
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.filter(todo => todo.id !== completedtodo.id),
            );
          })
          .catch(() => {
            setErrorMessage(TodoErrors.UnableDeleteError);
            hideErrorMessage();
          })
          .finally(() => {
            setIsDisabled(false);
          }),
      ),
    );
  }

  function handlePatchTodo(updatedTodo: Todo) {
    handleSetLoadingTodo(updatedTodo.id);
    setIsDisabled(true);

    patchTodo(updatedTodo)
      .then((updatedTodo: Todo) => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
        setChangedTodo(null);
      })
      .catch(() => {
        setErrorMessage(TodoErrors.UnableUpdateError);
        hideErrorMessage();
      })
      .finally(() => {
        setLoadingTodos(currentIds =>
          currentIds.filter(id => updatedTodo.id !== id),
        );
        setIsDisabled(false);
      });
  }

  function handleToggleTodoStatus(changedtodo: Todo) {
    const updatedTodo = { ...changedtodo, completed: !changedtodo.completed };

    handlePatchTodo(updatedTodo);
  }

  function handleToggleAllCompleted() {
    const todoForUpdate = todos.filter(todo => !todo.completed);

    if (todoForUpdate.length === 0) {
      todos.forEach(todo => {
        handleToggleTodoStatus(todo);
      });
    } else {
      todoForUpdate.forEach(todo => {
        handleToggleTodoStatus(todo);
      });
    }
  }

  function handleTitleChange(todo: Todo | null) {
    if (todo === null) {
      setChangedTodo(null);
    }

    if (changedTodo && todoTitleToChange === '') {
      handleDeleteTodo(changedTodo.id);

      return;
    }

    if (changedTodo && todoTitleToChange !== changedTodo.title) {
      const updatedTodo = {
        ...changedTodo,
        title: todoTitleToChange.trim(),
      };

      handlePatchTodo(updatedTodo);
    } else {
      setChangedTodo(null);
    }
  }

  function handleSubmitTitleChange(
    event: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) {
    event.preventDefault();

    handleTitleChange(todo);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const preparedTodos = getFilteredTodos(todos, { status });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.length === completedTodos.length,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllCompleted}
            />
          )}

          <form onSubmit={handleTodoSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleSetTodoTitle}
              disabled={isDisabled}
              ref={inputRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={preparedTodos}
              tempTodo={tempTodo}
              loadingTodos={loadingTodos}
              changedTodo={changedTodo}
              onChangedTodo={handleSetChangedTodo}
              todoTitleToChange={todoTitleToChange}
              onTodoTitleToChange={handleSetTodoTitleToChange}
              onLoadingTodos={setLoadingTodos}
              onHandleDeleteTodo={handleDeleteTodo}
              onToggleStatus={handleToggleTodoStatus}
              onSubmitTitle={handleSubmitTitleChange}
              onHandleTitleChange={handleTitleChange}
            />

            <Footer
              todos={todos}
              completedTodos={completedTodos}
              status={status}
              onHandleStatus={handleStatus}
              onHandleDeleteCompletedTodo={handleDeleteCompletedTodo}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
