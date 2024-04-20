import { Todo } from './types/Todo';

type Props = {
  editSelectedInput: React.RefObject<HTMLInputElement>;
  handleKeyUpInputEdit: (event: React.KeyboardEvent) => void;
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>;
  handleEditSubmit: (event: React.FormEvent, todo: Todo) => void;
  setIsEdited: React.Dispatch<React.SetStateAction<number | null>>;
  handleEditedTitle: (todo: Todo) => void;
  editedTitle: string;
  todo: Todo;
};

export const Form = ({
  handleEditedTitle,
  setIsEdited,
  editSelectedInput,
  handleKeyUpInputEdit,
  handleEditSubmit,
  todo,
  editedTitle,
  setEditedTitle,
}: Props) => {
  return (
    <form onSubmit={event => handleEditSubmit(event, todo)}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder={todo.title}
        value={editedTitle}
        onChange={event => setEditedTitle(event.target.value)}
        onKeyUp={handleKeyUpInputEdit}
        onBlur={() => {
          setIsEdited(null);
          handleEditedTitle(todo);
        }}
        ref={editSelectedInput}
      />
    </form>
  );
};
