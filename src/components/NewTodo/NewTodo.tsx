import { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onUpdateTodo: (todoId: number, todo: Todo) => void;
  onDeleteTodo: (value: number) => void;
  currentTodo: Todo;
  title: string;
  onTodoShowChange: (value: boolean) => void;
};

export const NewTodo: React.FC<Props> = ({
  onUpdateTodo,
  onDeleteTodo,
  currentTodo,
  title,
  onTodoShowChange,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onUpdateTodo(currentTodo.id, {
      ...currentTodo,
      title: newTitle,
      completed: false,
    });

    if (!newTitle) {
      onDeleteTodo(currentTodo.id);
    }

    onTodoShowChange(false);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        ref={newTodoField}
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={(event) => {
          setNewTitle(event.target.value);
        }}
      />
    </form>
  );
};
