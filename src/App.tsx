/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { Footer } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { getFilteredTodos } from './utils/filterTodos';
import { FilterType } from './types/FilterType';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = getFilteredTodos(todos, filterBy);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setErrorMessage(ErrorMessage.TitleShouldNotBeEmpty);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }

    setIsLoading(true);

    const temporaryTodo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temporaryTodo);

    createTodo({ title: trimmedTitle, completed: false, userId: USER_ID })
      .then(currentTodo => {
        setTodos([...todos, currentTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToCAddTodo);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        inputRef.current?.focus();
      });
  }

  function handleDelete(todoId: number) {
    setProcessingIds(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDeleteTodo);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setProcessingIds(prevIds =>
          prevIds.filter(deleteId => deleteId !== todoId),
        );
        inputRef.current?.focus();
      });
  }

  function handleClearCompleted() {
    const deletedTodos = todos.filter(todo => todo.completed === true);

    deletedTodos.forEach(deletedTodo => handleDelete(deletedTodo.id));
  }

  function handleUpdateTodo(newTodo: Todo) {
    setProcessingIds(prevIds => [...prevIds, newTodo.id]);

    updateTodo(newTodo)
      .then(currentNewTodo => {
        setTodos(prevTodos => {
          return prevTodos.map(todo =>
            todo.id === currentNewTodo.id ? currentNewTodo : todo,
          );
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToUpdateTodo);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setProcessingIds(prevIds =>
          prevIds.filter(deleteId => deleteId !== newTodo.id),
        );
      });
  }

  function handleToggleAll() {
    const areAllCompleted = todos.every(todo => todo.completed);

    const newStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    const promisedAll = todosToUpdate.map(todo => {
      return updateTodo({ ...todo, completed: newStatus });
    });

    const idsToUpdate = todosToUpdate.map(t => t.id);

    setProcessingIds(currentId => [...currentId, ...idsToUpdate]);

    Promise.all(promisedAll)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => {
            if (idsToUpdate.includes(todo.id)) {
              return { ...todo, completed: newStatus };
            }

            return todo;
          }),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToUpdateTodo);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setProcessingIds(prevIds =>
          prevIds.filter(deleteId => !idsToUpdate.includes(deleteId)),
        );
      });
  }

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null);
    getTodos()
      .then(currentTodos => setTodos(currentTodos))
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoadTodos);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isLoading === false) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          inputRef={inputRef}
          title={title}
          onChangeTitle={setTitle}
          onToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deleteIds={processingIds}
              onDelete={handleDelete}
              onUpdate={handleUpdateTodo}
            />
            <Footer
              todos={todos}
              filterBy={filterBy}
              onFilter={setFilterBy}
              onClear={handleClearCompleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorMessage === null },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
