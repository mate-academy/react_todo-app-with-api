/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  addTodos,
  deleteTodo,
  editTodo,
  getTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Filter } from './components/Filter';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const userId = user ? user.id : 0;
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [noError, setNoError] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [errorText, setErrorText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState([0]);
  const [
    temporaryTodo,
    setTemporaryTodo,
  ] = useState<Todo | null>(null);

  const showError = (errorTextToShow: string) => {
    setNoError(false);
    setErrorText(errorTextToShow);

    setTimeout(() => {
      setNoError(true);
      setErrorText('');
    }, 3000);
  };

  useEffect(() => {
    getTodos(userId)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        showError('Unable to update a todo');
      });

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const onSubmit = (title: string) => {
    if (title.length === 0) {
      showError('Title can\'t be empty');

      return;
    }

    setTemporaryTodo({
      id: 0,
      userId,
      title,
      completed: false,
    });

    setIsAdding(true);

    const newTodo = {
      userId,
      title,
      completed: false,
    };

    addTodos(userId, newTodo)
      .then((newTodoFromServer) => {
        setTodos([...todos, newTodoFromServer]);
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setTemporaryTodo(null);
        setIsAdding(false);
      });
  };

  const onDelete = (id: number) => {
    setIsLoading((currentArrIsDelete) => [...currentArrIsDelete, id]);

    deleteTodo(id)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.filter(todo => todo.id !== id);
        });
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setIsLoading((currentArrIsDelete) => {
          return currentArrIsDelete
            .filter(idOfDeletingItem => idOfDeletingItem !== id);
        });
      });
  };

  const onToggle = (id: number) => {
    setIsLoading((currentArrIsDelete) => [...currentArrIsDelete, id]);
    const todoToedit = todos.find(todo => todo.id === id);

    if (!todoToedit) {
      showError('Unable to update a todo');

      return;
    }

    const newData: Pick<Todo, 'completed'> = {
      completed: !todoToedit.completed,
    };

    editTodo(id, newData)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                completed: !todo.completed,
              };
            }

            return todo;
          });
        });
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setIsLoading((isLoadingNow) => {
          return isLoadingNow
            .filter(idOfLoadedTodo => idOfLoadedTodo !== id);
        });
      });
  };

  const onToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    if (!areAllCompleted) {
      todos.forEach(todo => {
        if (!todo.completed) {
          onToggle(todo.id);
        }
      });

      return;
    }

    todos.forEach(todo => {
      onToggle(todo.id);
    });
  };

  const handleClearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        onDelete(id);
      }
    });
  };

  const isClearCompletedHidden = todos.some(({ completed }) => completed);

  const isToggleAllActive = todos.every(({ completed }) => completed);

  const visibleTodos = todos.filter(({ completed }) => {
    switch (filterStatus) {
      case 'Active':
        return !completed;
      case 'Completed':
        return completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          isAdding={isAdding}
          isToggleAllActive={isToggleAllActive}
          onFocus={setNoError}
          onFormSubmit={onSubmit}
          onToggleAll={onToggleAll}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={temporaryTodo}
          isLoading={isLoading}
          onDelete={onDelete}
          onToggle={onToggle}
        />

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${visibleTodos.length} items left`}
          </span>

          <Filter filterStatus={filterStatus} onFilter={setFilterStatus} />

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={handleClearCompleted}
            style={{
              visibility: !isClearCompletedHidden ? 'hidden' : 'visible',
            }}
          >
            Clear completed
          </button>
        </footer>
      </div>

      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
        hidden={noError}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setNoError(true)}
        />
        {errorText}
      </div>
    </div>
  );
};
