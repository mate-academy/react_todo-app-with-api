import { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../types/types';
import { updateTodos } from '../api/todos';
import { ErrorMessages } from '../types/enums';

export const useEditTodos = (
  handleDeleteTodos: (id: number) => Promise<void>,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setCurrentError: (error: ErrorMessages | '') => void,
  todos: Todo[],
  setLoadingTodos: Dispatch<SetStateAction<number[]>>,
) => {
  const [editTodoTitle, setEditTodoTitle] = useState('');
  const [activeTodoEdit, setActiveTodoEdit] = useState<number | null>(null);

  const handleEditTodo = async (todoId: number, editTitle: string) => {
    setLoadingTodos(prev => [...prev, todoId]);

    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        return;
      }

      if (todoToUpdate.title === editTitle.trim()) {
        setActiveTodoEdit(null);

        return;
      }

      if (editTitle.trim() === '') {
        await handleDeleteTodos(todoId);

        return;
      }

      const data = { ...todoToUpdate, title: editTitle.trim() };

      await updateTodos(data, todoId);
      setTodos(prev =>
        prev.map(todo =>
          todo.id === todoId ? { ...todo, title: editTitle.trim() } : todo,
        ),
      );
      setActiveTodoEdit(null);
    } catch (error) {
      setCurrentError(ErrorMessages.Update);
    } finally {
      setLoadingTodos(prev => {
        return prev.filter(id => id !== todoId);
      });
    }
  };

  return {
    handleEditTodo,
    editTodoTitle,
    activeTodoEdit,
    setActiveTodoEdit,
    setEditTodoTitle,
  };
};
