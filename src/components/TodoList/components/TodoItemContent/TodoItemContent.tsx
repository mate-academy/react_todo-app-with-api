import { GetId } from '../../../../types/functions';

interface Props {
  id: number;
  title: string;
  handleRename: GetId;
  handleRemove: GetId;
}

export const TodoItemContent: React.FC<Props> = ({
  id,
  title,
  handleRename,
  handleRemove,
}) => (
  <>
    <span
      className="todo__title"
      onDoubleClick={() => handleRename(id)}
      aria-hidden="true"
    >
      {title}
    </span>

    <button
      type="button"
      className="todo__remove"
      onClick={() => handleRemove(id)}
    >
      ×
    </button>
  </>
);
