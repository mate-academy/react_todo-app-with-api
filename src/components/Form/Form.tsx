import { ChangeEvent, KeyboardEvent, RefObject } from 'react';

type Props = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef?: RefObject<HTMLInputElement>;
  isLoading?: boolean;
  addTodo?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBlur?: () => void;
  onCancel?: (e: KeyboardEvent<HTMLInputElement>) => void;
  classNames?: string;
  dataCy?: string;
};

export const Form: React.FC<Props> = ({
  addTodo,
  value,
  onChange,
  inputRef = null,
  isLoading = false,
  onBlur = () => {},
  onCancel = () => {},
  classNames,
  dataCy = 'NewTodoField',
}) => {
  return (
    <form onSubmit={addTodo}>
      <input
        data-cy={dataCy}
        type="text"
        className={classNames}
        placeholder="What needs to be done?"
        value={value}
        onChange={onChange}
        ref={inputRef}
        disabled={isLoading}
        onKeyUp={onCancel}
        autoFocus
        onBlur={onBlur}
      />
    </form>
  );
};
