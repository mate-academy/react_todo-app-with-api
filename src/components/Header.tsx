/* eslint-disable no-param-reassign */
import { useContext, useState } from 'react';
import { USER_ID, addPost, completedCheck } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorContext } from '../contexts/ErrorContext';
import { ActionType } from '../contexts/types/Actions';
import classNames from 'classnames';
import { LoadingContext } from '../contexts/LoadingContext';

export interface HeaderType {
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderType> = ({ inputRef }) => {
  const [todoTitle, setTodoTitle] = useState('');
  const { todos, dispatch } = useContext(TodoContext);
  const { setError } = useContext(ErrorContext);
  const { setLoading } = useContext(LoadingContext);

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!todoTitle.trim()) {
      setError('Title should not be empty');

      return;
    }

    const newTodo: Todo = {
      title: todoTitle.trim(),
      completed: false,
      id: 0,
      userId: USER_ID,
    };

    dispatch({ type: ActionType.ADD, payload: newTodo });

    (inputRef.current as HTMLInputElement).disabled = true;

    addPost(newTodo)
      .then(response => {
        newTodo.id = response.id;

        setTodoTitle('');

        return;
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        dispatch({ type: ActionType.DELETE, payload: 0 });

        (inputRef.current as HTMLInputElement).disabled = false;
      })
      .then(() => {
        (inputRef.current as HTMLInputElement).focus();
      });
  };

  const changeValueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  const hasnotCompleted = !todos.some(td => !td.completed);

  const fillEveryTask = () => {
    setLoading(true, !hasnotCompleted);

    const promiseArr: Array<Promise<void>> = [];

    todos
      .filter(td => td.completed === hasnotCompleted)
      .forEach(todo => {
        promiseArr.push(
          completedCheck(todo.id, !todo.completed)
            .then(response => {
              dispatch({ type: ActionType.COMPLETED, payload: response });
            })
            .catch(() => {
              setError('Unable to update a todo');
            }),
        );
      });

    Promise.all([...promiseArr]).finally(() => {
      setLoading(false, false);
    });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: hasnotCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={fillEveryTask}
      />

      <form onSubmit={e => addTodo(e)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          value={todoTitle}
          onChange={changeValueInput}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
