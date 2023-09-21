/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  deleteTodoById,
  getTodos,
  setNewTodo,
  updateTodoById,
} from './api/todos';
import { Todo } from './types/Todo';
import { Notification } from './components/Notification/Notification';
import { StatusEnum } from './types/StatusEnum';
import { TodosFilter } from './components/TodosFilter/TodosFilter';
import { TodoList } from './components/TodoList/TodoList';

const USER_ID = 11497;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingAddTodo, setIsLoadingAddTodo] = useState(false);
  const [todosIdToDelete, setTodosIdToDelete] = useState<number[]>([]);
  const [todosIdToUpdate, setTodosIdToUpdate] = useState<number[]>([]);
  const [filter, setFilter] = useState<StatusEnum>(
    window.location.hash.slice(2) as StatusEnum || StatusEnum.All,
  );

  const formInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!todosIdToDelete.length && !isLoadingAddTodo && formInput.current) {
      formInput.current.focus();
    }
  }, [isLoadingAddTodo, todosIdToDelete]);

  const handleChangeFilter = (newFilter: StatusEnum) => {
    setFilter(newFilter);
  };

  const handleChangeNewTodoTitle
    = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodoTitle(event.target.value);
    };

  const hasCompletedTodo = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const notCompletedTodosLength = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const isCompletedAll = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsLoadingAddTodo(true);

    setTempTodo({
      completed: false,
      id: 0,
      title: newTodoTitle.trim(),
      userId: USER_ID,
    });

    setNewTodo({
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    })
      .then(response => {
        setNewTodoTitle('');

        return response;
      })
      .then((newTodo) => {
        setTodos((prevState) => [...prevState, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsLoadingAddTodo(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const handelDeleteTodoById = (todoId: number) => {
    setTodosIdToDelete(prevState => [...prevState, todoId]);

    deleteTodoById(todoId)
      .then(() => {
        setTodos(prevState => prevState.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTodosIdToDelete(prevState => prevState.filter(id => id !== todoId));
      });
  };

  const handleChangeCompletedStatus
    = (todoId: number, isCompleted: boolean) => {
      setTodosIdToUpdate(prevState => [...prevState, todoId]);

      updateTodoById(todoId, { completed: !isCompleted })
        .then(() => {
          setTodos(prevState => {
            const currentTodo = prevState
              .find(todo => todo.id === todoId);

            if (!currentTodo) {
              return prevState;
            }

            const newTodos = [...prevState];
            const index = prevState.indexOf(currentTodo);

            newTodos.splice(index, 1, {
              ...currentTodo,
              completed: !currentTodo.completed,
            });

            return newTodos;
          });
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        })
        .finally(() => {
          setTodosIdToUpdate(prevState => prevState
            .filter(id => id !== todoId));
        });
    };

  const handleChangeTodoTitle
    = (todoId: number, newTitle: string) => {
      setTodosIdToUpdate(prevState => [...prevState, todoId]);

      updateTodoById(todoId, { title: newTitle })
        .then(() => {
          setTodos(prevState => {
            const currentTodo = prevState
              .find(todo => todo.id === todoId);

            if (!currentTodo) {
              return prevState;
            }

            const newTodos = [...prevState];
            const index = prevState.indexOf(currentTodo);

            newTodos.splice(index, 1, {
              ...currentTodo,
              title: newTitle,
            });

            return newTodos;
          });
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        })
        .finally(() => {
          setTodosIdToUpdate(prevState => prevState
            .filter(id => id !== todoId));
        });
    };

  const handelDeleteCompletedTodos = async () => {
    const completedTodosId = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id);

    await Promise
      .all([...completedTodosId.map(id => handelDeleteTodoById(id))]);
  };

  const handleChangeAllCompletedStatus = async () => {
    const todosId = todos
      .filter(({ completed }) => {
        if (!isCompletedAll) {
          return !completed;
        }

        return true;
      })
      .map(({ id }) => id);

    await Promise
      .all([...todosId
        .map(id => handleChangeCompletedStatus(id, isCompletedAll))]);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isCompletedAll,
              })}
              data-cy="ToggleAllButton"
              onClick={handleChangeAllCompletedStatus}
            />
          )}

          <form onSubmit={handelSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleChangeNewTodoTitle}
              disabled={isLoadingAddTodo}
              ref={formInput}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          todosIdToDelete={todosIdToDelete}
          todosIdToUpdate={todosIdToUpdate}
          onDeleteTodo={handelDeleteTodoById}
          onChangeTitle={handleChangeTodoTitle}
          onChangeCompletedStatus={handleChangeCompletedStatus}
          filter={filter}
        />

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${notCompletedTodosLength} items left`}
            </span>

            <TodosFilter filter={filter} onChangeFilter={handleChangeFilter} />
            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              disabled={!hasCompletedTodo}
              onClick={() => handelDeleteCompletedTodos()}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        onCloseErrorMessage={setErrorMessage}
      />
    </div>
  );
};
