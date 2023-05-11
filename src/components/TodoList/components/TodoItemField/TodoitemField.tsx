import { useRef, FC, useEffect } from 'react';
import { GetValue, KeyUp, MultiSubmit } from '../../../../types/functions';

interface Props {
  value: string;
  onKeyUp: KeyUp;
  onChange: GetValue;
  onSubmit: MultiSubmit;
}

export const TodoItemField: FC<Props> = ({
  value,
  onKeyUp,
  onSubmit,
  onChange,
}) => {
  const input = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <input
        ref={input}
        type="text"
        value={value}
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        onBlur={onSubmit}
        onKeyUp={onKeyUp}
        onChange={e => onChange(e.target.value)}
      />
    </form>
  );
};
