/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useState } from 'react';

import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todosService from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

const USER_ID = 85;

function getTodosFilterByStatus(todos: Todo[], sortField: string) {
  const copyTodos = [...todos];

  if (sortField === 'All') {
    return copyTodos;
  }

  if (sortField === 'Active') {
    return copyTodos.filter(todo => todo.completed === false);
  }

  if (sortField === 'Completed') {
    return copyTodos.filter(todo => todo.completed === true);
  }

  return copyTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputTitle, setInputTitle] = useState('');

  const [loading, setLoading] = useState(false);

  const [errorLoad, setErrorLoad] = useState('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [sortField, setSortField] = useState('All');

  const [toggleLoad, setToggleLoad] = useState({ isLoading: false, id: 0 });
  const [toggleAllLoad, setToggleAllLoad] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  const filterTodos = getTodosFilterByStatus(
    todos, sortField,
  );

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then((todosFromServer) => {
        setTodos(todosFromServer);
      })

      .catch(() => {
        setErrorLoad('Unable to load todos');
        setTimeout(() => {
          setErrorLoad('');
        }, 3000);
      });
  }, []);

  const addTodo = ({
    title, completed, userId,
  }: Omit<Todo, 'id'>) => {
    setTempTodo({
      title, completed, userId, id: 0,
    });

    return todosService.createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setLoading(false);
        setTempTodo(null);
        setInputTitle('');
      })
      .catch((error) => {
        setErrorLoad('Unable to add a todo');
        setLoading(false);
        setTempTodo(null);
        setTimeout(() => {
          setErrorLoad('');
        }, 3000);
        throw new Error(error);
      });
  };

  const deleteTodo = (id:number) => {
    setToggleLoad({ isLoading: true, id });
    todosService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(
          todo => todo.id !== id,
        ));
        setToggleLoad({ isLoading: false, id });
      })
      .catch(() => {
        setErrorLoad('Unable to delete a todo');
        setTimeout(() => {
          setErrorLoad('');
        }, 3000);
        setToggleLoad({ isLoading: false, id });
      });
  };

  const completedTodos = todos.filter(todo => todo.completed === true);

  const clearCompletedTodos = () => {
    completedTodos.forEach(
      todo => deleteTodo(todo.id),
    );
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputTitle.trim().length !== 0) {
      setLoading(true);

      return addTodo({
        title: inputTitle.trim(),
        completed: false,
        userId: USER_ID,
      });
    }

    setErrorLoad('Title should not be empty');
    setTimeout(() => {
      setErrorLoad('');
    }, 3000);
  };

  const toggleCheckBox = (todoId:number, completed: boolean) => {
    setToggleLoad({ isLoading: true, id: todoId });
    todosService.updateTodo({ id: todoId, completed: !completed })
      .then(() => {
        setTodos(currentTodos => currentTodos.map(todo => {
          if (todoId === todo.id) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        }));
        setToggleLoad({ isLoading: false, id: todoId });
      })
      .catch(() => {
        setErrorLoad('Unable to update a todo');
        setTimeout(() => {
          setErrorLoad('');
        }, 3000);
        setToggleLoad({ isLoading: false, id: todoId });
      });
  };

  const allDone = todos.every(todo => todo.completed === true);

  const toggleAllButton = () => {
    setToggleAllLoad(true);
    const preparedTodos = allDone
      ? [...todos] : todos.filter(todo => todo.completed !== true);

    preparedTodos.map(
      todo1 => todosService.updateTodo({
        id: todo1.id,
        completed: !todo1.completed,
      })
        .then(() => {
          setTodos(currentTodos => currentTodos.map(todo => ({
            ...todo, completed: !allDone,
          })));

          setToggleAllLoad(false);
        })
        .catch(() => {
          setErrorLoad('Unable to update a todo');
          setTimeout(() => {
            setErrorLoad('');
          }, 3000);
          setToggleAllLoad(false);
        }),
    );
  };

  const renameTodo = (todoToUpdate: Todo, newTitle:string) => {
    setToggleLoad({ isLoading: true, id: todoToUpdate.id });
    setErrorLoad('');
    // setLoadTodoId(todoToUpdate.id);

    return todosService.updateTodo({
      ...todoToUpdate,
      title: newTitle,
    })
      .then((updatedTodo) => {
        setTodos(
          current => current.map(todo => (
            todo.id === updatedTodo.id ? updatedTodo : todo
          )),
        );
        setToggleLoad({ isLoading: false, id: todoToUpdate.id });
      })
      .catch((error) => {
        setErrorLoad('Unable to update a todo');
        setTimeout(() => {
          setErrorLoad('');
        }, 3000);
        setToggleLoad({ isLoading: false, id: todoToUpdate.id });
        throw error;
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          title={inputTitle}
          setTitle={setInputTitle}
          loading={loading}
          todos={todos}
          toggleAllButton={toggleAllButton}
          allDone={allDone}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filterTodos}
            deleteTodo={deleteTodo}
            tempTodo={tempTodo}
            toggleCheckBox={toggleCheckBox}
            toggleLoad={toggleLoad}
            toggleAllLoad={toggleAllLoad}
            renameTodo={renameTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            clearCompletedTodos={clearCompletedTodos}
            setSortField={setSortField}
            sortField={sortField}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorLoad },
        )}
      >
        <button
          onClick={() => {
            setErrorLoad('');
          }}
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />
        {errorLoad}
      </div>
    </div>
  );
};
