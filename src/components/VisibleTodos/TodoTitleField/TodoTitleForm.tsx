import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../../types/Todo';
import { TodoUpdateContext } from '../../TodoContext';

type Props = {
  todo: Todo,
  changeFormStatus: (status: boolean) => void,
  handleActiveTodoId: (id: number) => void,
};

export const TodoTitleForm: React.FC<Props> = ({
  todo, changeFormStatus, handleActiveTodoId,
}) => {
  const [currentTitle, setCurrentTitle] = useState(todo.title);
  const newFormField = useRef<HTMLInputElement>(null);
  const {
    setActiveIds,
    deleteTodos,
    modifyTodos,
  } = useContext(TodoUpdateContext);

  // handle title change
  const handleChangeTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => (
      setCurrentTitle(event.target.value)
    ), [],
  );

  // handle existing todo title change
  const handleTitleUpdate = useCallback(
    (event: React.FormEvent<HTMLFormElement> | null) => {
      setActiveIds([todo.id]);
      event?.preventDefault();

      if (todo.title === currentTitle.trim()) {
        setActiveIds([0]);
        handleActiveTodoId(0);

        return;
      }

      if (currentTitle.trim().length === 0) {
        deleteTodos([todo.id]);
      } else {
        modifyTodos([{ ...todo, title: currentTitle.trim() }]);
      }
    }, [currentTitle],
  );

  // handle submit changed title
  const handleSubmit = (event: React.FormEvent<HTMLFormElement> | null) => {
    handleTitleUpdate(event);
    changeFormStatus(false);
  };

  // handle button pressed (on escape cancel changes, on enter submit them)
  const handleKeys = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      changeFormStatus(false);
      handleActiveTodoId(0);
    }

    if (event.key === 'Enter' || event.key === 'NumpadEnter') {
      handleTitleUpdate(null);
    }
  };

  // auto focus on field create
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
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={currentTitle}
        onChange={handleChangeTitle}
        onBlur={() => handleSubmit(null)}
        onKeyDown={handleKeys}
      />
    </form>
  );
};
