import React, {
  FC, FormEvent, useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';

type Props = {
  showError: (message: string) => void,
  isAddingTodo: boolean,
  onAddTodo: (fieldsForCreate: Omit<Todo, 'id'>) => Promise<void>;
  shouldRenderActiveToggle: boolean
  clearAllButton: () => void
};

export const
  Header: FC<Props> = React.memo((props) => {
    const {
      showError,
      isAddingTodo,
      onAddTodo,
      shouldRenderActiveToggle,
      clearAllButton,
    } = props;

    const user = useContext(AuthContext);
    const newTodoField = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState('');

    useEffect(() => {
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }, [isAddingTodo]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      if (!title) {
        showError('Title is required');

        return;
      }

      if (!user) {
        showError('User not found');

        return;
      }

      try {
        await onAddTodo({
          title,
          userId: user.id,
          completed: false,
        });

        setTitle('');
      } catch { /* empty */ }
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable jsx-a11y/control-has-associated-label */}
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={cn('todoapp__toggle-all',
            {
              active: shouldRenderActiveToggle,
            })}
          onClick={() => clearAllButton}
        />

        <form onSubmit={handleFormSubmit}>
          <input
            disabled={isAddingTodo}
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={event => (setTitle(event.target.value))}
            value={title}
          />
        </form>
      </header>
    );
  });
