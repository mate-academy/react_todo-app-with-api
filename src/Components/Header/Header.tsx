import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { addTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { DefaultTodo } from '../../services/DefaultTodo';

type Props = {
  todos: Todo[];
  isDisableInput: boolean;
  isCompletedTodos: boolean,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsDisableInput: (value: boolean) => void;
  setTempTodo: (todo: Todo | null) => void;
  makeAllTodosCompleted: () => void;
  showErrorMessage: (message: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  isDisableInput,
  isCompletedTodos,
  setIsDisableInput,
  setTempTodo,
  makeAllTodosCompleted,
  showErrorMessage,
}) => {
  const [titleTodo, setTitleTodo] = useState('');
  const textInput = useRef<HTMLInputElement | null>(null);
  const isUnableAddTodo = useRef(true);

  useEffect(() => {
    textInput.current?.focus();
  }, [isDisableInput]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    showErrorMessage('');
    isUnableAddTodo.current = true;

    if (titleTodo.trim()) {
      setIsDisableInput(true);
      setTempTodo({
        ...DefaultTodo,
        title: titleTodo.trim(),
      });

      addTodos({ ...DefaultTodo, title: titleTodo.trim() })
        .then(data => {
          setTodos((currentTodos) => [...currentTodos, data]);
        })
        .catch((error) => {
          setTempTodo(null);
          isUnableAddTodo.current = false;
          showErrorMessage('Unable to add a todo');
          throw error;
        })
        .finally(() => {
          if (isUnableAddTodo.current) {
            setTitleTodo('');
          }

          setTempTodo(null);
          setIsDisableInput(false);
        });
    } else {
      showErrorMessage('Title should not be empty');
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isCompletedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={makeAllTodosCompleted}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={event => setTitleTodo(event.target.value)}
          ref={textInput}
          disabled={isDisableInput}
        />
      </form>
    </header>
  );
};
