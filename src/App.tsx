/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/Todos/TodoList/TodoList';
import { NewTodo, Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorText, setErrorText] = useState('');
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<TodoStatus>(TodoStatus.All);

  const comppleteTodosExist = todos.some(el => el.completed);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    client.get<Todo[]>(`/todos?userId=${user?.id}`)
      .then(setTodos)
      .catch(() => {
        setTodos([]);
        setErrorText('download');
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setErrorText(''), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorText]);

  useEffect(() => {}, []);

  const setTodoLoading = (todoId: number, status: boolean) => {
    setTodos(state => {
      const prevTodo = state.find(next => next.id === todoId);

      if (prevTodo === undefined || prevTodo.isLoading === status) {
        return state;
      }

      const index = state.indexOf(prevTodo);

      const activeTodo: Todo = {
        ...state[index],
        isLoading: status,
      };

      const nextState = [...state];

      nextState.splice(index, 1, activeTodo);

      return nextState;
    });
  };

  const handleCreateFormSubmit = () => {
    const url = '/todos';
    let title = '';
    const newTodoId = -todos.length;

    if (newTodoField.current) {
      title = newTodoField.current.value;
    }

    if (!user) {
      return;
    }

    const data: NewTodo = {
      title,
      userId: user.id,
      completed: false,
      isLoading: true,
    };

    setTodos(state => [...state, { ...data, id: newTodoId }]);

    client.post<Todo>(url, data)
      .then(res => {
        setTodos(state => [...state, res]);
      })
      .catch(() => {
        setErrorText('Unable to add a todo');
      })
      .finally(() => {
        setTodos(state => {
          return state.filter(el => el.id !== newTodoId);
        });
        if (newTodoField.current) {
          newTodoField.current.value = '';
        }
      });
  };

  const onDeleteTodo = useCallback((todoId: number) => {
    setTodoLoading(todoId, true);

    client.delete(`/todos/${todoId}`)
      .then(amount => {
        if (amount === 1) {
          setTodos(state => {
            return state.filter(current => current.id !== todoId);
          });
        }
      })
      .catch(() => {
        setErrorText('Unable to delete a todo');
        setTodoLoading(todoId, false);
      });
  }, []);

  const changeTodoStatus = useCallback((todo: Todo) => {
    setTodoLoading(todo.id, true);

    client.patch<Todo>(`/todos/${todo.id}`, { completed: !todo.completed })
      .then(res => setTodos(state => {
        const prevTodo = state.find(el => el.id === res.id);

        if (prevTodo === undefined || !res) {
          return state;
        }

        const index = state.indexOf(prevTodo);

        const nextState = [...state];

        nextState.splice(index, 1, { ...res });

        return nextState;
      }))
      .catch(() => {
        setErrorText('Unable to update a todo');
      })
      .finally(() => setTodoLoading(todo.id, false));
  }, []);

  const onToggleAll = () => {
    const nextStatus = todos.some(el => !el.completed);
    const todosToBeUpdated = todos.filter(el => el.completed !== nextStatus);

    Promise.all(todosToBeUpdated.map(todo => changeTodoStatus(todo)))
      .catch(() => {
        setErrorText('Unable to update todos');
      });
  };

  const onDeleteCompleted = () => {
    const todosToBeUpdated = todos.filter(el => el.completed);

    Promise.all(todosToBeUpdated.map(todo => onDeleteTodo(todo.id)));
  };

  const onTodoTitleChange = (todoId: number, newTitle: string) => {
    const prevTitle = todos.find(el => el.id === todoId)?.title;

    setTodoLoading(todoId, true);
    setTodos(state => {
      return [...state].map(el => {
        if (el.id === todoId) {
          return { ...el, title: newTitle };
        }

        return el;
      });
    });

    client.patch<Todo>(`/todos/${todoId}`, { title: newTitle })
      .then(res => {
        setTodos(state => {
          return [...state].map(el => {
            if (el.id === todoId) {
              return res;
            }

            return el;
          });
        });
      })
      .catch(() => {
        setTodos(state => {
          return [...state].map(el => {
            if (el.id === todoId && prevTitle) {
              return { ...el, title: prevTitle };
            }

            return el;
          });
        });

        setErrorText('Unable to update a todo');
      })
      .finally(() => {
        setTodoLoading(todoId, false);
      });
  };

  const handleSortStatusChange = (newStatus: TodoStatus) => {
    setSelectedStatus(newStatus);
  };

  const getVisibleTodos = () => {
    return todos.filter(el => {
      switch (selectedStatus) {
        case TodoStatus.All:
          return true;

        case TodoStatus.Active:
          return !el.completed;

        case TodoStatus.Complete:
          return el.completed;

        default:
          throw new Error('error in filtering todos by status');
      }
    });
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
            onClick={onToggleAll}
          />

          <form onSubmit={(event) => {
            event.preventDefault();
            handleCreateFormSubmit();
          }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              required
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={getVisibleTodos()}
              onDelete={onDeleteTodo}
              onChangeTodoStatus={changeTodoStatus}
              onTodoTitleChange={onTodoTitleChange}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`items left ${todos.length}`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className="filter__link selected"
                  onClick={() => handleSortStatusChange(TodoStatus.All)}
                >
                  {TodoStatus.All}
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className="filter__link"
                  onClick={() => handleSortStatusChange(TodoStatus.Active)}
                >
                  {TodoStatus.Active}
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className="filter__link"
                  onClick={() => handleSortStatusChange(TodoStatus.Complete)}
                >
                  {TodoStatus.Complete}
                </a>
              </nav>

              {comppleteTodosExist && (
                <button
                  data-cy="ClearCompletedButton"
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={onDeleteCompleted}
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
        hidden={!errorText}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorText('')}
        />
        {errorText}
      </div>
    </div>
  );
};
