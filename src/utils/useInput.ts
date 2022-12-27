import { useState } from 'react';

function useInput(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setValue(event.target.value);
  };

  const cancelChange = (title: string) => {
    setValue(title);
  };

  const clearInput = () => {
    setValue('');
  };

  return {
    value,
    onChange,
    clearInput,
    cancelChange,
  };
}

export { useInput };
