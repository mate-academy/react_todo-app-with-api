import { FC } from 'react';

interface TextFieldProps {
  value: string,
  onChange?: (value: string) => void,
  isDisabled?: boolean,
}

export const TextField: FC<TextFieldProps> = (props) => {
  const {
    value,
    isDisabled,
    onChange = () => {},
  } = props;

  return (
    <input
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={isDisabled}
    />
  );
};
