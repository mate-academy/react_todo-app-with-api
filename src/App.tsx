/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import {
  getTodos,
  deleteTodo,
  patchTodo,
  patchTitleTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { SortType } from './types/filterBy';
import { NewTodoField } from './components/NewTodoField';
import { AuthContext } from './components/Auth/AuthContext';
import { ActiveTodos } from './components/ActiveTodos';

function filterTodos(
  todos: Todo[],
  sortType: SortType,
) {
  const visibleTodos = [...todos];

  switch (sortType) {
    case SortType.Active:
      return visibleTodos.filter(todo => !todo.completed);

    case SortType.Completed:
      return visibleTodos.filter(todo => todo.completed);
    default:
      return visibleTodos;
  }
}

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.All);
  const [selectedLink, setSelectedLink] = useState<string>('All');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeItems, setActiveItems] = useState<number>(0);
  const [visibleLoader, setVisibleLoader] = useState(false);
  const [newTodoId, setNewTodoId] = useState(0);

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  useEffect(() => {
    getTodos(userId)
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setActiveItems((prevItems) => {
          const tempTodos = [...todosFromServer];
          let tempItems = prevItems;

          tempTodos.forEach(todo => {
            if (!todo.completed) {
              tempItems += 1;
            }
          });

          setTodos(tempTodos);

          return tempItems;
        });
      })
      .catch(() => setErrorMessage('Unable to update todos'));
  }, []);

  const findById = (todo: Todo) => {
    const todoIndex = todos.findIndex(foundTodo => {
      return foundTodo.id === todo.id;
    });

    return todoIndex;
  };

  const todoDelete = (todo: Todo) => {
    setVisibleLoader(true);
    setNewTodoId(todo.id);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(
          todos.filter(userTodo => todo.id !== userTodo.id),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setNewTodoId(0);
        setVisibleLoader(false);
      });

    if (!todo.completed) {
      setActiveItems(prevItems => prevItems - 1);
    }
  };

  const deleteCompletedTodos = () => {
    const filteredTodos = todos.filter(todo => {
      if (todo.completed) {
        setVisibleLoader(true);
        setNewTodoId(todo.id);

        deleteTodo(todo.id)
          .then(() => {
            setVisibleLoader(false);
            setNewTodoId(0);
          });
      }

      return todo.completed === false;
    });

    setTodos(filteredTodos);
  };

  const activeItemsCounter = (todo: Todo) => {
    if (todo.completed) {
      setActiveItems(prevItems => prevItems - 1);
    } else {
      setActiveItems(prevItems => prevItems + 1);
    }
  };

  const updateCompleteTodo = (todo: Todo) => {
    setVisibleLoader(true);
    setNewTodoId(todo.id);

    patchTodo(todo.id, { completed: !todo.completed })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setVisibleLoader(false);
        setNewTodoId(0);
      });

    const newTodos = [...todos];

    const todoIndex = findById(todo);

    newTodos[todoIndex].completed = !todo.completed;

    setTodos(newTodos);

    activeItemsCounter(todo);
  };

  const updateAllCompleteTodos = () => {
    const temp = [...todos];
    const isCompleted = temp.find(todo => {
      return todo.completed === false;
    });

    if (isCompleted) {
      temp.forEach(todo => {
        setVisibleLoader(true);

        if (!todo.completed) {
          patchTodo(todo.id, { completed: !todo.completed })
            .catch(() => setErrorMessage('Unable to update a todo'))
            .finally(() => {
              setVisibleLoader(false);
            });

          const todoIndex = findById(todo);

          todos[todoIndex].completed = !todo.completed;
          activeItemsCounter(todo);
        }
      });
    } else {
      temp.forEach(todo => {
        setVisibleLoader(true);

        if (todo.completed) {
          patchTodo(todo.id, { completed: !todo.completed })
            .catch(() => setErrorMessage('Unable to update a todo'))
            .finally(() => {
              setVisibleLoader(false);
            });

          const todoIndex = findById(todo);

          todos[todoIndex].completed = !todo.completed;

          activeItemsCounter(todo);
        }
      });
    }

    setTodos(temp);
  };

  const updateTodoTitle = (todo: Todo, title: string) => {
    if (title !== todo.title) {
      setVisibleLoader(true);
      setNewTodoId(todo.id);

      patchTitleTodo(todo.id, { title })
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => {
          setVisibleLoader(false);
          setNewTodoId(0);
        });

      const tempTodos = [...todos];

      const todoIndex = findById(todo);

      tempTodos[todoIndex].title = title;

      setTodos(tempTodos);
    }
  };

  const visibleTodos = filterTodos(todos, sortType);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {
            todos.length > 0 && (
              <button
                data-cy="ToggleAllButton"
                type="button"
                className="todoapp__toggle-all active"
                onClick={updateAllCompleteTodos}
              />
            )
          }

          <NewTodoField
            setErrorMessage={setErrorMessage}
            setVisibleLoader={setVisibleLoader}
            visibleLoader={visibleLoader}
            setTodos={setTodos}
            todos={todos}
            setActiveItems={setActiveItems}
            activeItems={activeItems}
          />
        </header>

        {todos && (
          <>
            <TodoList
              todos={visibleTodos}
              todoDelete={todoDelete}
              visibleLoader={visibleLoader}
              updateCompleteTodo={updateCompleteTodo}
              updateTodoTitle={updateTodoTitle}
              newTodoId={newTodoId}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <ActiveTodos activeItems={activeItems} />

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames(
                    'filter__link',
                    { selected: selectedLink === 'All' },
                  )}
                  onClick={() => {
                    setSortType(SortType.All);
                    setSelectedLink('All');
                  }}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames(
                    'filter__link',
                    { selected: selectedLink === 'Active' },
                  )}
                  onClick={() => {
                    setSortType(SortType.Active);
                    setSelectedLink('Active');
                  }}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames(
                    'filter__link',
                    { selected: selectedLink === 'Completed' },
                  )}
                  onClick={() => {
                    setSortType(SortType.Completed);
                    setSelectedLink('Completed');
                  }}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={deleteCompletedTodos}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
