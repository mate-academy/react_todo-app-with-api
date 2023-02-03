import classNames from 'classnames';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { postTodo, patchTodo } from '../../api/todos';
import { Error } from '../../types/Error';
import { Todo } from '../../types/Todo';

type Props = {
  setErrorsArgument: (argument: Error | null) => void,
  setTodos: (arg: Todo[] | []) => void,
  todos: Todo[],
  setTempTodo: (arg: Todo | null) => void,
  setIsLoadAllToggle: (arg: boolean) => void,
};

export const Header: React.FC<Props> = ({
  setErrorsArgument,
  setTodos,
  todos,
  setTempTodo,
  setIsLoadAllToggle,
}) => {
  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isActiveToggleAll, setIsActiveToggleAll] = useState(false);
  const user = useContext(AuthContext);

  const postTodosData = async () => {
    if (user && query) {
      setIsAdding(true);
      setTempTodo({
        id: 0,
        userId: 0,
        title: query,
        completed: false,
      });
      const data = {
        title: query,
        userId: user.id,
        completed: false,
      };

      await postTodo(data)
        .then(todo => {
          if (todos) {
            setTodos([...todos, todo]);
          } else {
            setTodos([todo]);
          }
        })
        .catch(() => {
          setErrorsArgument(Error.Add);
        })
        .finally(() => {
          setIsAdding(false);
          setQuery('');
          setTempTodo(null);
        });
    }

    if (!query) {
      setErrorsArgument(Error.Empty);
    }
  };

  const isAllTodosCompleted = () => {
    for (let i = 0; i < todos.length; i += 1) {
      if (!todos[i].completed) {
        return false;
      }
    }

    return true;
  };

  const toggleAllTodos = () => {
    const todosList = [...todos];
    let countCompleted = 0;

    const patchAllToggledTodos = (index: number, isCompleted: boolean) => {
      setIsLoadAllToggle(true);

      return patchTodo(todos[index].id, { completed: isCompleted })
        .then(() => {
          todosList[index].completed = isCompleted;

          return todosList[index];
        })
        .catch(() => {
          setErrorsArgument(Error.Update);
        });
    };

    let promises = todos.map((todo, index) => {
      if (!todo.completed) {
        return patchAllToggledTodos(index, true);
      }

      countCompleted += 1;

      return [];
    });

    if (countCompleted === todos.length) {
      promises = todos.map((_, index) => {
        return patchAllToggledTodos(index, false);
      });
    }

    Promise.all(promises)
      .then(() => {
        setTodos(todosList);
        setIsLoadAllToggle(false);
      });
  };

  useEffect(() => {
    setIsActiveToggleAll(isAllTodosCompleted());
  }, []);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="active"
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isActiveToggleAll },
          )}
          onClick={() => toggleAllTodos()}
        />
      )}
      <form onSubmit={(event) => {
        event.preventDefault();
        postTodosData();
      }}
      >
        <input
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          value={query}
        />
      </form>
    </header>
  );
};
