/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import {
  addTodo,
  updateTodo,
  deleteTodo,
  getTodos,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Status } from './types/Statuses';
import { ErrorNotification } from './components/ErrorNotification';
import { Errors } from './types/Errors';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11980;

const applyFilter = (todos: Todo[], filter: Status) => {
  const conditions = {
    [Status.All]: () => {
      return todos;
    },
    [Status.Active]: () => {
      return todos.filter(todo => !todo.completed);
    },
    [Status.Completed]: () => {
      return todos.filter(todo => todo.completed);
    },
  };

  return conditions[filter]();
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<Errors | ''>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [title, setTitle] = useState('');
  const [currentId, setCurrentId] = useState<number | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LoadError));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = applyFilter(todos, filter);

  const handleUpdateTodo = async (todo: Todo) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { id, completed, title } = todo;

    setCurrentId(id);

    await updateTodo({ id, completed: !completed, title })
      .then((updatedTodo: Todo) => {
        setTodos((currentTodos) => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(item => item.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage(Errors.UpdateTodoError))
      .finally(() => setCurrentId(null));
  };

  const handleAddTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setTitle(title);
    setIsDisabledInput(true);
    setTempTodo({ id: 0, ...newTodo });
    setCurrentId(0);

    await addTodo(newTodo)
      .then(todo => {
        setTodos((currentTodos) => [...currentTodos, todo]);
      })
      .catch(() => {
        setTitle(title);
        setErrorMessage(Errors.AddTodoError);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabledInput(false);
        setCurrentId(null);
      });
  };

  const handleDeleteTodo = (todo: Todo) => {
    setCurrentId(todo.id);
    setIsDisabledInput(true);

    deleteTodo(todo.id)
      .catch(() => setErrorMessage(Errors.DeleteTodoError))
      .finally(() => {
        setTodos(current => current.filter(item => item.id !== todo.id));
        setTempTodo(null);
        setCurrentId(null);
        setIsDisabledInput(false);
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.map(todo => handleDeleteTodo(todo));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          userId={USER_ID}
          title={title}
          setTodos={setTodos}
          setTitle={setTitle}
          handleUpdateTodo={handleUpdateTodo}
          handleAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          isDisabledInput={isDisabledInput}
        />
        <TodoList
          todos={filteredTodos}
          currentId={currentId}
          handleUpdateTodo={handleUpdateTodo}
          handleDeleteTodo={handleDeleteTodo}
        />
        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            currentId={currentId}
            handleDeleteTodo={handleDeleteTodo}
            handleUpdateTodo={handleUpdateTodo}
          />
        )}

        {todos[0] && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
