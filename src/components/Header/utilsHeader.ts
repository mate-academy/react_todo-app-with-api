import { setNewTempTodo } from '../../app/features/tempTodoSlice';
import {
  addNewTodo,
  changeTodo,
  setNewError,
  setNewTodos,
  setToggling,
  UpdateTodos,
} from '../../app/features/todosSlice';
import { AppDispatch } from '../../app/store';
import { Todo } from '../../types/Todo';
import { IsActiveError } from '../../types/types';

interface AddParams {
  event: React.FormEvent<HTMLFormElement>;
  query: string;
  dispatch: AppDispatch;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export function handleAddTodo(params: AddParams) {
  params.event.preventDefault();

  if (params.query) {
    params.setIsDisabled(true);
    params.dispatch(
      setNewTempTodo({
        id: 0,
        title: params.query.trim(),
        completed: false,
        userId: 833,
      }),
    );

    params
      .dispatch(
        addNewTodo({
          userId: 833,
          title: params.query.trim(),
          completed: false,
        }),
      )
      .unwrap()
      .then(() => {
        params.setQuery('');
      })
      .finally(() => {
        params.dispatch(setNewTempTodo(null));
        params.setIsDisabled(false);
      });
  } else {
    params.dispatch(setNewError(IsActiveError.Empty));
  }
}

interface ToggleParams {
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  todos: Todo[];
  dispatch: AppDispatch;
}

export function handleToggleAll(params: ToggleParams) {
  params.event.preventDefault();

  params.dispatch(setToggling(true));

  const updatedTodos: number[] = [];
  const isAllCompleted = params.todos.every(todo => todo.completed);
  const activeTodos = params.todos.filter(todo => !todo.completed);

  const newList = (a: boolean) => {
    return params.todos.map(todo => {
      return updatedTodos.includes(todo.id) ? { ...todo, completed: a } : todo;
    });
  };

  const arrayOfPromises = (list: Todo[], isDone: boolean) => {
    return list.map(todo => {
      const data: UpdateTodos = {
        todoId: todo.id,
        newTodo: { ...todo, completed: isDone },
      };

      return params
        .dispatch(changeTodo(data))
        .unwrap()
        .then(() => {
          updatedTodos.push(todo.id);
        });
    });
  };

  async function toggleAll() {
    await Promise.all(arrayOfPromises(activeTodos, true)).finally(() => {
      params.dispatch(setToggling(false));
      params.dispatch(setNewTodos(newList(true)));
    });
  }

  async function untoggleAll() {
    await Promise.all(arrayOfPromises(params.todos, false)).finally(() => {
      params.dispatch(setToggling(false));
      params.dispatch(setNewTodos(newList(false)));
    });
  }

  return isAllCompleted ? untoggleAll() : toggleAll();
}
