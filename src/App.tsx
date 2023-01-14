import React, {
  useContext, useEffect, useState,
} from 'react';

import classNames from 'classnames';

import {
  CustomTodo,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Filter } from './types/Filter';

import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import Form from './components/Form/Form';
import TodoList from './components/TodoList/TodoList';
import Warning from './components/Warning/Warning';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todosFromTheServer, setTodosFromTheServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [todosToShow, setTodosToShow] = useState(todosFromTheServer);
  const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [deletingCompleted, setDelitingCompleted] = useState(false);
  const [customTodo, setCustomTodo] = useState<CustomTodo | null>(null);

  const user = useContext(AuthContext);

  const areAllCompleted = todosFromTheServer.filter(
    todoFromServer => !todoFromServer.completed,
  ).length === 0;

  const filterTodos = (type: Filter) => {
    setCurrentFilter(type);
    switch (type) {
      case Filter.COMPLETED: {
        const completedTodos = todosFromTheServer.filter(
          todo => todo.completed,
        );

        setTodosToShow(completedTodos);
        break;
      }

      case Filter.ACTIVE: {
        const activeTodos = todosFromTheServer.filter(
          todo => !todo.completed,
        );

        setTodosToShow(activeTodos);
        break;
      }

      default: {
        setTodosToShow(todosFromTheServer);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
      .then(gotTodos => {
        setTodosFromTheServer(gotTodos);
        setTodosToShow([...gotTodos]);
      })
      .catch(() => {
        setErrorMessage('Unable to get todos');
        setErrorCount(prev => prev + 1);
      });
  }, [user]);

  useEffect(() => {
    filterTodos(currentFilter);
  }, [todosFromTheServer]);

  const onFormSubmit = (value: string) => {
    setIsAdding(true);

    if (value.trim().length === 0) {
      setErrorMessage("Title can't be empty");
      setErrorCount(prev => prev + 1);
      setIsAdding(false);

      return;
    }

    if (!user) {
      return;
    }

    const newTodo = {
      userId: user.id,
      title: value,
      completed: false,
    };

    setCustomTodo(newTodo);

    addTodo(newTodo).then((todo) => {
      setTodosFromTheServer(prevTodos => [...prevTodos, todo]);
    }).catch(() => {
      setErrorMessage('Unable to add todo');
      setErrorCount(prev => prev + 1);
    }).finally(() => {
      setIsAdding(false);
      setCustomTodo(null);
    });
  };

  const onDeleteTodo = (todoId: number) => {
    setIsChanging(true);
    deleteTodo(todoId)
      .then(() => {
        setTodosFromTheServer(
          prevTodos => prevTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete the todo');
        setErrorCount(prev => prev + 1);
      })
      .finally(() => {
        setIsChanging(false);
      });
  };

  const clearCompleted = () => {
    setDelitingCompleted(true);
    const completed = todosFromTheServer.filter(todo => todo.completed);

    Promise.all(completed.map(todo => deleteTodo(todo.id)))
      .then(() => setTodosFromTheServer(
        prev => prev.filter(todo => !todo.completed),
      )).catch(() => {
        setErrorMessage('Something went wrong deleting the todos');
        setErrorCount(prev => prev + 1);
      })
      .finally(() => setDelitingCompleted(false));
  };

  const toggleAll = () => {
    setIsToggling(true);
    let promiseArr;

    if (areAllCompleted) {
      promiseArr = todosFromTheServer.map(
        serverTodo => updateTodo(serverTodo.id, { completed: false }),
      );
    } else {
      promiseArr = todosFromTheServer
        .map(serverTodo => updateTodo(serverTodo.id, { completed: true }));
    }

    Promise.all(promiseArr)
      .then(() => {
        if (areAllCompleted) {
          setTodosFromTheServer(
            prev => prev.map(prevTodo => ({ ...prevTodo, completed: false })),
          );
        } else {
          setTodosFromTheServer(
            prev => prev.map(prevTodo => ({ ...prevTodo, completed: true })),
          );
        }
      })
      .catch(() => {
        setErrorMessage('Unable to toggle todos');
        setErrorCount(prev => prev + 1);
      })
      .finally(() => setIsToggling(false));
  };

  const onToggleStatus = (todo: Todo) => {
    setIsChanging(true);
    updateTodo(todo.id, { completed: !todo.completed })
      .then(() => {
        setTodosFromTheServer(prev => prev.map(prevTodo => {
          const newTodo = { ...prevTodo };

          if (prevTodo.id === todo.id) {
            newTodo.completed = !prevTodo.completed;
          }

          return newTodo;
        }));
      })
      .catch(() => {
        setErrorMessage('Unable to update the todo');
        setErrorCount(prev => prev + 1);
      })
      .finally(() => setIsChanging(false));
  };

  const onTitleChange = (todo: Todo, value: string) => {
    setIsChanging(true);
    updateTodo(todo.id, { title: value })
      .then(() => {
        setTodosFromTheServer(prev => prev.map(prevTodo => {
          const newTodo = { ...prevTodo };

          if (prevTodo.id === todo.id) {
            newTodo.title = value;
          }

          return newTodo;
        }));
      })
      .catch(() => {
        setErrorMessage('Unable to update the todo');
        setErrorCount(prev => prev + 1);
      })
      .finally(() => setIsChanging(false));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={
              classNames('todoapp__toggle-all', { active: areAllCompleted })
            }
            aria-label="Toggle all"
            onClick={toggleAll}
          />

          <Form onSubmit={onFormSubmit} isAdding={isAdding} />
        </header>

        {todosFromTheServer.length > 0 && (
          <>
            <TodoList
              todos={todosToShow}
              customTodo={customTodo}
              onDeleteTodo={onDeleteTodo}
              deletingCompleted={deletingCompleted}
              onToggleStatus={onToggleStatus}
              isChanging={isChanging}
              isToggling={isToggling}
              onTitleChange={onTitleChange}
            />

            <Footer
              left={todosFromTheServer.filter(todo => !todo.completed).length}
              completed={
                todosFromTheServer.filter(todo => todo.completed).length
              }
              onFilter={filterTodos}
              onClearCompleted={clearCompleted}
              currentFilter={currentFilter}
            />
          </>
        )}
      </div>

      <Warning message={errorMessage} errorCount={errorCount} />
    </div>
  );
};
