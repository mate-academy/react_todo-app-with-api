/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../constants/USER_ID';

type Props = {
  loading: boolean,
  todos: Todo[]
  addTodo: (newTodo: Todo) => void
  reverteCompletedTodo: (todosForRevert: Todo[]) => void,
  titleFocus: boolean,
};

export const Form: React.FC<Props> = React.memo(
  ({
    loading,
    todos,
    addTodo,
    reverteCompletedTodo,
    titleFocus,
  }) => {
    const [value, setValue] = useState('');
    const formInput = useRef<HTMLInputElement | null>(null);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const activeTodos = useMemo(() => {
      return todos.filter(todo => !todo.completed);
    }, [todos]);

    useEffect(() => {
      if (isFirstRender) {
        setIsFirstRender(false);

        return;
      }

      if (formInput.current) {
        formInput.current.focus();
      }
    }, [titleFocus]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const newTodo = {
        id: 0,
        userId: USER_ID,
        title: value,
        completed: false,
      };

      addTodo(newTodo);
      setValue('');
    };

    return (
      <>
        {todos.length !== 0
          && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
              onClick={() => reverteCompletedTodo(todos)}
              disabled={loading}
            />
          )}

        <form onSubmit={handleSubmit}>
          <input
            ref={formInput}
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={value}
            disabled={loading}
            onChange={(event) => setValue(event.target.value)}
          />
        </form>
      </>
    );
  },
);
