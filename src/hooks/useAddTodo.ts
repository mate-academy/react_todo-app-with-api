import { RefObject, useState, Dispatch, FormEvent } from 'react';
import { addTodos } from '../api/todos';
import { ErrorMessages, Todo, USER_ID } from '../types';

type Props = {
  onSetError: (error: ErrorMessages) => void;
  onSetTodoIdLoading: Dispatch<React.SetStateAction<number[]>>;
  onSetDisableInput: (loading: boolean) => void;
  onSetPreparedTodos: Dispatch<React.SetStateAction<Todo[]>>;
};

export const useAddTodo = ({
  onSetError,
  onSetTodoIdLoading,
  onSetDisableInput,
  onSetPreparedTodos,
}: Props) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    inputRef: RefObject<HTMLInputElement>,
  ) => {
    event.preventDefault();

    if (!inputText.trim()) {
      onSetError(ErrorMessages.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputText.trim(),
      completed: false,
    };

    onSetDisableInput(true);
    onSetPreparedTodos(prev => [...prev, { ...newTodo, id: 0 }]); //create temp todo
    onSetTodoIdLoading([0]);

    try {
      const response = await addTodos(newTodo);

      setInputText('');
      newTodo.id = response.id;
      onSetPreparedTodos(prev => [...prev, { ...newTodo }]); //add newTodo in list
    } catch {
      onSetError(ErrorMessages.Add);
    } finally {
      onSetDisableInput(false);
      onSetTodoIdLoading([]);
      onSetPreparedTodos(prev => prev.filter(i => i.id !== 0)); //delete temp todo
      inputRef.current?.focus();
    }
  };

  return {
    inputText,
    setInputText,
    handleSubmit,
  };
};
