import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { DispatchContext, StateContext } from '../StateProvider';

type Props = {
  onSubmit: (title: string) => void;
  todoTitle?: string;
  setIsEditing?: (isEditing: boolean) => void;
};

export const Form = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      onSubmit,
      todoTitle = '',
      setIsEditing = () => { },
    },
    ref,
  ) => {
    const [title, setTitle] = useState<string>(todoTitle);
    const { loading } = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const handleAddTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (ref) {
        return;
      }

      if (!title.trim()) {
        dispatch({ type: 'SET_ERROR', payload: "Title can't be empty" });

        return;
      }

      onSubmit(title);

      setTitle('');
    };

    const handleEditTodo = () => {
      onSubmit(title.trim());
      setIsEditing(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setTitle(todoTitle);
        setIsEditing(false);
      }

      if (event.key === 'Enter') {
        handleEditTodo();
      }
    };

    const handleBlur = () => {
      handleEditTodo();
    };

    const inputClassName = classNames({
      'todoapp__new-todo': !ref,
      'todo__title-field': ref,
    });

    const inputPlaceholder = ref
      ? 'Empty todo will be deleted'
      : 'What needs to be done?';

    return (
      <form onSubmit={handleAddTodoSubmit}>
        <input
          ref={ref}
          type="text"
          className={inputClassName}
          placeholder={inputPlaceholder}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={loading}
          onKeyDown={ref ? handleKeyDown : () => { }}
          onBlur={ref ? handleBlur : () => { }}
        />
      </form>
    );
  },
);
