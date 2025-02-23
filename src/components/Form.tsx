import { ChangeEvent, FC, FormEvent, KeyboardEvent, RefObject } from 'react';

interface Props {
  value: string;
  inputRef?: RefObject<HTMLInputElement>;
  isLoading?: boolean;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  classNames?: string;
  onCancel?: (e: KeyboardEvent<HTMLInputElement>) => void;
  dataCy?: string;
}

export const Form: FC<Props> = props => {
  const {
    onSubmit,
    inputRef = null,
    isLoading = false,
    onChange,
    value,
    onBlur = () => {},
    classNames,
    onCancel = () => {},
    dataCy = 'NewTodoField',
  } = props;

  return (
    <form onSubmit={onSubmit} onBlur={onBlur}>
      <input
        data-cy={dataCy}
        type="text"
        className={classNames}
        placeholder="What needs to be done?"
        ref={inputRef}
        value={value}
        onChange={onChange}
        disabled={isLoading}
        onKeyUp={onCancel}
        autoFocus
      />
    </form>
  );
};
