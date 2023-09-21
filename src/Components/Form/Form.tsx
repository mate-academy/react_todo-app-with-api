import React from 'react';

type Props = {
  placeholder: string,
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  value: string,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  forCypress: string,
  className: string,
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

type Ref = HTMLInputElement | null;

export const Form = React.forwardRef<Ref, Props>(({
  placeholder,
  onInputChange,
  value,
  onSubmit,
  forCypress,
  className,
  onBlur = () => {},
  onKeyUp = () => {},
}, ref) => (
  <form onSubmit={onSubmit}>
    <input
      data-cy={forCypress}
      type="text"
      className={className}
      placeholder={placeholder}
      onChange={onInputChange}
      ref={ref}
      value={value}
      onBlur={onBlur}
      onKeyUp={onKeyUp}
    />
  </form>
));
