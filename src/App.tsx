/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import cn from 'classnames';
import { Footer } from './components/Footer/Footer';
import { TodoFilter } from './types/TodoFilter';
import { Header } from './components/Header/Header';
import { TodoError } from './types/TodoError';

function preperedData(dataTodos: Todo[], groupBy: string): Todo[] {
  let visibleTodos = [...dataTodos];

  visibleTodos = visibleTodos.filter((todos: Todo) => {
    switch (groupBy) {
      case TodoFilter.Active:
        return todos.completed === false;

      case TodoFilter.Completed:
        return todos.completed === true;

      default:
        return true;
    }
  });

  return visibleTodos;
}

export const App: React.FC = () => {
  const [todosDataFromServer, setodosDataFromServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingStartWindow, setLoadingStartWindow] = useState<boolean>(false);
  const [groupBy, setGroupBy] = useState<TodoFilter>(TodoFilter.All);
  const [isFocusHeaderInput, setIsFocusHeaderInput] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoadingSpinner, setIsLoadingSpinner] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'userId'> | null>(null);
  const [listTodoId, setListTodoId] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const visibleData = preperedData(todosDataFromServer, groupBy);

  const loadTodos = () => {
    setErrorMessage('');
    setLoadingStartWindow(true);
    getTodos()
      .then((todosFromServer: Todo[]) => {
        setodosDataFromServer(todosFromServer);
      })
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoadingStartWindow(false));
  };

  const errorTimeOut = (errorNotification: string) => {
    let timerId: NodeJS.Timeout | number | undefined;

    if (errorNotification) {
      timerId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  };

  const handleGroupBy = (typeGroupBy: TodoFilter) => {
    setGroupBy(typeGroupBy);
  };

  const handleEmptyInputError = () => {
    if (inputValue.trim().length === 0) {
      setErrorMessage(TodoError.EMPTY_TITLE);
    } else {
      setErrorMessage('');
    }
  };

  function addTodo({ title, completed }: Omit<Todo, 'id' | 'userId'>) {
    setErrorMessage('');
    setIsFocusHeaderInput(false);
    setIsLoadingSpinner(true);
    createTodos({ title, completed, userId: USER_ID })
      .then(newTodo => {
        setInputValue('');
        setodosDataFromServer(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(TodoError.ADD_FAILED);
      })
      .finally(() => {
        setIsLoadingSpinner(false);
        setIsFocusHeaderInput(true);
        setTempTodo(null);
      });
  }

  function removeTodo(todoId: number) {
    setListTodoId(prev => [...prev, todoId]);
    setErrorMessage('');
    setIsFocusHeaderInput(false);
    setIsLoadingSpinner(true);
    deleteTodos(todoId)
      .then(() => {
        setodosDataFromServer(prevTodos =>
          prevTodos.filter(todo => todo.id !== todoId),
        );
        setListTodoId([]);
      })
      .catch(() => {
        setErrorMessage(TodoError.DELETE_FAILED);
      })
      .finally(() => {
        setIsLoadingSpinner(false);
        setIsFocusHeaderInput(true);
      });
  }

  function updateTodo({ id, title, completed }: Omit<Todo, 'userId'>) {
    setListTodoId(prev => [...prev, id]);
    updateTodos({ id, title, completed, userId: USER_ID })
      .then(updatedTodo => {
        setodosDataFromServer(prevTodos => {
          const newTodos = [...prevTodos];
          const index = newTodos.findIndex(todo => updatedTodo.id === todo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
        setEditingTodoId(null);
      })
      .catch(() => {
        setErrorMessage(TodoError.UPDATE_FAILED);
      })
      .finally(() => {
        setListTodoId([]);
      });
  }

  const handleDeleteAllCompleted = () => {
    const completedTodos = todosDataFromServer.filter(
      todo => todo.completed === true,
    );

    completedTodos.forEach(todo => removeTodo(todo.id));
  };

  const handleInputValue = (event: string) => {
    setInputValue(event);
  };

  const handleTempTodo = (temporaryTodo: Omit<Todo, 'userId'>) => {
    setTempTodo(temporaryTodo);
  };

  const handleUpdatedTodoTitle = (updateTodoTitle: Omit<Todo, 'userId'>) => {
    const prevTitle = todosDataFromServer.find(
      todo => todo.id === updateTodoTitle.id,
    )?.title;

    if (prevTitle === updateTodoTitle.title) {
      setEditingTodoId(null);

      return;
    }

    if (updateTodoTitle.title.length === 0) {
      removeTodo(updateTodoTitle.id);

      return;
    }

    if (editingTodoId) {
      updateTodo(updateTodoTitle);
    }
  };

  const handleToggleCompleted = (updateTodoCompleted: Omit<Todo, 'userId'>) => {
    updateTodo(updateTodoCompleted);
  };

  const handleAllToggleButton = () => {
    const isAllCompleted = todosDataFromServer.every(
      (todo: Todo) => todo.completed,
    );
    const invertStateCompleted = !isAllCompleted;

    const todosToUpdate = todosDataFromServer.filter(
      todo => todo.completed !== invertStateCompleted,
    );

    todosToUpdate.forEach(todo =>
      updateTodo({ ...todo, completed: invertStateCompleted }),
    );
  };

  const handleEditingTodo = (todoId: number) => {
    setEditingTodoId(todoId);
  };

  const handleKeyEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  const isFullTodosCompleted = useMemo(() => {
    return todosDataFromServer.every((todo: Todo) => todo.completed === true);
  }, [todosDataFromServer]);

  const isOneTodosCompleted = useMemo(() => {
    return todosDataFromServer.some((todo: Todo) => todo.completed === true);
  }, [todosDataFromServer]);

  const completedCount = useMemo(() => {
    return todosDataFromServer.filter(todo => !todo.completed).length;
  }, [todosDataFromServer]);

  const isShowElement = !loadingStartWindow && todosDataFromServer.length > 0;

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    errorTimeOut(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyEscape);

    return () => {
      document.removeEventListener('keydown', handleKeyEscape);
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isShowElement={isShowElement}
          isFocusHeaderInput={isFocusHeaderInput}
          handleEmptyInputError={handleEmptyInputError}
          inputValue={inputValue}
          onInputChange={handleInputValue}
          onSubmit={addTodo}
          onSubmitAddTempTodo={handleTempTodo}
          isFullTodosCompleted={isFullTodosCompleted}
          isLoadingSpinner={isLoadingSpinner}
          onClickAllToggleButton={handleAllToggleButton}
        />

        {isShowElement && (
          <TodoList
            visibleData={visibleData}
            isLoadingSpinner={isLoadingSpinner}
            tempTodo={tempTodo}
            onClickDeleteTodo={removeTodo}
            listTodoId={listTodoId}
            onClickToggleCompleted={handleToggleCompleted}
            onDoubleClickEditTodo={handleEditingTodo}
            currentEditingTodoId={editingTodoId}
            onSubmitUpdateTodo={handleUpdatedTodoTitle}
          />
        )}
        {/* Hide the footer if there are no todos */}

        {isShowElement && (
          <Footer
            completedCount={completedCount}
            onHandleGroupBy={handleGroupBy}
            groupBy={groupBy}
            isOneTodosCompleted={isOneTodosCompleted}
            onClickDeleteAllCompleted={handleDeleteAllCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage.length === 0 },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
