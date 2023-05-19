// eslint-disable-next-line object-curly-newline
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { USER_ID } from '../../constants/userid';
import { validateTitle } from '../../utils/validateTitle';
import { HeaderContext } from '../../context/HeaderContext';

export const NewTodo: React.FC = React.memo(() => {
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setErrorMessage, uploadTodo } = useContext(HeaderContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isInitialRender && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isInitialRender]);

  const handleInputTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTodoAddition = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const errorMessage = validateTitle(title, t);

    if (errorMessage) {
      setTitle('');
      setErrorMessage(errorMessage);
      setIsLoading(false);

      return;
    }

    const addedTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    const temporaryTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTitle('');
    await uploadTodo(addedTodo, temporaryTodo);
    setIsInitialRender(false);
    setIsLoading(false);
  };

  return (
    <form
      action="#"
      method="POST"
      onSubmit={handleTodoAddition}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder={t('NewTodo.placeholder') as string}
        value={title}
        onChange={handleInputTodo}
        disabled={isLoading}
        ref={inputRef}
      />
    </form>
  );
});
