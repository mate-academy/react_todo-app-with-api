import { UpdateTodo } from '../types/UpdateTodo';
import { updateTodoValues } from './updateTodoValues';
import { deleteTodoInTodoList } from './deleteTodoFromList';

export const updateTodoOnClick = async ({
  newData,
  setTodoLoading,
  setTodos,
  setErrorMessage,
  id,
  onSave,
}: UpdateTodo) => {
  if (typeof newData === 'string') {
    if (!newData.length) {
      await deleteTodoInTodoList(id, setTodoLoading, setErrorMessage, setTodos);
    } else {
      await updateTodoValues({
        keyValue: 'title',
        setErrorMessage,
        setTodoLoading,
        setTodos,
        id,
        newData,
      });
      onSave?.();
    }
  } else {
    await updateTodoValues({
      keyValue: 'completed',
      setErrorMessage,
      setTodoLoading,
      setTodos,
      id,
      newData,
    });
  }
};
