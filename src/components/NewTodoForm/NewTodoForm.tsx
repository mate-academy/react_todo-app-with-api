import { ChangeEvent, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { ErrorType } from '../../types/Errors';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addNewTodo,
  handleErrorNotification,
  setNewTodoTitle,
  setTempTodo,
} from '../../features/todosSlice';

export const NewTodoForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const newTodoTitle = useAppSelector(state => state.todos.newTodoTitle);
  const isSubmitting = useAppSelector(state => state.todos.isSubmitting);
  const editingId = useAppSelector(state => state.todos.editingId);
  const updatingId = useAppSelector(state => state.todos.updatingId);

  useEffect(() => {
    if (inputRef.current && !editingId && !updatingId) {
      inputRef.current.focus();
    }
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      dispatch(handleErrorNotification(ErrorType.EMPTY_TITLE));
      setTimeout(() => dispatch(handleErrorNotification('')), 3000);
      dispatch(setNewTodoTitle(''));

      return;
    }

    const newTodo: Todo = {
      id: +new Date(),
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    dispatch(addNewTodo(newTodo));
    setTimeout(() => dispatch(handleErrorNotification('')), 3000);

    dispatch(
      setTempTodo({
        id: 0,
        title: newTodoTitle.trim(),
        userId: USER_ID,
        completed: false,
      }),
    );
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    dispatch(setNewTodoTitle(event.target.value));
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={handleQueryChange}
        ref={inputRef}
        disabled={isSubmitting}
      />
    </form>
  );
};
