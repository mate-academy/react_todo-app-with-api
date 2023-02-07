import React, {
  Dispatch,
  memo,
  SetStateAction,
  useState,
  KeyboardEvent,
  SyntheticEvent,
  useRef,
  useEffect,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todoId: number,
  updateTodo: (
    todoId: number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
  prevTitle: string
  setIsTitleUpdating: Dispatch<SetStateAction<boolean>>,
  deleteTodo: (value: number) => Promise<void>,
};

export const TodoTitleField: React.FC<Props> = memo(({
  todoId,
  updateTodo,
  prevTitle,
  setIsTitleUpdating,
  deleteTodo,
}) => {
  const [newTitle, setNewTitle] = useState(prevTitle);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const confirmEditing = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      deleteTodo(todoId);
      setIsTitleUpdating(false);
    }

    if (prevTitle === newTitle) {
      setIsTitleUpdating(false);

      return;
    }

    await updateTodo(todoId, { title: newTitle });
    setIsTitleUpdating(false);
  };

  const handleKeysEvents = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsTitleUpdating(false);
    }
  };

  return (
    <form
      onSubmit={confirmEditing}
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        ref={titleField}
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        onBlur={confirmEditing}
        onKeyDown={handleKeysEvents}
      />
    </form>
  );
});
