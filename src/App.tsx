import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  postTodos,
  deleteTodos,
  patchTodo,
} from './api/todos';
import { TodoList } from './Components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Footer } from './Components/Footer/Footer';
import { FilterStatus } from './types/FilterStatus';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { ErrorNotification } from './Components/ErrorNotification';
import { getRandomNumberId } from './utils/getRandomNumberId';
import { getCountOfCompletedTodos } from './utils/getCountOfCompletedTodos';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [newTitle, setNewTitle] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoIdsInLoading, setTodoIdsInLoading] = useState<number[]>([]);
  const [todoEditingId, setTodoEditingId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handlerErrorShow = (error: string): void => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    getTodos()
      .then(setTodos)
      .catch(() => {
        handlerErrorShow(ErrorMessage.LoadError);
      })
      .finally(() => {
        setTempTodo(null);
        setNewTitle('');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handlerAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const normalizedTitle = newTitle.trim();

    if (!normalizedTitle) {
      handlerErrorShow(ErrorMessage.TitleError);
      setIsLoading(false);

      return;
    }

    const newTodo: Todo = {
      id: getRandomNumberId(),
      completed: false,
      userId: USER_ID,
      title: normalizedTitle,
    };

    const temporaryTodo = { ...newTodo, id: 0 };

    setTempTodo(temporaryTodo);

    postTodos(newTodo)
      .then(() => {
        setTodos(prev => [...prev, newTodo]);
        setTempTodo(null);
        setNewTitle('');
      })
      .catch(() => {
        handlerErrorShow(ErrorMessage.AddingError);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handlerDeleteTodo = (todoId: number) => {
    setIsLoading(true);
    setTodoIdsInLoading(prev => [...prev, todoId]);
    deleteTodos(todoId)
      .then(() => {
        {
          setTodos(prevTodo =>
            prevTodo.filter((todo: Todo) => todo.id !== todoId),
          );
        }
      })
      .catch(() => {
        handlerErrorShow(ErrorMessage.DeletingError);
      })
      .finally(() => {
        setIsLoading(false);
        setTodoIdsInLoading(prev =>
          prev.filter(curTodoId => curTodoId !== todoId),
        );
      });
  };

  const handlerUpdateTodo = async (updatedTodo: Todo) => {
    const updatedField: Todo = {
      ...updatedTodo,
      completed: !updatedTodo.completed,
    };

    setTodoIdsInLoading(prev => [...prev, updatedTodo.id]);

    patchTodo(updatedTodo.id, updatedField)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(item => {
            if (item.id === updatedTodo.id) {
              return updatedField;
            }

            return item;
          }),
        );
      })
      .catch(() => {
        handlerErrorShow(ErrorMessage.UpdatingError);
      })
      .finally(() => {
        setTodoIdsInLoading(prev =>
          prev.filter(curTodoId => curTodoId !== updatedTodo.id),
        );
      });
  };

  const handlerDeleteCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handlerDeleteTodo(todo.id);
      }
    });
  };

  const handlerSetFilter = (filterSet: FilterStatus): void => {
    setFilterBy(filterSet);
  };

  const handlerErrorMessage = (message: string): void => {
    setErrorMessage(message);
  };

  const handlerToggler = () => {
    const activeTodos: Todo[] = todos.filter(todo => !todo.completed);

    if (activeTodos.length) {
      activeTodos.forEach(todo => {
        handlerUpdateTodo(todo);
      });
    } else {
      todos.forEach(todo => {
        handlerUpdateTodo(todo);
      });
    }
  };

  const visibleTodos = getFilteredTodos(todos, filterBy);
  const counterTodos = getCountOfCompletedTodos(todos);
  const countOfActiveTodos = todos.length - counterTodos;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handlerToggler}
            />
          )}
          <form onSubmit={handlerAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            currentTodos={visibleTodos}
            temporaryTodo={tempTodo}
            onDeleteTodo={handlerDeleteTodo}
            onUpdateTodo={handlerUpdateTodo}
            todoIdsInLoading={todoIdsInLoading}
            onSetTodoIdsInLoading={setTodoIdsInLoading}
            onSetTodo={setTodos}
            onHandleErrorShow={handlerErrorShow}
            todoEditingId={todoEditingId}
            onSetTodoEditingId={setTodoEditingId}
          />
        </section>

        {!!todos.length && (
          <Footer
            onSetFilter={handlerSetFilter}
            completedTodoCounts={counterTodos}
            activeTodoCounts={countOfActiveTodos}
            selectedFilter={filterBy}
            onDeleteCompletedPosts={handlerDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        messageError={errorMessage}
        setMessageError={handlerErrorMessage}
      />
    </div>
  );
};
