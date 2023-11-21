import { useContext } from 'react';
import { TodoContext } from '../components/TodoProvider';

export const useTodo = () => {
  const todoContextValues = useContext(TodoContext);

  return todoContextValues;
};
