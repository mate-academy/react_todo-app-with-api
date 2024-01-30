import classNames from 'classnames';
import {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import * as todoService from '../api/todos';
import { USER_ID } from '../utils/userId';
import { useDispatch, useSelector } from '../providers/TodosContext';
import { useError } from '../hooks/useError';
import { ActionType } from '../types/ActionType';
import { Errors } from '../types';

type Props = {
  isSomeActive: boolean
};

export const TodoHeader: React.FC<Props> = ({ isSomeActive }) => {
  const { todos, updateTodos } = useSelector();
  const dispatch = useDispatch();
  const { setError } = useError();

  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setInputValue('');

      setError(Errors.TitleEmpty);

      return;
    }

    setIsLoading(true);

    dispatch({
      type: ActionType.SetTempTodo,
      payload: {
        id: 0,
        title: inputValue.trim(),
        userId: USER_ID,
        completed: false,
      },
    });

    todoService.addTodo({
      title: inputValue.trim(),
      userId: USER_ID,
      completed: false,
    })
      .then((newTodo) => {
        setInputValue('');

        dispatch({
          type: ActionType.SetTodos,
          payload: [...todos, newTodo],
        });
        updateTodos();
      })
      .catch(() => setError(Errors.UnableAdd))
      .finally(() => {
        setIsLoading(false);
        dispatch({
          type: ActionType.SetTempTodo,
          payload: null,
        });
        inputRef.current?.focus();
      });
  };

  const handleToggleAll = () => {
    dispatch({
      type: ActionType.SetInProcess,
      payload: todos.map(({ id }) => id),
    });

    Promise.all(
      todos.map(todo => todoService.updateTodo({
        ...todo,
        completed: isSomeActive,
      })),
    )
      .then(updateTodos)
      .catch(() => setError(Errors.UnableUpdate))
      .finally(() => {
        dispatch({
          type: ActionType.SetInProcess,
          payload: [],
        });
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !isSomeActive,
        })}
        onClick={handleToggleAll}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
