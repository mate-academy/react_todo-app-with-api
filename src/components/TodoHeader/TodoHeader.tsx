import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useError } from '../ErrorContext';

type Props = {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'userId'>) => Promise<boolean>;
  handleToggleAll: () => Promise<void>;
  headerInputRef: React.RefObject<HTMLInputElement>;
  isAdding?: boolean;
};

export const TodoHeader: React.FC<Props> = React.memo(
  ({ todos, addTodo, handleToggleAll, headerInputRef, isAdding = false }) => {
    const { setError } = useError();
    const [newTodoTitle, setNewTodoTitle] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmednewTodoTitle = newTodoTitle.trim();

      if (trimmednewTodoTitle === '') {
        setError('Title should not be empty');

        return;
      }

      const isAdded = await addTodo({
        title: trimmednewTodoTitle,
        completed: false,
      });

      if (isAdded) {
        setNewTodoTitle('');
      }
    };

    const handlenewTodoTitleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const enteredValue = event.target.value;

      setNewTodoTitle(enteredValue);
    };

    return (
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        {!!todos.length && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />
        )}
        {/* Add a todo on form submit */}
        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={headerInputRef}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={handlenewTodoTitleChange}
            disabled={isAdding}
          />
        </form>
      </header>
    );
  },
);

TodoHeader.displayName = 'TodoHeader';
