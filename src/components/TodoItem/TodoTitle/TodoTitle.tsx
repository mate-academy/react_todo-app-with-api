interface Props {
  title: string;
  onDoubleClick: () => void;
  onDelete: () => void;
}

export const TodoTitle: React.FC<Props> = ({
  title,
  onDoubleClick,
  onDelete,
}) => {
  return (
    <>
      <span
        className="todo__title"
        onDoubleClick={onDoubleClick}
      >
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={onDelete}
      >
        ×
      </button>
    </>
  );
};
