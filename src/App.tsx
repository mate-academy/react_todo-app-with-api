/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';
import cn from 'classnames';
import { ErrorTypes } from './types/ErrorTypes';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [listOfTodos, setListOfTodos] = useState<Todo[]>([]);
  const [selectedValue, setSelectedValue] = useState(Status.all);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);
  const [query, setQuery] = useState('');
  const [isResponding, setisResponding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setListOfTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.UnableToLoad);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const getFilteredTodos = listOfTodos.filter(todo => {
    switch (selectedValue) {
      case Status.active:
        return !todo.completed;
      case Status.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setErrorMessage(null);
    setTempTodo({ id: 0, userId, title, completed });
    setisResponding(true);

    return todoService
      .addTodo({ userId, title, completed })
      .then(newTodo => {
        setListOfTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(err => {
        setErrorMessage(ErrorTypes.UnableToAdd);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        throw err;
      })
      .finally(() => {
        setisResponding(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (id: number) => {
    setisResponding(true);
    setLoadingTodoId(carrent => [...carrent, id]);
    todoService
      .deleteTodo(id)
      .then(() => {
        setListOfTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== id),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.UnableToDelete);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setisResponding(false);
        setLoadingTodoId([]);
      });
  };

  const updateTodo = (todo: Todo) => {
    setLoadingTodoId(carrent => [...carrent, todo.id]);

    todoService
      .updateTodo(todo)
      .then(todoFromServer => {
        setListOfTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todoFromServer.id ? todoFromServer : currentTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.UnableToUpdate);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setLoadingTodoId([]);
      });
  };

  const updateToggle = (toggleTodo: Todo) => {
    setLoadingTodoId(current => [...current, toggleTodo.id]);

    todoService
      .updateTodo({ ...toggleTodo, completed: !toggleTodo.completed })
      .then(updatedTodo => {
        setListOfTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => setErrorMessage(ErrorTypes.UnableToUpdate))
      .finally(() => {
        setLoadingTodoId([]);
      });
  };

  const completedTodos = listOfTodos.filter(todo => todo.completed);
  // const activeTodos = listOfTodos.filter(todo => !todo.completed);
  const todosLeft = listOfTodos.length - completedTodos.length;
  const allCompleted = listOfTodos.every(todo => todo.completed);

  const deleteAllCompleted = () => {
    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  const updateAllToggle = () => {
    setListOfTodos(currentTodos => {
      if (allCompleted) {
        return currentTodos.map(todo => ({ ...todo, completed: false }));
      } else {
        return currentTodos.map(todo =>
          !todo.completed ? { ...todo, completed: true } : todo,
        );
      }
    });
  };

  return (
    <section className="section container">
      <p className="title is-4">
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header
              setQuery={setQuery}
              title={query}
              addTodo={addTodo}
              setErrorMessage={setErrorMessage}
              isResponding={isResponding}
              allCompleted={allCompleted}
              updateAllToggle={updateAllToggle}
            />

            {!!listOfTodos.length && (
              <TodoList
                mainTodoList={getFilteredTodos}
                updateToggle={updateToggle}
                deleteTodo={deleteTodo}
                tempTodo={tempTodo}
                loadingTodoId={loadingTodoId}
                updateTodo={updateTodo}
              />
            )}

            {!!listOfTodos.length && (
              <Footer
                todosLeft={todosLeft}
                setSelectedValue={setSelectedValue}
                selectedValue={selectedValue}
                completedTodos={completedTodos}
                deleteAllCompleted={deleteAllCompleted}
              />
            )}
          </div>

          {/* DON'T use conditional rendering to hide the notification */}
          {/* Add the 'hidden' class to hide the message smoothly */}
          <div
            data-cy="ErrorNotification"
            className={cn(
              'notification is-danger is-light has-text-weight-normal',
              { hidden: !errorMessage },
            )}
          >
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={() => setErrorMessage(null)}
            />
            {errorMessage}
          </div>
        </div>
        <br />
        <a href="https://github.com/mate-academy/react_todo-app-add-and-delete#react-todo-app-add-and-delete">
          React Todo App - Add and Delete
        </a>
      </p>

      <p className="subtitle">Styles are already copied</p>
    </section>
  );
};
