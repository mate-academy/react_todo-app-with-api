import React, { useContext, useEffect, useRef, useState } from 'react';
import { todosApi } from '../../api/todos';
import { ClientTodo, Todo } from '../../types';
import { TodosDispatchContext } from '../../contexts/TodosContext';
import { ErrorContext } from '../../contexts/ErrorContext';
import { FormInputContext } from '../../contexts/FormInputContext';
import { useCreateAction } from '../../hooks/useCreateAction';

export const useTodoItem = (todo: ClientTodo) => {
  const todosDispatch = useContext(TodosDispatchContext);
  const { setError } = useContext(ErrorContext);
  const { focus: focusFormInput } = useContext(FormInputContext);
  const [isBeingEdited, setIsBeingEditting] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const changeTitleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isBeingEdited) {
      changeTitleInput.current?.focus();
    }
  }, [isBeingEdited]);

  const updateTodo = useCreateAction(
    async (updatedTodo: Partial<Todo> & Pick<Todo, 'id'>) => {
      todosDispatch({
        type: 'update',
        payload: { ...todo, loading: true },
      });

      try {
        const receivedTodo = await todosApi.patch(updatedTodo);

        todosDispatch({
          type: 'update',
          payload: { ...receivedTodo, loading: false },
        });

        return receivedTodo;
      } catch (error) {
        setError({ message: 'Unable to update a todo' });
        todosDispatch({
          type: 'update',
          payload: { ...todo, loading: false },
        });

        throw error;
      }
    },
  );

  const deleteTodo = useCreateAction(async () => {
    todosDispatch({
      type: 'update',
      payload: { ...todo, loading: true },
    });

    try {
      await todosApi.delete(todo.id);
      todosDispatch({ type: 'delete', payload: todo.id });
    } catch (error) {
      setError({ message: 'Unable to delete a todo' });
    } finally {
      focusFormInput();
    }
  });

  const handleSave = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      deleteTodo();

      return;
    }

    if (trimmedTitle === todo.title) {
      setTitle(todo.title);
      setIsBeingEditting(false);

      return;
    }

    updateTodo({ id: todo.id, title: trimmedTitle })
      .then(newTodo => {
        setTitle(newTodo.title);
        setIsBeingEditting(false);
      })
      .catch(() => setTitle(todo.title));
  };

  const handleToggle = () => {
    updateTodo({
      id: todo.id,
      completed: !todo.completed,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsBeingEditting(false);
      setTitle(todo.title);
    }
  };

  const handleDeleteButtonClick = () => {
    deleteTodo().finally(focusFormInput);
  };

  const handleDoubleClick = () => {
    setIsBeingEditting(true);
  };

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return {
    changeTitleInput,
    handleKeyDown,
    handleSave,
    handleToggle,
    isBeingEdited,
    title,
    handleDeleteButtonClick,
    changeTitle,
    handleDoubleClick,
  };
};
