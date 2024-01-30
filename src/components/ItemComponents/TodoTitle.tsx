type Props = {
  title: string
  onEdit: (val: boolean) => void
};

export const TodoTitle: React.FC<Props> = ({ title, onEdit }) => {
  return (
    <span
      data-cy="TodoTitle"
      className="todo__title"
      onDoubleClick={() => onEdit(true)}
    >
      {title}
    </span>
  );
};
