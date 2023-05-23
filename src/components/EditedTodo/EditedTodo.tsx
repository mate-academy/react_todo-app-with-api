import { MutableRefObject } from 'react';

type Props = {
  handleTitleChange: () => void;
  editedTitle: string;
  setEditedTitle: (event: string) => void;
  cancelTitleChange: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  editFormRef: MutableRefObject<HTMLInputElement | null>;
};

export const EditedTodo: React.FC<Props> = ({
  handleTitleChange,
  editedTitle,
  setEditedTitle,
  cancelTitleChange,
  editFormRef,
}) => (
  <>
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleTitleChange();
      }}
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedTitle}
        onChange={(event) => setEditedTitle(event.target.value)}
        onBlur={handleTitleChange}
        onKeyUp={cancelTitleChange}
        ref={editFormRef}
      />
    </form>
  </>
);
