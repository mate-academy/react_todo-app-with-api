import { useState } from 'react';
import { useToDoContext } from '../../context/ToDo.context';

export const useTodoList = () => {
  const { todos, temporaryTodo } = useToDoContext();
  const [loadingList, setLoadingList] = useState<number[]>([]);
  const [editedTodo, setEditedTodo] = useState<number | null>(null);

  const isEdited = (toDoId: number):boolean => editedTodo === toDoId;
  const editTodo = (todoId: number) => setEditedTodo(todoId);

  const isLoading = (toDoId: number):boolean => loadingList
    .indexOf(toDoId) > -1;

  const setLoading = (todoId: number, state:boolean) => (state
    ? !isLoading(todoId) && setLoadingList(current => [...current, todoId])
    : setLoadingList(current => current.filter((id:number) => id !== todoId)));

  return {
    todos,
    temporaryTodo,
    setLoading,
    isLoading,
    isEdited,
    editTodo,
    setEditedTodo,
    editedTodo,
  };
};
