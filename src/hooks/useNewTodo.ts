import { ChangeEvent, useCallback, useState } from 'react';
import { Todo } from '../types';

export const useNewTodo = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadingNewTodoSubmit, setIsLoadingNewTodoSubmit] = useState(false);
  const [isFocusedNewTodoInput, setIsFocusedNewTodoInput] = useState(true);

  const handleNewTodoTitleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setNewTodoTitle(event.target.value);

  const resetNewTodoTitle = () => setNewTodoTitle('');

  const handleAddTempTodo = useCallback((todo: Todo) => setTempTodo(todo), []);

  const handleResetTempTodo = useCallback(() => setTempTodo(null), []);

  return {
    newTodoTitle,
    handleNewTodoTitleChange,
    tempTodo,
    handleAddTempTodo,
    handleResetTempTodo,
    resetNewTodoTitle,
    isLoadingNewTodoSubmit,
    setIsLoadingNewTodoSubmit,
    isFocusedNewTodoInput,
    setIsFocusedNewTodoInput,
  };
};
