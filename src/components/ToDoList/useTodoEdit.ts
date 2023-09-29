import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoService } from '../../api/todos';
import { useToDoContext } from '../../context/ToDo.context';
import { ErrorMessage } from '../../types/Error';

export const useTodoEdit = () => {
  const {
    editTodo,
    removeTodo,
    showError,
  } = useToDoContext();
  const [loadingList, setLoadingList] = useState<number[]>([]);

  const isLoading = (toDoId: number):boolean => loadingList
    .indexOf(toDoId) > -1;

  const setLoading = (todoId: number, state:boolean) => (state
    ? !isLoading(todoId) && setLoadingList(current => [...current, todoId])
    : setLoadingList(current => current.filter((id:number) => id !== todoId)));

  const saveTodo = (todo: Todo) => new Promise(resolve => {
    setLoading(todo.id, true);
    TodoService.editTodo(todo)
      .then(editTodo).then(resolve)
      .catch(() => showError(ErrorMessage.update))
      .finally(() => setLoading(todo.id, false));
  });

  const deleteTodo = (todo: Todo) => new Promise(resolve => {
    setLoading(todo.id, true);

    TodoService.deleteTodo(todo.id)
      .then(() => removeTodo(todo.id)).then(resolve)
      .catch(() => showError(ErrorMessage.delete))
      .finally(() => setLoading(todo.id, false));
  });

  return {
    isLoading,
    saveTodo,
    deleteTodo,
    setLoading,
  };
};
