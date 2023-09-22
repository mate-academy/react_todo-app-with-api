/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import * as todoServise from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const USER_ID = 11092;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoStatus, setTodoStatus] = useState<Status>(Status.ALL);
  const [loadingTodoIds, setLoadingTodoIds] = useState([0]);

  useEffect(() => {
    todoServise.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setIsError(true);
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      const createdTodo = await todoServise.createTodo(newTodo);

      setTodos(currTodos => [...currTodos, createdTodo]);
    } catch {
      setIsError(true);
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, [USER_ID]);

  const deleteTodo = async (todoId: number) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);
    await todoServise.delTodos(todoId)
      .then(() => {
        setTodos(currTodo => currTodo.filter(todo => todo.id !== todoId));
      })
      .catch((err) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        throw err;
      });
  };

  const updateTodo = async (updatedTodo: Todo) => {
    try {
      setLoadingTodoIds(prevIds => [...prevIds, updatedTodo.id]);

      await todoServise.updateTodo(updatedTodo);
      setTodos(currTodos => {
        const updTodos = [...currTodos];
        const index = updTodos.findIndex(todo => todo.id === updatedTodo.id);

        updTodos.splice(index, 1, updatedTodo);

        return updTodos;
      });
    } catch {
      setIsError(true);
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodoIds([0]);
    }
  };

  const preparedTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (todoStatus) {
        case Status.ACTIVE:
          return !todo.completed;

        case Status.COMPLETED:
          return todo.completed;

        case Status.ALL:
        default:
          return true;
      }
    });
  }, [todoStatus, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          updateTodo={updateTodo}
        />

        <section className="todoapp__main">
          <TodoList
            preparedTodos={preparedTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo}
            updateTodo={updateTodo}
            loadingTodoIds={loadingTodoIds}
          />
        </section>

        {!!todos.length && (
          <Footer
            todos={todos}
            selectItem={todoStatus}
            setSelectItem={setTodoStatus}
            onDelete={deleteTodo}
          />
        )}
      </div>

      {isError && errorMessage && (
        <div
          className={classNames(
            'notification',
            'is-danger is-light',
            'has-text-weight-normal',
            { hidden: !isError },
          )}
        >
          <button
            type="button"
            className="delete"
            onClick={() => setIsError(false)}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
