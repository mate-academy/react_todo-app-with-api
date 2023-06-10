/* eslint-disable no-console */
import classNames from 'classnames';
import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import { Todo } from './Types';
import { UserWarning } from './UserWarning';
import { getTodos } from './todos';
import { client } from './utils/client';
import { Error } from './components/errorMessages';

const USER_ID = 10377;

function getRandomNumber(): number {
  return Math.floor(Math.random() * 1001);
}

enum SortType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [selectedTab, setSelectedTab] = useState(SortType.All);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThereActiveTodo, setIsThereActiveTodo] = useState(false);
  const [isThereCompletedTodos, setIsThereCompletedTodos] = useState(false);
  const [isUpdating, setIsUpdating] = useState(true);
  const [isAddingTodoAllowed, setIsAddingTodoAllowed] = useState(false);
  const [isDeleteingTodoAllowed, setIsDeleteingTodoAllowed] = useState(false);
  const [isEditingTodoAllowed, setIsEditingTodoAllowed] = useState(false);
  const [isHidden, setIsHidden] = useState('');
  const [placeHolderText, setPlaceHolderText] = useState('');
  const [isDoubledClickedName, setIsDoubledClcikedName] = useState('');
  const [isThereIssue, setIsThereIssue] = useState(false);
  const [numberOfActiveTodos, setNumberOfActivTodos] = useState(0);
  const [errorMessageField, setErrorMessageField] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [editTodo, setEditTodo] = useState('');
  const [tempTodo, settempTodo] = useState({
    title: '',
    userId: USER_ID,
    completed: false,
    id: getRandomNumber(),
  });
  const excludedInputRef = useRef<HTMLInputElement>(null);
  let timeoutId: NodeJS.Timeout;

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await getTodos(USER_ID);

      setTodo(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Unable to add a todo');
      setIsHidden('Unable to add a todo');
      setIsThereIssue(true);
      timeoutId = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const updatetempTodo = (value: string) => {
    setInputValue(value);

    settempTodo({
      ...tempTodo,
      title: inputValue,
      id: getRandomNumber(),
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() !== '') {
      const tempTodoItem: Todo = {
        title: inputValue,
        userId: USER_ID,
        completed: false,
        id: getRandomNumber(),
      };

      try {
        await client.post('/todos', tempTodoItem);
        setTodo((prevTodo) => [...prevTodo, tempTodoItem]);
        setIsLoading(false);
      } catch (error) {
        console.log('There is an error', error);
      }
    } else {
      setErrorMessageField(true);
    }

    setInputValue('');
  };

  const deleteTodo = async (id: number) => {
    const tempTodos = todo.filter((element) => {
      return element.id !== id;
    });

    setTodo(tempTodos);

    try {
      await client.delete(`/todos/${id}`);
    } catch (error) {
      console.log('There is an issue.', error);
      setDeleteErrorMessage('Unable to delete a todo');
    }
  };

  const togleAllTodo = async () => {
    const updatedTodos = todo.map((element) => {
      return {
        ...element,
        completed: !element.completed,
      };
    });

    setTodo(updatedTodos);

    try {
      setIsLoading(true);

      await Promise.all(
        updatedTodos.map(async (todoItem) => {
          await client.patch(`/todos/${todoItem.id}`, {
            ...todoItem,
            completed: todoItem.completed,
          });
        }),
      );

      setIsLoading(false);

      setIsUpdating(false);
    } catch (error) {
      console.log('Unable to update a todo');
      setIsHidden('Unable to update a todo');
      setIsThereIssue(true);
      timeoutId = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
    }
  };

  const updateIndividualTodo = async (id: number) => {
    setUpdatingTodoId(id);
    const updatedTodo = todo.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          completed: !obj.completed,
        };
      }

      return obj;
    });

    const none = todo.some((element) => {
      return element.id === id;
    });

    if (!none) {
      setIsEditingTodoAllowed(true);
      setErrorMessageField(true);
      setEditTodo('Unable to update a todo');
      setIsThereIssue(true);
    }

    setTodo(updatedTodo);

    try {
      const todoToUpdate = todo.find((elem) => elem.id === id);

      if (todoToUpdate) {
        setIsLoading(true);

        await client.patch(`/todos/${id}`, {
          completed: !todoToUpdate.completed,
          title: todoToUpdate.title,
          userId: USER_ID,
          id,
        });

        setIsLoading(false);
        setUpdatingTodoId(null);
      }
    } catch (error) {
      console.log('Unable to update a todo');
      setIsHidden('Unable to update a todo');
      setIsThereIssue(true);
      timeoutId = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
    }
  };

  const deleteCompletedTodos = async () => {
    const completedTodoIds = todo
      .filter((element) => element.completed)
      .map((element) => element.id);

    try {
      await Promise.all(
        completedTodoIds.map((id) => client.delete(`/todos/${id}`)),
      );

      setTodo((prevTodo) => prevTodo.filter((element) => !element.completed));
    } catch (error) {
      console.log('There is an issue deleting completed todos.', error);
      setDeleteErrorMessage('Unable to delete completed todos');
    }
  };

  const handleTodoUpdate
  = async (id: number, newTitle: string) => {
    const updatedTodo = todo.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          title: newTitle,
        };
      }

      return obj;
    });

    setTodo(updatedTodo);
    try {
      const todoToUpdate = todo.find((elem) => elem.id === id);

      if (todoToUpdate) {
        await client.patch(`/todos/${id}`, {
          ...todoToUpdate,
          title: newTitle,
        });
        setIsUpdating(false);
      }
    } catch (error) {
      console.log('There is an issue updating the todo title.', error);
    }
  };

  useEffect(() => {
    fetchTodos();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const isActive = todo.some((obj) => obj.completed === false);
    const isFalse = todo.some((obj) => obj.completed === true);
    const todoLength = todo.filter((obj) => {
      return obj.completed === false;
    });

    setIsThereActiveTodo(isActive);
    setIsThereCompletedTodos(isFalse);
    setNumberOfActivTodos(todoLength.length);
  }, [todo]);

  const visibleTodos: Todo[] = useMemo(() => todo.filter((element) => {
    switch (selectedTab) {
      case SortType.Completed:
        return element.completed;
      case SortType.Active:
        return !element.completed;
      case SortType.All:
        return todo;
      default:
        return todo;
    }
  }), [todo, selectedTab]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            <label htmlFor="nameInput">
              <button
                id="nameInput"
                type="button"
                className={classNames('todoapp__toggle-all', {
                  active: isThereActiveTodo,
                })}
                onClick={togleAllTodo}
              >
                {null}
              </button>
            </label>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={inputValue}
                onChange={(event) => {
                  updatetempTodo(event.target.value);
                }}
              />
            </form>
          </header>
          <section className="todoapp__main">
            {todo.length !== 0 && (
              <>
                {visibleTodos.map((task) => {
                  if (isLoading && updatingTodoId === task.id) {
                    return <div className="loader" key={task.id} />;
                  }

                  return (
                    <div
                      className={classNames('todo', {
                        completed: task.completed,
                      })}
                      key={task.id}
                    >
                      <label className="todo__status-label" key={task.id}>
                        <input
                          type="checkbox"
                          className="todo__status todo__title-field"
                          value={tempTodo.title}
                          checked={task.completed}
                          onChange={() => {
                            updateIndividualTodo(task.id);
                          }}
                        />
                      </label>
                      {isDoubledClickedName === task.title
                        ? (
                          <label>
                            <input
                              type="text"
                              className="todo__edit-field todo__title"
                              value={placeHolderText}
                              onChange={(event) => {
                                setPlaceHolderText(event.target.value);
                              }}
                              onBlur={(event) => {
                                handleTodoUpdate(
                                  task.id,
                                  event.target.value,
                                );
                              }}
                              ref={excludedInputRef}
                            />
                          </label>
                        ) : (
                          <span
                            className={isUpdating
                              ? 'onchange todo__title'
                              : 'todo__title'}
                            onDoubleClick={() => {
                              setPlaceHolderText(task.title);
                              setIsDoubledClcikedName(task.title);
                            }}
                          >
                            {task.title}
                          </span>
                        )}
                      {isDoubledClickedName !== task.title && (
                        <button
                          type="button"
                          className="todo__remove"
                          onClick={() => deleteTodo(task.id)}
                        >
                          ×
                        </button>
                      )}
                      <div className="modal overlay">
                        <div
                          className="modal-background
                             has-background-white-ter"
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}

          </section>

          {todo.length > 0 && (
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${numberOfActiveTodos} items left`}
              </span>

              <nav className="filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: selectedTab === 'All',
                  })}
                  onClick={() => setSelectedTab(SortType.All)}
                  role="button"
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: selectedTab === 'Active',
                  })}
                  onClick={() => setSelectedTab(SortType.Active)}
                  role="button"
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: selectedTab === 'Completed',
                  })}
                  onClick={() => setSelectedTab(SortType.Completed)}
                  role="button"
                >
                  Completed
                </a>
              </nav>

              {isThereCompletedTodos ? (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={deleteCompletedTodos}
                >
                  Clear completed
                </button>
              ) : <div className="todoapp__filler-div" />}
            </footer>
          )}

        </div>

        <Error
          message={isHidden}
          deleteErrorMessage={deleteErrorMessage}
          isThereIssue={isThereIssue}
          editTodo={editTodo}
          setIsThereIssue={setIsThereIssue}
        />

        {errorMessageField && (
          <div
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              type="button"
              className="delete"
              onClick={() => {
                setIsDeleteingTodoAllowed(false);
                setIsAddingTodoAllowed(false);
                setIsEditingTodoAllowed(false);
                setErrorMessageField(false);
              }}
            >
              {null}
            </button>

            {inputValue.trim().length === 0 && (
              'Title can\'t be empty'
            )}

            {isAddingTodoAllowed && (
              'Unable to add a todo'
            )}

            <br />
            {isDeleteingTodoAllowed && (
              'Unable to delete a todo'
            )}
            <br />
            {isEditingTodoAllowed && (
              'Unable to update a todo'
            )}
          </div>
        )}
      </div>
    </>
  );
};
