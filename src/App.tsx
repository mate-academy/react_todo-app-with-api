/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';

// import { UserWarning } from 'UserWarning';
// import { getTodos, updateTodo, USER_ID } from './api/todos';
import * as api from './api/todos';
import { Todo } from './types/Todo';
import { Head } from './components/headers/headers';
import { Main } from './components/Main/main';
import { Footer } from './components/footer/Footer';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterOption } from './types/FilterOption';
import { NewTodo } from './types/newTodo';
import { TempTodo } from './components/tempTodo/tempTodo';
import { LoadingState } from './types/loadingState';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterOption.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [loadingTodo, setLoadingTodo] = useState<LoadingState>({
    isLoading: false,
    id: [],
  });
  const refFocusInputSearch = useRef<HTMLInputElement>(null);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);
  const allTodosCompleted = todosFromServer.every(todo => todo.completed);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [tempTodo, setTempTodo] = useState<string | null>(null);
  let visibilitedTodos: Todo[] = todosFromServer;

  // #region addTodo

  const handleSubmitAddTodo = (newTodoLabel: string) => {
    if (newTodoLabel.trim().length === 0) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const todoLabel: NewTodo = {
      title: newTodoLabel.trim(),
      userId: 4499,
      completed: false,
    };

    setIsLoadingAdd(true);
    setTempTodo(newTodoLabel);

    api
      .addTodo(todoLabel)
      .then(reason => {
        setTodosFromServer(current => {
          return [...current, reason];
        });
        setInputValue('');
      })
      .catch(() => setErrorMessage(ErrorMessage.Add))
      .finally(() => {
        setIsLoadingAdd(false);
        setTempTodo(null);
      });
  };

  // #endregion addTodo

  // #region filterTodos

  if (filterStatus === FilterOption.Active) {
    visibilitedTodos = todosFromServer.filter(todo => !todo.completed);
  }

  if (filterStatus === FilterOption.Completed) {
    visibilitedTodos = todosFromServer.filter(todo => todo.completed);
  }

  // #endregion filterTodos

  // #region toggle all

  const handleArrowAddStatus = async () => {
    const newStatus = !allTodosCompleted;

    const todosToUpdate = todosFromServer.filter(
      todo => todo.completed !== newStatus,
    );

    const updatedTodos = todosToUpdate.map(todo => ({
      ...todo,
      completed: newStatus,
    }));

    updatedTodos.forEach(todo => {
      setLoadingTodo(prev => ({
        isLoading: true,
        id: [...prev.id, todo.id],
      }));
    });

    await Promise.all(updatedTodos.map(todo => api.updateTodo(todo, todo.id)))
      .then(() => {
        setTodosFromServer(current =>
          current.map(todo => {
            const updatedTodo = updatedTodos.find(
              updated => updated.id === todo.id,
            );

            return updatedTodo || todo;
          }),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      })
      .finally(() => {
        setLoadingTodo({
          isLoading: false,
          id: [],
        });

        window.setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };
  // #endregion toggle all

  // #region checkbox

  const handleCheckBoxStatus = (id: number, status: boolean) => {
    const todo = todosFromServer.find(tod => tod.id === id);

    if (!todo) {
      return;
    }

    setLoadingTodo(prev => ({
      isLoading: true,
      id: [...prev.id, id],
    }));

    const updatedTodo: Todo = {
      ...todo,
      completed: !status,
    };

    api
      .updateTodo(updatedTodo, id)
      .then(todoNew => {
        setTodosFromServer(current => {
          const updatedTodos = [...current];

          const index = current.findIndex(tod => tod.id === id);

          updatedTodos.splice(index, 1, todoNew);

          return updatedTodos;
        });
      })
      .catch(() => setErrorMessage(ErrorMessage.Update))
      .finally(() => {
        window.setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        setLoadingTodo(prev => ({
          isLoading: false,
          id: prev.id.filter(idPrev => id !== idPrev),
        }));
      });
  };

  // #endregion checkbox

  // #region get todos

  useEffect(() => {
    api
      .getTodos()
      .then(setTodosFromServer)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      })
      .finally(() => {
        setIsLoadingTodos(false);

        window.setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  // #endregion get todos

  // #region focus

  useEffect(() => {
    refFocusInputSearch.current?.focus();
  }, [todosFromServer.length, isLoadingAdd]);

  // #endregion focus

  // #region delete
  const deleteTodo = (id: number) => {
    setLoadingTodo(prev => ({
      isLoading: true,
      id: [...prev.id, id],
    }));

    api
      .deleteTodo(id)
      .then(() => {
        setTodosFromServer(current => current.filter(cur => cur.id !== id));
      })
      .catch(() => setErrorMessage(ErrorMessage.Delete))
      .finally(() => {
        window.setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        setLoadingTodo(prev => ({
          isLoading: false,
          id: prev.id.filter(idPrev => id !== idPrev),
        }));
      });
  };

  const deleteAllCompleteTodo = async () => {
    const completeTodos = todosFromServer.filter(todo => todo.completed);

    setIsDeletingCompleted(true);

    const results = await Promise.allSettled(
      completeTodos.map(todo => api.deleteTodo(todo.id)),
    );

    const failedIds = results
      .map((result, index) =>
        result.status === 'rejected' ? completeTodos[index].id : null,
      )
      .filter((id): id is number => id !== null);

    setTodosFromServer(current =>
      current.filter(todo => !todo.completed || failedIds.includes(todo.id)),
    );

    if (failedIds.length > 0) {
      setErrorMessage(ErrorMessage.Delete);
    }

    setIsDeletingCompleted(false);
  };
  // #endregion delete

  // #region edit

  const editTodo = async (
    newTitle: string,
    id: number,
    prevTitle: string,
  ): Promise<boolean> => {
    if (newTitle.trim() === prevTitle) {
      return true;
    }

    if (newTitle.trim().length === 0) {
      deleteTodo(id);

      return false;
    }

    const todo = todosFromServer.find(tod => tod.id === id);

    if (!todo) {
      return false;
    }

    setLoadingTodo(prev => ({
      isLoading: true,
      id: [...prev.id, id],
    }));

    const updatedTodo = {
      ...todo,
      title: newTitle.trim(),
    };

    try {
      const todoNew = await api.updateTodo(updatedTodo, id);

      setTodosFromServer(current => {
        const updatedTodos = [...current];
        const index = current.findIndex(tod => tod.id === id);

        updatedTodos.splice(index, 1, todoNew);

        return updatedTodos;
      });

      return true;
    } catch {
      setErrorMessage(ErrorMessage.Update);

      return false;
    } finally {
      window.setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      setLoadingTodo(prev => ({
        isLoading: false,
        id: prev.id.filter(idPrev => id !== idPrev),
      }));
    }
  };
  // #endregion edit
  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Head
          inputRef={refFocusInputSearch}
          arrow={handleArrowAddStatus}
          todos={todosFromServer}
          handleSubmit={handleSubmitAddTodo}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoadingAdd={isLoadingAdd}
          isLoadingTodos={isLoadingTodos}
        />
        <Main
          visibilitedTodos={visibilitedTodos}
          handleCheck={handleCheckBoxStatus}
          deleteTodo={deleteTodo}
          loadingTodo={loadingTodo}
          isDeletingCompleted={isDeletingCompleted}
          editTodo={editTodo}
        />
        {typeof tempTodo === 'string' && <TempTodo todoLabel={tempTodo} />}
        <Footer
          todos={todosFromServer}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          deleteAllCompleteTodo={deleteAllCompleteTodo}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage === '' ? 'hidden' : ''
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
