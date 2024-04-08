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
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<FilterStatus>(FilterStatus.All);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [todoIdsInLoading, setTodoIdsInLoading] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | string>('');

  const [newTitle, setNewTitle] = useState<string>('');
  const [todoEditingId, setTodoEditingId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleErrorShow = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleErrorShow(ErrorMessage.LoadError);
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

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const normalizedTitle = newTitle.trim();

    if (!normalizedTitle) {
      handleErrorShow(ErrorMessage.TitleError);
      setIsLoading(false);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      completed: false,
      userId: USER_ID,
      title: normalizedTitle,
    };

    const temporaryTodo = { ...newTodo, id: 0 };

    setTempTodo(temporaryTodo);

    postTodos(newTodo)
      .then(response => {
        setTodos(prev => [...prev, response]);
        setTempTodo(null);
        setNewTitle('');
      })
      .catch(() => {
        handleErrorShow(ErrorMessage.AddingError);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(true);
    setTodoIdsInLoading(prev => [...prev, todoId]);
    deleteTodos(todoId)
      .then(() => {
        setTodos(prevTodo =>
          prevTodo.filter((todo: Todo) => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleErrorShow(ErrorMessage.DeletingError);
      })
      .finally(() => {
        setIsLoading(false);
        setTodoIdsInLoading(prev =>
          prev.filter(curTodoId => curTodoId !== todoId),
        );
      });
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
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
        handleErrorShow(ErrorMessage.UpdatingError);
      })
      .finally(() => {
        setTodoIdsInLoading(prev =>
          prev.filter(curTodoId => curTodoId !== updatedTodo.id),
        );
      });
  };

  const handleDeleteCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  const handleSetFilter = (filterSet: FilterStatus): void => {
    setFilterBy(filterSet);
  };

  const handleErrorMessage = (message: string): void => {
    setErrorMessage(message);
  };

  const handleToggler = () => {
    const activeTodos: Todo[] = todos.filter(todo => !todo.completed);

    if (activeTodos.length) {
      activeTodos.forEach(todo => {
        handleUpdateTodo(todo);
      });
    } else {
      todos.forEach(todo => {
        handleUpdateTodo(todo);
      });
    }
  };

  const visibleTodos = getFilteredTodos(todos, filterBy);
  const counterTodos = todos.filter(todo => todo.completed).length;
  const countOfActiveTodos = todos.length - counterTodos;
  const isEveryTodoCompleted = todos.every(todo => todo.completed);

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
                active: isEveryTodoCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggler}
            />
          )}
          <form onSubmit={handleAddTodo}>
            <input
              autoFocus
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
            onDeleteTodo={handleDeleteTodo}
            onUpdateTodo={handleUpdateTodo}
            todoIdsInLoading={todoIdsInLoading}
            onSetTodoIdsInLoading={setTodoIdsInLoading}
            onSetTodo={setTodos}
            onHandleErrorShow={handleErrorShow}
            todoEditingId={todoEditingId}
            onSetTodoEditingId={setTodoEditingId}
          />
        </section>

        {!!todos.length && (
          <Footer
            onSetFilter={handleSetFilter}
            completedTodoCounts={counterTodos}
            activeTodoCounts={countOfActiveTodos}
            selectedFilter={filterBy}
            onDeleteCompletedPosts={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        messageError={errorMessage}
        setMessageError={handleErrorMessage}
      />
    </div>
  );
};
