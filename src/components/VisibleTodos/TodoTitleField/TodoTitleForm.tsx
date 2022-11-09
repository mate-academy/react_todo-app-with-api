import React, {
  useContext, useEffect, useRef,
} from 'react';
import { Todo } from '../../../types/Todo';
import { TodoUpdateContext } from '../../ContextProviders/TodoProvider';

type Props = {
  todo: Todo,
  changeFormStatus: (status: boolean) => void,
};

export const TodoTitleForm: React.FC<Props> = ({ todo, changeFormStatus }) => {
  const { title, id } = todo;
  const newFormField = useRef<HTMLInputElement>(null);
  const {
    handleChangeTitle,
    handleTitleUpdate,
    setTodoInputStatus,
    unsaveTitle,
  } = useContext(TodoUpdateContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement> | null) => {
    handleTitleUpdate(event, todo);
    changeFormStatus(false);
  };

  const handleKeys = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      unsaveTitle();
      changeFormStatus(false);
      setTodoInputStatus(0, null);
    }

    if (event.key === 'Enter' || event.key === 'NumpadEnter') {
      handleTitleUpdate(null, todo);
    }
  };

  useEffect(() => {
    if (newFormField.current) {
      newFormField.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        ref={newFormField}
        type="text"
        className="todo__title todo__title-field"
        placeholder="Empty todo will be deleted"
        value={title}
        onChange={(event) => handleChangeTitle(event, id)}
        onBlur={() => handleSubmit(null)}
        onKeyDown={handleKeys}
      />
    </form>
  );
};
