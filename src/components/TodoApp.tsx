/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  getTodos,
  deleteTodo,
  addTodo,
  updateTodo,
} from '../api/todos';
import { TodoType } from '../types/TodoType';
import Filter from './Filter';
import Todo from './Todo';
import { Status } from '../types/Status';

const USER_ID = 11554;

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [activeStatus, setActiveStatus] = useState<Status>(Status.All);
  const [toggleAll, setToggleAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [filteredTodos, setFilteredTodos] = useState(todos);

  const setTodoLoading = (id: number, isLoading: boolean) => {
    setLoading(prevLoadingTodos => {
      if (isLoading) {
        return [...prevLoadingTodos, id];
      }

      return prevLoadingTodos.filter(todoId => todoId !== id);
    });
  };

  const clearErrorButton = () => {
    setErrorMessage('');
  };

  const handleRequestError = (error: string) => {
    setErrorMessage(error);
    setTimeout(clearErrorButton, 3000);
  };

  useEffect(() => {
    if (USER_ID) {
      getTodos(USER_ID)
        .then((response) => {
          setTodos(response);
        })
        .catch((error) => {
          handleRequestError('Unable to load todos');
          // eslint-disable-next-line no-console
          console.error('Error fetching todos:', error);
        });
    }
  }, []);

  useEffect(() => {
    const allCompleted = todos.every(todo => todo.completed);

    setToggleAll(allCompleted);
  }, [todos]);

  const handleNewTitle = (id: number, newTitle?: string) => {
    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            title: newTitle !== undefined
              ? newTitle
              : todo.title,
          };
        }

        return todo;
      });
    });

    if (newTitle !== undefined) {
      updateTodo(id, { title: newTitle });
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const isAnyTodoCompleted = todos.some(todo => todo.completed);

  useEffect(() => {
    const filtered = todos.filter(todo => {
      switch (activeStatus) {
        case Status.Active:
          return !todo.completed;
        case Status.Completed:
          return todo.completed;
        default:
          return true;
      }
    });

    setFilteredTodos(filtered);
  }, [todos, activeStatus]);

  const handleFilterChange = (status: Status) => {
    setActiveStatus(status);
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const todosToDelete = completedTodos.map(todo => todo.id);

    setLoading([...loading, ...todosToDelete]);

    const deletedTodos: TodoType[] = [];

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)
      .then(() => {
        deletedTodos.push(todo);
        setLoading(prevLoadingTodos => prevLoadingTodos
          .filter(id => id !== todo.id));
      })
      .catch(error => {
        handleRequestError('Unable to delete a todo');
        // eslint-disable-next-line no-console
        console.error('Error deleting todo:', error);
        setLoading(prevLoadingTodos => prevLoadingTodos
          .filter(id => id !== todo.id));
      })))
      .then(() => {
        const updatedTodos = todos.filter(todo => !deletedTodos.includes(todo));

        setTodos(updatedTodos);
      })
      .catch(error => {
        handleRequestError('Unable to delete a todo');
        // eslint-disable-next-line no-console
        console.error('Error clearing completed todos:', error);
      });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') {
      handleRequestError('Title should not be empty');

      return;
    }

    if (newTodo.trim() !== '') {
      const todoToAdd = {
        title: newTodo.trim(),
        completed: false,
        userId: USER_ID,
      };

      const tempTodoData = {
        id: 0,
        title: newTodo.trim(),
        completed: false,
        userId: USER_ID,
      };

      setTempTodo(tempTodoData);
      setIsAddingTodo(true);

      addTodo(todoToAdd)
        .then(responseTodo => {
          const updatedTodos = [...todos, responseTodo];

          setTodos(updatedTodos);
          setNewTodo('');
          setTempTodo(null);
          setIsAddingTodo(false);
        })
        .catch(error => {
          handleRequestError('Unable to add a todo');
          setTempTodo(null);
          setIsAddingTodo(false);

          // eslint-disable-next-line no-console
          console.error('Error adding todo:', error);
        });
    }
  };

  const handleToggle = (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (todoToUpdate) {
      setTodoLoading(id, true);
      const newCompletedStatus = !todoToUpdate.completed;

      updateTodo(id, { completed: newCompletedStatus })
        .then(updatedTodo => {
          // eslint-disable-next-line no-console
          console.log('updatedTodo', updatedTodo);
          const updatedTodos = todos.map(todo => {
            if (todo.id === updatedTodo?.id) {
              const newTog = { ...todo };

              newTog.completed = newCompletedStatus;

              return newTog;
            }

            return todo;
          });

          setTodoLoading(id, false);
          setTodos(updatedTodos);
        })
        .catch(error => {
          handleRequestError('Unable to update a todo');
          setTodoLoading(id, false);
          // eslint-disable-next-line no-console
          console.error('Error toggling todo completion status:', error);
        });
    }
  };

  const toggleAllTodosCompleteState = () => {
    const notCompletedTodos = todos.filter(todo => !todo.completed);

    const allCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: notCompletedTodos.length > 0,
    }));

    if (allCompleted) {
      Promise.all(todos.map(
        todo => updateTodo(todo.id, { completed: !todo.completed }),
      ))
        .then(() => {
          setTodos(updatedTodos);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Error toggling all todo completion status:', error);
        });
    } else {
      Promise.all(notCompletedTodos.map(
        todo => updateTodo(todo.id, { completed: !todo.completed }),
      ))
        .then(() => {
          setTodos(updatedTodos);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Error toggling all todo completion status:', error);
        });
    }
  };

  const handleDelete = (id: number) => {
    setTodoLoading(id, true);

    deleteTodo(id)
      .then(() => {
        const updatedTodos = todos.filter(todo => todo.id !== id);

        setTodoLoading(id, false);
        setTodos(updatedTodos);
      })
      .catch(error => {
        handleRequestError('Unable to delete a todo');
        setTodoLoading(id, false);
        // eslint-disable-next-line no-console
        console.error('Error deleting todo:', error);
      });
  };

  const newTodoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoRef.current) {
      newTodoRef.current.focus();
    }
  }, [isAddingTodo, handleDelete, handleToggle]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all',
                { active: toggleAll })}
              data-cy="ToggleAllButton"
              onClick={toggleAllTodosCompleteState}
            />
          )}

          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              disabled={isAddingTodo}
              ref={newTodoRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map((todo) => (
              <Todo
                loading={loading.includes(todo.id)}
                setTodoLoading={setTodoLoading}
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                handleNewTitle={handleNewTitle}
                handleRequestError={handleRequestError}
              />
            ))}
            {tempTodo && (
              <div key={0} data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                >
                  {tempTodo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => setTempTodo(null)}
                >
                  ×
                </button>
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <Filter
              onFilterChange={handleFilterChange}
              activeStatus={activeStatus}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!isAnyTodoCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={clearErrorButton}
        />
        {errorMessage}
      </div>
    </div>
  );
};
