/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo, TodoInput } from './types/Todo';
import * as todosServers from '../src/utils/fetchClient';
import Footer from './commponents/Footer';
import Header from './commponents/Header';
import TodoList from './commponents/TodoList';
import ErrorMessage from './commponents/ErrorMessage';
import { ErrorMessages } from './enums/errors';

type Status = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  //  #region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  const [filterStatus, setFilterStatus] = useState<Status>('all');
  const [inputValue, setInputValue] = useState<string>('');

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [delitingTodos, setDelitingTodos] = useState<number[]>([]);
  //  #endregion

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // #region useEffects
  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
      setIsAdding(false);
    }
  }, [isAdding]);

  useEffect(() => {
    if (errorMessage) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const id = setTimeout(() => {
        setErrorMessage(ErrorMessages.None);
      }, 4000);

      timeoutRef.current = id;
    }
  }, [errorMessage]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.LoadTodos);
        // throw err;
      });
  }, []);
  //  #endregion

  // #region functions

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  async function updateTodo(
    updateTod: string,
    postId: number,
  ): Promise<boolean> {
    try {
      setSelectedId(postId);

      const todo = await todosServers.client.patch<Todo>(`/todos/${postId}`, {
        title: updateTod,
      });

      setTodos(currentTodos => {
        setErrorMessage(ErrorMessages.None);
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(tod => tod.id === postId);

        newTodos.splice(index, 1, todo);

        return newTodos;
      });

      return true;
    } catch {
      setErrorMessage(ErrorMessages.UpdateTodos);

      return false;
    } finally {
      setSelectedId(null);
    }
  }

  async function handelResetallCompleted() {
    const allTodosCompleted = todos.every(tod => tod.completed);
    const oldTodos = [...todos];
    let nextCompletedValue = false;

    if (!allTodosCompleted) {
      nextCompletedValue = true;
      setTodos(todos.map(todo => ({ ...todo, completed: true })));
    } else {
      nextCompletedValue = false;
      setTodos(todos.map(todo => ({ ...todo, completed: false })));
    }

    const onlyTodosForChangingOnServer = todos.filter(
      todo => todo.completed !== nextCompletedValue,
    );

    try {
      await Promise.all(
        onlyTodosForChangingOnServer.map(todo =>
          todosServers.client.patch<Todo>(`/todos/${todo.id}`, {
            completed: nextCompletedValue,
          }),
        ),
      );
    } catch {
      setErrorMessage(ErrorMessages.UpdateTodos);
      setTodos(oldTodos);
    }
  }

  function handleSubmitForm(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setIsDisabled(true);

    if (inputValue.trim().length < 1) {
      setErrorMessage(ErrorMessages.EmptyTitle);
      setIsDisabled(false);

      return;
    }

    const todo: TodoInput = {
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    const tempTod: Todo = {
      ...todo,
      id: 0,
    };

    setTempTodo(tempTod);
    // setIsProcessed(true);

    todosServers.client
      .post('/todos', todo)
      .then(newPost => {
        setTodos(currentTodos => [...currentTodos, newPost as Todo]);
        setErrorMessage(ErrorMessages.None);
        setInputValue('');
        setIsAdding(true);
        setIsDisabled(false);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.AddTodos);
        setTempTodo(null);
        setIsDisabled(false);
        setIsAdding(true);
      });
  }

  function filterTodos(status: Status) {
    return todos.filter(todo => {
      if (todo.id === selectedId) {
        return true;
      }

      if (status === 'active') {
        return !todo.completed;
      } else if (status === 'completed') {
        return todo.completed;
      }

      return true;
    });
  }

  const visibleTodos = filterTodos(filterStatus);

  async function deleteTodo(postId: number): Promise<boolean> {
    try {
      setSelectedId(postId);

      await todosServers.client.delete(`/todos/${postId}`);

      // eslint-disable-next-line @typescript-eslint/no-shadow
      setTodos(todos => todos.filter(post => post.id !== postId));
      setSelectedId(null);
      setIsAdding(true);

      return true;
    } catch {
      setErrorMessage(ErrorMessages.DeleteTodo);
      setSelectedId(null);
      setIsAdding(true);

      return false;
    }
  }

  async function handleUpdateTodo(
    todoId: number,
    oldTitle: string,
    newTitle: string,
  ): Promise<boolean> {
    const updatingTodo = newTitle.trim();

    if (updatingTodo.length === 0) {
      return deleteTodo(todoId);
    }

    if (updatingTodo === oldTitle) {
      return true;
    }

    return updateTodo(updatingTodo, todoId);
  }

  function handleCheckedId(id: number) {
    setSelectedId(id);
    const oldCompletedTodo: boolean = todos.find(
      tod => tod.id === id,
    )!.completed;

    setTodos(prevTodos =>
      prevTodos.map(prev => {
        if (prev.id === id) {
          return { ...prev, completed: !prev.completed };
        }

        return prev;
      }),
    );
    todosServers.client
      .patch(`/todos/${id}`, {
        completed: !oldCompletedTodo,
      })
      .catch(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => {
            if (todo.id === id) {
              return { ...todo, completed: oldCompletedTodo };
            }

            return todo;
          }),
        );
        setErrorMessage(ErrorMessages.UpdateTodos);
      })
      .finally(() => {
        setSelectedId(null);
      });
  }

  function handleClearComleated() {
    const allDelitingTodos = todos
      .filter(tod => tod.completed)
      .map(tod => tod.id);

    setDelitingTodos(allDelitingTodos);

    todos.forEach(tod => {
      if (tod.completed) {
        deleteTodo(tod.id);
      }
    });
  }
  //  #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleInput={handleInput}
          handleSubmitForm={handleSubmitForm}
          inputValue={inputValue}
          isDisabled={isDisabled}
          inputREf={inputRef}
          handelResetallCompleted={handelResetallCompleted}
        />

        <TodoList
          deleteTodo={deleteTodo}
          handleCheckedId={handleCheckedId}
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          selectedId={selectedId}
          updateTodo={updateTodo}
          handleUpdateTodo={handleUpdateTodo}
          delitingTodos={delitingTodos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            handleClearComleated={handleClearComleated}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};
