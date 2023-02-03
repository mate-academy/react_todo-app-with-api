import classNames from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { deleteTodo, patchTodo } from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todo: Todo,
  isLoadAllDelete: boolean,
  setErrorsArgument: (argument: Error | null) => void,
  todos: Todo[] | null,
  setTodos: (arg: Todo[]) => void,
  isLoadAllToggle: boolean,
};

export const TodosItem: React.FC<Props> = ({
  todo,
  todos,
  isLoadAllDelete,
  setErrorsArgument,
  setTodos,
  isLoadAllToggle,
}) => {
  const [query, setQuery] = useState('');
  const [isLoad, setisLoad] = useState(false);
  const [isActiveField, setIsActiveField] = useState(false);

  const user = useContext(AuthContext);

  const deleteTodosItem = async (todoId: number) => {
    if (user) {
      setisLoad(true);
      setErrorsArgument(null);
      await deleteTodo(todoId)
        .then(() => {
          if (todos) {
            setTodos(
              todos.filter((item) => item.id !== todoId),
            );
          }
        })
        .catch(() => setErrorsArgument(Error.Delete));
      setisLoad(false);
    }
  };

  const toggleTodo = (completed = false) => {
    if (user && todos) {
      setisLoad(true);
      const data = {
        completed,
      };

      const getChangedTodos = () => {
        if (todos) {
          const todosList = [...todos];

          todosList[todos.indexOf(todo)].completed = completed;

          return todosList;
        }

        return [];
      };

      patchTodo(todo.id, data)
        .then(() => setTodos(getChangedTodos()))
        .catch(() => setErrorsArgument(Error.Update))
        .finally(() => {
          setisLoad(false);
        });
    }
  };

  const getToggledTodosNumber = () => {
    let calc = 0;

    if (todos) {
      for (let i = 0; i < todos.length; i += 1) {
        if (todos[i].completed) {
          calc += 1;
        }
      }
    }

    return calc;
  };

  const onChangeTodosTitle = () => {
    if (user && todos) {
      const todosList = [...todos];

      if (todo.title === query) {
        return;
      }

      if (!query) {
        deleteTodosItem(todo.id);

        return;
      }

      const patchChangedTitle = (index: number, todosTitle: string) => {
        setisLoad(true);
        setErrorsArgument(null);
        const data = {
          completed: false,
          title: todosTitle,
        };

        return patchTodo(todo.id, data)
          .then(() => {
            todosList[index].title = query;

            return todosList;
          })
          .catch(() => setErrorsArgument(Error.Update));
      };

      const promises = todos.map((item, index) => {
        if (todo.id === item.id) {
          return patchChangedTitle(index, query);
        }

        return [];
      });

      Promise.all(promises)
        .then(() => {
          setTodos(todosList);
          setisLoad(false);
          setIsActiveField(false);
        });
    }
  };

  const keyUpHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setQuery(todo.title);
      setIsActiveField(false);
    }
  };

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => toggleTodo(!todo.completed)}
        />
      </label>

      {!isActiveField
        ? (
          <span
            onDoubleClick={() => {
              setIsActiveField(true);
              setQuery(todo.title);
            }}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {query || todo.title}
          </span>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsActiveField(false);
              onChangeTodosTitle();
            }}
          >
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={query}
              onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
              onBlur={() => {
                setIsActiveField(false);
                onChangeTodosTitle();
              }}
              onKeyUp={keyUpHandler}
            />
          </form>
        )}
      {!isActiveField && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => deleteTodosItem(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay',
            {
              'is-active': isLoad
              || todo.id === 0
              || (isLoadAllDelete && todo.completed)
              || (isLoadAllToggle && !todo.completed)
              || (isLoadAllToggle
                  && (getToggledTodosNumber() === todos?.length)),
            })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
