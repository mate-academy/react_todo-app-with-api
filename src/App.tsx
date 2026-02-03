import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  USER_ID,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import classNames from 'classnames';

type TodoWithTemp = Todo & { temp?: boolean };

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoWithTemp[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<string | undefined>('all');

  const [disable, setDisable] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [pendingList, setPendingList] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  function inputFocus() {
    inputRef.current?.focus();
  }

  useEffect(() => {
    if (!disable) {
      inputFocus();
    }
  }, [disable]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(er => {
        setError(true);
        setErrorMessage('Unable to load todos');

        throw er;
      });
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') {
      return todo;
    } else if (filter === 'completed') {
      return todo.completed === true;
    } else if (filter === 'active') {
      return todo.completed === false;
    }
  });

  const todosForFooter = todos.filter(todo => !todo.temp);

  const handleAddTodo = (title: string) => {
    const normalizedTitle = title.trim();
    const tempId = Date.now();

    setError(false);
    setErrorMessage('');

    if (normalizedTitle === '') {
      setError(true);
      setErrorMessage('Title should not be empty');
      inputFocus();

      return;
    }

    const tempTodo: TodoWithTemp = {
      id: tempId,
      userId: USER_ID,
      completed: false,
      title: normalizedTitle,
      temp: true,
    };

    setDisable(true);
    setPendingList(prevList => [...prevList, tempId]);

    setTodos(prevTodos => [...prevTodos, tempTodo]);

    addTodo({
      userId: USER_ID,
      completed: false,
      title: normalizedTitle,
    })
      .then(createdTodo => {
        setTodos(prevTodos => {
          const withoutTemp = prevTodos.filter(item => item.id !== tempId);

          return [...withoutTemp, createdTodo];
        });
        setInputValue('');
      })
      .catch(er => {
        setTodos(prevTodos => prevTodos.filter(item => item.id !== tempId));
        setError(true);
        setErrorMessage('Unable to add a todo');

        throw er;
      })
      .finally(() => {
        setDisable(false);
        setPendingList(prevList => prevList.filter(item => item !== tempId));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setPendingList(prevList => [...prevList, todoId]);
    setError(false);
    setErrorMessage('');

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevState => prevState.filter(todo => todo.id !== todoId));

        return true;
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to delete a todo');

        return false;
      })
      .finally(() => {
        setPendingList(prevList => prevList.filter(item => item !== todoId));
        inputFocus();
      });
  };

  const handleStatusUpdate = (todoId: number, nextCompleted?: boolean) => {
    setPendingList(prevList => [...prevList, todoId]);
    setError(false);
    setErrorMessage('');

    const currentTodo = todos.find(todo => todo.id === todoId);

    if (!currentTodo) {
      setPendingList(prevList => prevList.filter(item => item !== todoId));

      return;
    }

    const updatedCompleted =
      typeof nextCompleted === 'boolean'
        ? nextCompleted
        : !currentTodo.completed;

    updateTodo({ todoId, completed: updatedCompleted })
      .then(() => {
        setTodos((prevState: Todo[]) => {
          return prevState.map((todo: Todo) =>
            todo.id === todoId
              ? { ...todo, completed: updatedCompleted }
              : todo,
          );
        });
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setPendingList(prevList => prevList.filter(item => todoId !== item));
      });
  };

  const handleRenameTodo = (todoId: number, title: string) => {
    const normalizedTitle = title.trim();

    if (normalizedTitle === '') {
      return handleDeleteTodo(todoId);
    }

    setPendingList(prevList => [...prevList, todoId]);
    setError(false);
    setErrorMessage('');

    return updateTodo({ todoId, title: normalizedTitle })
      .then(() => {
        setTodos((prevState: Todo[]) => {
          return prevState.map((todo: Todo) =>
            todo.id === todoId ? { ...todo, title: normalizedTitle } : todo,
          );
        });

        return true;
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to update a todo');

        return false;
      })
      .finally(() => {
        setPendingList(prevList => prevList.filter(item => item !== todoId));
      });
  };

  const handleUpdateAllStatus = () => {
    const nextCompleted = !todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== nextCompleted,
    );

    todosToUpdate.forEach(todo => {
      handleStatusUpdate(todo.id, nextCompleted);
    });
  };

  const toggleAllButtonHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    handleUpdateAllStatus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames({
                'todoapp__toggle-all': true,
                active: todos.every(item => item.completed === true),
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAllButtonHandler}
            />
          )}

          <NewTodo
            ref={inputRef}
            newTodo={handleAddTodo}
            disable={disable}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          toggleStatus={handleStatusUpdate}
          deleteTodo={handleDeleteTodo}
          pendingList={pendingList}
          renameTodo={handleRenameTodo}
        />

        {todosForFooter.length > 0 && (
          <Footer
            data={todosForFooter}
            setFilter={setFilter}
            clearCompeleted={() => {
              setTodos((prevState: Todo[]) =>
                // need to rewrite to promise.all()
                prevState.map(item => {
                  if (item.completed === true) {
                    handleDeleteTodo(item.id);
                  }

                  return item;
                }),
              );
            }}
          />
        )}
      </div>

      <ErrorNotification
        status={error}
        statusMessage={errorMessage}
        setStatus={setError}
        setStatusMessage={setErrorMessage}
      />
    </div>
  );
};
