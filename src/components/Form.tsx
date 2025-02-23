import { ChangeEvent, KeyboardEvent, RefObject } from 'react';

interface FormProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef?: RefObject<HTMLInputElement>;
  isLoading?: boolean;
  addTodo?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBlur?: () => void;
  onCancel?: (e: KeyboardEvent<HTMLInputElement>) => void;
  classNames?: string;
  dataCy?: string;
}

export const Form: React.FC<FormProps> = ({
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
    <form onSubmit={addTodo} onBlur={onBlur}>
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
      />
    </form>
  );
};
