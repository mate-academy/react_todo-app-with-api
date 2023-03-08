import React, { useState, useEffect, useRef } from 'react';
// import { AuthContext } from './components/Auth/AuthContext';
import { TodosList } from './components/TodosList';
import {
  getTodos, addTodo, removeTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Navigation } from './components/Navigation';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoStatus } from './types/TodoStatus';

const USER_ID = 5760;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  // const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [textField, setTextField] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDelete = (todoId: number) => {
    setTodos((prev: Todo[]) => prev.filter((todo) => todo.id !== todoId));
  };

  const handleUpdate = (todoToUpdate: Todo, title?: string) => {
    setTodos((prev: Todo[]) => prev.map(todo => {
      if (todo.id === todoToUpdate.id) {
        updateTodo(USER_ID, todoToUpdate, title);

        const requestBody = title
          ? { ...todo, title }
          : { ...todo, completed: !todo.completed };

        return requestBody;
      }

      return todo;
    }));
  };

  const submitAction = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    if (!textField.trim()) {
      setError(true);
      setMessageError("Title can't be empty");

      return;
    }

    setIsProcessing(true);

    try {
      setTempTodo({
        id: 0,
        title: textField,
        userId: USER_ID,
        completed: false,
      });

      const newTodo = await addTodo(USER_ID, {
        title: textField,
        userId: USER_ID,
        completed: false,
      });

      setTempTodo(null);
      setTodos((prev: any) => [...prev, newTodo]);
    } catch {
      setError(true);
      setMessageError('Unable to add todo');
    } finally {
      setIsProcessing(false);
      setTextField('');
    }
  };

  const toggleAllHandler = () => {
    const allCompeted = todos.every(item => item.completed);

    const updateTodoStatus = (state: boolean) => {
      const todosToUpdate
        = todos.filter(item => (state ? !item.completed : item.completed));

      setTodos((prev: Todo[]) => prev.map((todo: Todo) => {
        if (state ? !todo.completed : todo.completed) {
          return {
            ...todo,
            isFetching: true,
          };
        }

        return todo;
      }));

      const todoUpdateList = todosToUpdate.map(item => {
        return new Promise((resolve) => updateTodo(USER_ID, item)
          .then((res) => resolve(res)));
      });

      Promise.all([...todoUpdateList])
        .then(() => {
          getTodos(USER_ID).then((loadedTodos) => {
            setTodos((loadedTodos.map(todo => {
              return state ? todo : {
                ...todo,
                completed: false,
              };
            })));
          });
        });
    };

    if (!allCompeted) {
      updateTodoStatus(true);

      return;
    }

    updateTodoStatus(false);
  };

  /* eslint-disable react-hooks/rules-of-hooks */
  useEffect(() => {
    if (USER_ID) {
      getTodos(USER_ID)
        .then((loadedTodos) => {
          setTodos(loadedTodos);
        })
        .catch(() => {
          setError(true);
          setMessageError('Unable to fetch data');
        });
    }
  }, [USER_ID]);

  function filterStatus(value: TodoStatus) {
    switch (value) {
      case TodoStatus.All:
        return todos;

      case TodoStatus.Active:
        return todos.filter((todo: Todo) => !todo.completed);

      case TodoStatus.Completed:
        return todos.filter((todo: Todo) => todo.completed);

      default:
        throw Error('Specify your status');
    }
  }

  const updatedTodos = filterStatus(status);
  const completedTodos = todos.filter((todo: Todo) => todo.completed);
  const activeTodos = todos.filter((todo: Todo) => !todo.completed);

  const removeCompletedTodos = () => {
    completedTodos.forEach(async (todo: Todo) => {
      await removeTodo(todo.id);
    });

    setTodos((prev: Todo[]) => prev.filter(todo => !todo.completed));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            aria-label="Mark all as complete"
            onClick={toggleAllHandler}
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              disabled={isProcessing}
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={textField}
              onChange={(event) => setTextField(event.target.value)}
              onKeyDown={submitAction}
            />
          </form>
        </header>

        {!!todos.length && (
          <TodosList
            setOfItems={updatedTodos}
            deleteItem={handleDelete}
            tempTodo={tempTodo}
            setMessageError={setMessageError}
            setError={setError}
            isProcessing={isProcessing}
            handleUpdate={handleUpdate}
          />
        )}

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {activeTodos.length}
              {' '}
              items left
            </span>

            <Navigation
              changeStatus={setStatus}
              status={status}
            />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={removeCompletedTodos}
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      {!!error && (
        <ErrorNotification
          error={error}
          setError={setError}
          message={messageError}
          setMessage={setMessageError}
        />
      )}
    </div>
  );
};
