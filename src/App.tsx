/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useMemo, useEffect, useCallback,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './component/Header/Header';
import { Footer } from './component/Footer/Footer';
import { TodoApp } from './component/TodoApp/TodoApp';
import {
  getTodos,
  deleteTodo,
  addTodo,
  patchTodo,
} from './api/todos';
import { NewTodo } from './types/NewTodo';
import { TodoFilter } from './types/TodoFilter';

const USER_ID = 10610;
const timeDelay = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredBy, setFilteredBy] = useState(TodoFilter.ALL);
  const [isError, setIsError] = useState('');
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [toggleAll] = useState(false);

  const getAllTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setIsError('Loading...');
      setTimeout(() => {
        setIsError('');
      }, timeDelay);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!query.trim()) {
      setIsError('Title can`t be empty');

      return;
    }

    const newTodo: NewTodo = {
      userId: USER_ID,
      completed: false,
      title: query,
    };

    try {
      setTempTodo({
        id: 0,
        ...newTodo,
      });
      setQuery('');

      await addTodo(USER_ID, newTodo);
      await getAllTodos();
    } catch (error) {
      setIsError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      await getAllTodos();
    } catch (error) {
      setIsError('Unable to delete a todo');
    }
  };

  const handleDeleteCompletedTodo = async () => {
    try {
      const completedTodos = todos.filter((todo) => todo.completed);
      const deletePromises = completedTodos.map((todo) => deleteTodo(todo.id));

      await Promise.all(deletePromises);
      await getAllTodos();
    } catch (error) {
      setIsError('Unable to delete completed todos');
    }
  };

  const handleUpdateTodoCompleted
  = async (todoId: number, completed: boolean) => {
    try {
      setTodos((prevTodos) => prevTodos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, completed };
        }

        return todo;
      }));
      await patchTodo(todoId, { completed });
    } catch (error) {
      setIsError('Unable to update a todo');
    }
  };

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const handleToggleAll = useCallback(async () => {
    try {
      await Promise.all(todos.map(todo => (
        handleUpdateTodoCompleted(todo.id, !isAllTodosCompleted)
      )));
      setTodos((prevTodos) => prevTodos.map((todo) => ({
        ...todo,
        completed: !isAllTodosCompleted,
      })));
    } catch {
      setIsError('Unable to update todos');
    }
  }, [todos, isAllTodosCompleted]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filteredBy) {
        case TodoFilter.ALL:
          return true;
        case TodoFilter.ACTIVE:
          return !todo.completed;
        case TodoFilter.COMPLETED:
          return todo.completed;
        default:
          return false;
      }
    });
  }, [todos, filteredBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={handleAddTodo}
          query={query}
          setQuery={setQuery}
          toggleAll={toggleAll}
          setToggleAll={handleToggleAll}
        />
        <TodoApp
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodo={handleDeleteTodo}
          updateTodoCompleted={handleUpdateTodoCompleted}

        />
        <Footer
          filteredBy={filteredBy}
          setFilteredBy={setFilteredBy}
          todos={filteredTodos}
          deleteCompletedTodo={handleDeleteCompletedTodo}
        />
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          type="button"
          className="delete"
        />
        {isError}
      </div>
    </div>
  );
};
