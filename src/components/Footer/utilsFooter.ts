import { removeTodo, setClearing } from '../../app/features/todosSlice';
import { AppDispatch } from '../../app/store';
import { Todo } from '../../types/Todo';

interface DeleteAllParams {
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  dispatch: AppDispatch;
  todos: Todo[];
}

export function handleDeleteAll(params: DeleteAllParams) {
  params.event.preventDefault();

  params.dispatch(setClearing(true));

  const completedTodos = params.todos.filter(todo => todo.completed);

  const arrayOfPromises = () => {
    return completedTodos.map(todo => {
      return params
        .dispatch(removeTodo(todo.id))
        .unwrap()
        .finally(() => {
          params.dispatch(setClearing(false));
        });
    });
  };

  Promise.all(arrayOfPromises());
}
