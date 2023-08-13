import { FC } from 'react';

interface TextFieldProps {
  value: string,
  inputHandler?: (event: React.SyntheticEvent<EventTarget>) => void,
  isDisabled?: boolean,
}

export const TextField: FC<TextFieldProps> = ({
  value,
  isDisabled,
  inputHandler = () => {},
}) => {
  return (
    <input
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={value}
      onChange={inputHandler}
      disabled={isDisabled}
    />
  );
};
