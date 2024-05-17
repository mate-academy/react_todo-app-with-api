import { useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { addTodo, updateTodo } from '../../api/todos';

import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

import { createTodo } from '../../utils/createTodo';
import { TodoContext } from '../../Context/TodoContext';

export const Header: React.FC = () => {
  const {
    setTodos,
    setError,
    headerInputRef,
    focusInput,
    setTempTodo,
    todos,
    updateTodoLocal,
  } = useContext(TodoContext);
  const [title, setTitle] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const allTodoCompleted = todos.every(todo => todo.completed);
  const hasTodos = todos.length > 0;

  const handleAddTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const validTitle = title.trim();

      if (!validTitle) {
        setError(Error.EmptyTitle);

        return;
      }

      setIsLoaded(true);

      const newTodo = createTodo(validTitle);

      setTempTodo({ ...newTodo, id: 0 });

      addTodo(newTodo)
        .then((todo: Todo) => {
          setTodos((prevTodos: Todo[]) => [...prevTodos, todo]);
          setTitle('');
        })
        .catch(() => {
          setError(Error.AddTodo);
        })
        .finally(() => {
          setIsLoaded(false);

          setTempTodo(null);
        });
    }
  };

  const handleToggleAll = () => {
    setIsLoaded(true);

    todos.forEach(todo => {
      const updatedTodo = { ...todo, completed: !allTodoCompleted };

      if (todo.completed !== updatedTodo.completed) {
        updateTodo(updatedTodo)
          .then(() => {
            updateTodoLocal(updatedTodo);
          })
          .catch(() => {
            setError(Error.UpdateTodo);
          })
          .finally(() => {
            setIsLoaded(false);
          });
      }
    });
  };

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodoCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}
      <form>
        <input
          ref={headerInputRef}
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleAddTodo}
          disabled={isLoaded}
        />
      </form>
    </header>
  );
};
