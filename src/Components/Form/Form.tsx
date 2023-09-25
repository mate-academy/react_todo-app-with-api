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
  onSubmit,
  forCypress,
  ...props
}, ref) => (
  <form onSubmit={onSubmit}>
    <input
      data-cy={forCypress}
      type="text"
      placeholder={placeholder}
      onChange={onInputChange}
      ref={ref}
      {...props}
    />
  </form>
));
