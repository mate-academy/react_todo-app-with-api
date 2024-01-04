import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { addTodo, updateTodo } from '../api/todos';
import { useTodoContext } from '../context';
import { Errors } from '../types/Errors';
import { Todo } from '../types/Todo';

export const Header = () => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    setAllTodos,
    errorHandler,
    inputRef,
    setTempTodo,
    USER_ID,
    allTodos,
    setIsUpdating,
  } = useTodoContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = query.trim();

    if (trimmedTitle === '') {
      errorHandler(Errors.titleError);

      return;
    }

    setIsLoading(true);

    try {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      const addedTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setAllTodos((prevTodos: Todo[] | null) => {
        return prevTodos ? [...prevTodos, addedTodo] : [addedTodo];
      });

      setQuery('');
    } catch (error) {
      errorHandler(Errors.addError);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleToggleAll = async () => {
    let toggleType = true;

    if (allTodos?.every(todo => todo.completed)) {
      toggleType = false;
    }

    try {
      if (allTodos) {
        allTodos.forEach(todo => {
          setIsUpdating((prevIds) => [...prevIds, todo.id]);
        });

        await Promise.all(
          allTodos?.filter(todo => todo.completed !== toggleType)
            .map(todo => updateTodo(todo.id, {
              completed: toggleType,
            })),
        );

        const updatedTodos = allTodos?.map(todo => {
          return {
            ...todo,
            completed: toggleType,
          };
        });

        setAllTodos(updatedTodos);
      }
    } catch (error) {
      errorHandler(Errors.updateError);
    } finally {
      setIsUpdating([]);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [allTodos, inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active:
          allTodos
           && allTodos?.length > 0
          && allTodos?.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={query}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          onChange={handleQuery}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
