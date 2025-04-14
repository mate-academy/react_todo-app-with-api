type Props = {
  handleChangeTodo: (e: React.FormEvent) => void;
  title: string;
  editFieldRef: React.RefObject<HTMLInputElement>;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditTodo = ({
  handleChangeTodo,
  title,
  editFieldRef,
  setIsEdited,
}: Props) => {
  return (
    <form onSubmit={handleChangeTodo}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        defaultValue={title}
        onBlur={handleChangeTodo}
        ref={editFieldRef}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            setIsEdited(false);
          }
        }}
      />
    </form>
  );
};

export default EditTodo;
