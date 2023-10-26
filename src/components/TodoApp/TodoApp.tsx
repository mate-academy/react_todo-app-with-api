/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from '../../UserWarning';
import { TodoContext } from '../TodoContext';
import * as todosService from '../../services/todos';
import { ErrorMessage } from '../../types/ErrorMessage';
import { TodoList } from '../TodoList';
import { TodoFooter } from '../TodoFooter';
import { TodoErrorNotification } from '../TodoErrorNotification';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

const USER_ID = 11708;

export const TodoApp: React.FC = () => {
  const { todos, setTodos } = useContext(TodoContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [usingUpdatesId, setUsingUpdatesId] = useState<number[]>([]);

  const titleField = useRef<HTMLInputElement>(null);
  const allTodosActive = todos.every(todo => todo.completed);

  useEffect(() => {
    if (titleField.current !== null) {
      titleField.current.focus();
    }
  }, [setTodos, query, todos, setTempTodo]);

  function setError(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessage.UnableLoad);
      });
  }, [setTodos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    if (titleField.current !== null) {
      titleField.current.disabled = true;
    }

    const newTodoData = {
      userId: USER_ID,
      title: trimmedQuery,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodoData,
    });

    setLoading(true);

    const createNewTodo = todosService.creatTodo(newTodoData);

    createNewTodo
      .then(newTodo => {
        setQuery('');
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setError(ErrorMessage.UnableTodo);
      })
      .finally(() => {
        if (titleField.current !== null) {
          titleField.current.disabled = false;
          titleField.current.focus();
        }

        setLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setUsingUpdatesId(prev => [...prev, todoId]);

    const deletePromise = todosService.deleteTodo(todoId);

    deletePromise
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setTodos(todos);
        setError(ErrorMessage.UnableDelete);
      })
      .finally(() => {
        setUsingUpdatesId(prev => prev.filter(el => el !== todoId));
      });
  };

  const updateTodo = (
    oldTodo: Todo,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    setUsingUpdatesId(prev => [...prev, oldTodo.id]);

    return todosService.updateTodos(oldTodo)
      .then(() => {
        setTodos(
          currentTodos => currentTodos.map(
            prev => (prev.id === oldTodo.id ? oldTodo : prev),
          ),
        );
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch(() => {
        setError(ErrorMessage.UnableUpdate);
        if (onError) {
          onError();
        }
      })
      .finally(() => {
        setLoading(false);
        setUsingUpdatesId(
          prev => prev.filter(el => el !== oldTodo.id),
        );
      });
  };

  const toggleTodo = (todo: Todo) => {
    const { completed } = todo;

    const newTodo = {
      ...todo,
      completed: !completed,
    };

    updateTodo(newTodo)
      .then(() => { })
      .catch(() => { });
  };

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  const toggleAll = () => {
    const completedStatus = activeTodos > 0;

    todos.forEach(todo => {
      if (todo.completed !== completedStatus) {
        toggleTodo(todo);
      }
    });
  };

  const deleteAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => Promise.resolve(deleteTodo(todo.id)));

    Promise.allSettled(completedTodos);
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
            // eslint-disable-next-line
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allTodosActive,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={addTodo}>
            <input
              ref={titleField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={loading}
            />
          </form>
        </header>

        {!!todos.length && (
          <TodoList
            onDeleteTodo={deleteTodo}
            onChangeStatus={toggleTodo}
            usingUpdatesId={usingUpdatesId}
            updateTodo={updateTodo}
            setError={(message) => setError(message)}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            todoDeleteButton={deleteTodo}
            onChangeStatus={updateTodo}
            usingUpdatesId={usingUpdatesId}
            updateTodo={updateTodo}
            setError={(message) => setError(message)}
          />
        )}

        {!!todos.length && (
          <TodoFooter deleteAllCompleted={deleteAllCompleted} />
        )}
      </div>

      <TodoErrorNotification
        errorMessage={errorMessage}
        closeWindow={() => setErrorMessage('')}
      />
    </div>
  );
};
