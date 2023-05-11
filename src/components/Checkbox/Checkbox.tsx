import { Todo } from '../../types/Todo';
import { GetTodo } from '../../types/functions';

interface Props {
  todoInfo: Todo,
  checked: boolean;
  labelClassName: string;
  inputClassName: string;
  onChange: GetTodo;
}

export const Checkbox: React.FC<Props> = ({
  checked,
  todoInfo,
  inputClassName,
  labelClassName,
  onChange,
}) => (
  <label className={labelClassName}>
    <input
      type="checkbox"
      checked={checked}
      className={inputClassName}
      onChange={() => onChange(todoInfo)}
      data-cy="TodoStatus"
    />
  </label>
);
