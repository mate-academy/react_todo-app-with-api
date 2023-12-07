import { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorStatus } from '../types/ErrorStatus';
import { createTodo, getTodos, updateTodo } from '../api/todos';
import { USER_ID } from '../utils/constants';

interface Props {
  todos: Todo[],
  setTodos: (todo: Todo[]) => void,
  setErrorMessage: (value: string) => void,
  setTempTodo: (value: Todo | null) => void,
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setTempTodo,
  setLoadingIds,
}) => {
  const [title, setTitle] = useState('');

  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage(ErrorStatus.Title);

      return;
    }

    const newTodo = { title, userId: USER_ID, completed: false };

    setTempTodo({ ...newTodo, id: 0 });

    createTodo(newTodo)
      .then(() => {
        getTodos(USER_ID)
          .then((value) => {
            setTodos(value);
            setTempTodo(null);
          });
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.Add);
      });

    setTitle('');
  };

  const handleToggleAll = () => {
    const uncompletedTodos = todos.filter(todo => todo.completed === false);
    const uncompletedTodosIds = uncompletedTodos.map(todo => todo.id);

    if (uncompletedTodos.length === 0) {
      setLoadingIds(currIds => [...currIds, ...todos.map(todo => todo.id)]);

      Promise.all(todos.map(todo => {
        return updateTodo(todo.id, { completed: !todo.completed });
      }))
        .then(() => {
          getTodos(USER_ID)
            .then((value) => {
              setTodos(value);
              setLoadingIds([]);
            })
            .catch(() => {
              setErrorMessage(ErrorStatus.Load);
            });
        })
        .catch(() => {
          setErrorMessage(ErrorStatus.Update);
        });

      return;
    }

    setLoadingIds(currIds => [...currIds, ...uncompletedTodosIds]);

    Promise.all(uncompletedTodos.map(todo => {
      return updateTodo(todo.id, { completed: !todo.completed });
    }))
      .then(() => {
        getTodos(USER_ID)
          .then((value) => {
            setTodos(value);
          })
          .catch(() => {
            setErrorMessage(ErrorStatus.Load);
          })
          .finally(() => {
            setLoadingIds([]);
          });
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.Update);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0
        && (
          <button
            aria-label="btn"
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: completedTodosCount !== 0,
            })}
            onClick={() => handleToggleAll()}
          />
        )}

      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
