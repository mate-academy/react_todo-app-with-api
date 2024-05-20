import { useEffect, useRef, useState } from 'react';
import { useAppContext } from './useAppContext';
import { deleteTodos, updateTodos } from '../helpers';
import { Todo } from '../types';

export const useTodoItemLogic = (todo: Todo) => {
  const { id, title, completed } = todo;

  const { setErrorType, setTodos, todoDeleteId, inputRef } = useAppContext();

  const [isDeleting, setIsDeleting] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [newTitle, setNewTitle] = useState(title);

  const inputRefForm = useRef<HTMLInputElement>(null);

  const deletingThisTodo = todoDeleteId?.includes(todo.id);

  const trimmedTitle = newTitle.trim();

  useEffect(() => {
    if (showForm) {
      inputRefForm.current?.focus();
    }
  }, [showForm]);

  const onDoubleClick = () => {
    setShowForm(true);
  };

  const onDeleteClick = async () => {
    try {
      setIsDeleting(true);

      await deleteTodos(todo.id);

      setTodos(prevState => prevState.filter(el => el.id !== todo.id));
      inputRef.current?.focus();
    } catch (err) {
      setErrorType('delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const onCompletedClick = async () => {
    try {
      setIsDeleting(true);

      await updateTodos(id, {
        ...todo,
        completed: !completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(currTodo => {
          if (currTodo.id === id) {
            return {
              ...currTodo,
              completed: !completed,
            };
          }

          return currTodo;
        }),
      );
    } catch (err) {
      setErrorType('update');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    setNewTitle(trimmedTitle);

    if (trimmedTitle === title) {
      setShowForm(false);

      return;
    }

    if (trimmedTitle === '') {
      await onDeleteClick();

      return;
    }

    try {
      setIsDeleting(true);

      await updateTodos(id, { ...todo, title: newTitle });

      setTodos(currentTodos =>
        currentTodos.map(currTodo => {
          if (currTodo.id === id) {
            return {
              ...currTodo,
              title: newTitle,
            };
          }

          return currTodo;
        }),
      );
      setShowForm(false);
    } catch (err) {
      setErrorType('update');
      inputRefForm.current?.focus();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBlur = () => {
    if (trimmedTitle !== title) {
      handleFormSubmit();
    } else {
      setShowForm(false);
      setNewTitle(trimmedTitle);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setShowForm(false);
      setNewTitle(title);
    }
  };

  return {
    onDoubleClick,
    onCompletedClick,
    handleBlur,
    handleKeyUp,
    deletingThisTodo,
    showForm,
    handleFormSubmit,
    inputRefForm,
    newTitle,
    setNewTitle,
    onDeleteClick,
    isDeleting,
  };
};
