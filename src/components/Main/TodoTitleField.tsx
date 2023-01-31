import React, {
  Dispatch,
  memo,
  SetStateAction,
  useState,
  KeyboardEvent,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todoId: number,
  updateTodo: (
    todoId: number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => void,
  prevTitle: string
  setIsTitleUpdating: Dispatch<SetStateAction<boolean>>,
};

export const TodoTitleField: React.FC<Props> = memo(({
  todoId,
  updateTodo,
  prevTitle,
  setIsTitleUpdating,
}) => {
  const [newTitle, setNewTitle] = useState(prevTitle);

  const cancelEditing = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(() => prevTitle);
      setIsTitleUpdating(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        updateTodo(todoId, { title: newTitle });
      }}
    >
      <input
        type="text"
        className="todo__title"
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        onBlur={async () => {
          await updateTodo(todoId, { title: newTitle });
          setIsTitleUpdating(false);
        }}
        onKeyDown={cancelEditing}
      />
    </form>
  );
});
