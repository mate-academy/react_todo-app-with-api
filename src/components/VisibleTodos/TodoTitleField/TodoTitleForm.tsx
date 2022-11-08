import React, {
  useContext, useEffect, useRef, useCallback,
} from 'react';
import { Todo } from '../../../types/Todo';
import { TodoUpdateContext } from '../../ContextProviders/TodoProvider';

type Props = {
  todo: Todo,
};

export const TodoTitleForm: React.FC<Props> = ({ todo }) => {
  const { title, id } = todo;
  const newFormField = useRef<HTMLInputElement>(null);
  const {
    handleChangeTitle,
    handleTitleUpdate,
    setTodoInputStatus,
    unsaveTitle,
  } = useContext(TodoUpdateContext);

  const handleKeys = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      unsaveTitle();
      setTodoInputStatus(false, null, null);
    }

    if (event.key === 'Enter') {
      handleTitleUpdate(null, todo);
    }
  }, []);

  const handleFocus = useCallback(() => {
    document.addEventListener('keydown', handleKeys);
  }, []);

  useEffect(() => {
    if (newFormField.current) {
      newFormField.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeys);
    };
  }, []);

  return (
    <form onSubmit={
      (event) => handleTitleUpdate(event, todo)
    }
    >
      <input
        data-cy="TodoTitleField"
        ref={newFormField}
        type="text"
        className="todo__title todo__title-field"
        placeholder="Empty todo will be deleted"
        value={title}
        onChange={(event) => handleChangeTitle(event, id)}
        onBlur={() => handleTitleUpdate(null, todo)}
        onFocus={handleFocus}
      />
    </form>
  );
};
