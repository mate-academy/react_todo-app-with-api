type Props = {
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
  title: string;
  id: number;
};

const TodoDisplay = ({ setIsEdited, title, id, handleDelete }: Props) => {
  return (
    <>
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => setIsEdited(true)}
      >
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>
    </>
  );
};

export default TodoDisplay;
