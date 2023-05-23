type Props = {
  setIsEdit: (bool: boolean) => void;
  title: string;
  handleDeleteTodo: () => void;

};

export const NoEditedTodo: React.FC<Props> = ({
  setIsEdit,
  title,
  handleDeleteTodo,
}) => (
  <>
    <span
      role="button"
      className="todo__title"
      tabIndex={0}
      aria-label="Press Enter to edit the title"
      onKeyUp={(event) => {
        if (event.key === 'Enter') {
          setIsEdit(true);
        }
      }}
      onDoubleClick={() => setIsEdit(true)}
    >
      {title}
    </span>

    <button
      type="button"
      className="todo__remove"
      onClick={() => handleDeleteTodo()}
    >
      {'\u00d7'}
    </button>
  </>
);
