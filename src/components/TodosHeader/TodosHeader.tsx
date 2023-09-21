import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import cn from 'classnames';
import { TodosContext } from '../../TodosContext';
import { Error } from '../../types/Error';
import { KeyEvent } from '../../types/KeyEvent';
import { USER_ID } from '../../utils/userId';

export const TodosHeader: React.FC = () => {
  const {
    setError,
    addTodo,
    setTempTodo,
    tempTodo,
    todos,
    setTodos,
    updateTodo,
    setUpdatingTodosId,
  } = useContext(TodosContext);

  const [query, setQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocus) {
      todoInput.current?.focus();
    }

    setIsFocus(false);
  }, [isFocus]);

  const isTempTodo = useMemo(() => {
    return tempTodo !== null;
  }, [tempTodo]);

  const isActiveTodos = useMemo(() => (
    todos.some(todo => !todo.completed)
  ), [todos]);

  const isAnyTodos = todos.length > 0;

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== KeyEvent.Enter) {
      return;
    }

    e.preventDefault();

    if (!query.trim()) {
      setError(Error.Title);
      setQuery('');

      return;
    }

    const newData = {
      id: 0,
      title: query,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newData);

    addTodo(newData)
      .then(() => {
        setQuery('');
      })
      .finally(() => {
        setTempTodo(null);
        setIsFocus(true);
      });
  };

  const handleToggleAllChange = () => {
    if (isActiveTodos) {
      const activeTodosId = todos
        .filter(t => !t.completed)
        .map(t => t.id);

      setUpdatingTodosId(activeTodosId);

      activeTodosId.forEach(id => {
        updateTodo(id, { completed: true })
          .then(() => {
            const newTodos = todos.map(item => {
              if (!item.completed) {
                const newItem = {
                  ...item,
                  completed: true,
                };

                return newItem;
              }

              return item;
            });

            setTodos(newTodos);
          })
          .catch(() => {
            setError(Error.Update);
          })
          .finally(() => {
            setUpdatingTodosId([]);
          });
      });
    } else {
      const CompletedTodosId = todos
        .filter(t => t.completed)
        .map(t => t.id);

      setUpdatingTodosId(CompletedTodosId);

      CompletedTodosId.forEach(id => {
        updateTodo(id, { completed: false })
          .then(() => {
            const newTodos = todos.map(item => {
              if (item.completed) {
                const newItem = {
                  ...item,
                  completed: false,
                };

                return newItem;
              }

              return item;
            });

            setTodos(newTodos);
          })
          .catch(() => {
            setError(Error.Update);
          })
          .finally(() => {
            setUpdatingTodosId([]);
          });
      });
    }
  };

  return (
    <header className="todoapp__header">
      {isAnyTodos && (
        <button
          onClick={handleToggleAllChange}
          type="button"
          className={cn('todoapp__toggle-all', { active: !isActiveTodos })}
          aria-label="mark all todos"
        />
      )}

      <form>
        <input
          ref={todoInput}
          disabled={isTempTodo}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyPressEnter}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
