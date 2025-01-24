import { RefObject, SetStateAction, useState } from 'react';
import { USER_ID } from '../api/todos';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Form } from './Form';
import { handleEdit } from '../functions';
import classNames from 'classnames';

interface HeaderProps {
  onError: React.Dispatch<SetStateAction<string | null>>;
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  formValue: string;
  changeFormValue: (value: string) => void;
  setloadTodo: (value: Todo | null) => void;
  inputRef: RefObject<HTMLInputElement>;
  handleFocus: () => void;
  todos: Todo[];
  isLoading: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Header: React.FC<HeaderProps> = ({
  onError,
  onTodos,
  formValue,
  changeFormValue,
  setloadTodo,
  inputRef,
  handleFocus,
  todos,
  isLoading,
}) => {
  const [isDisabled, setDisabled] = useState(false);

  async function handeSubmit(title: string) {
    if (title.trim().length === 0) {
      onError('Title should not be empty');

      return;
    }

    try {
      setDisabled(true);

      const tempTodo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      setloadTodo({ ...tempTodo, id: 0 });

      const newTodo = await addTodo(tempTodo);

      setloadTodo(null);
      onTodos(prev => [...prev, newTodo]);
      changeFormValue('');
    } catch (error: unknown) {
      onError('');
      setTimeout(() => onError('Unable to add a todo'), 0);
      setloadTodo(null);
    } finally {
      setDisabled(false);
      handleFocus();
    }
  }

  const handleToggleAll = async () => {
    try {
      let toggleTodos = [...todos];

      if (toggleTodos.some(el => !el.completed)) {
        toggleTodos = todos.filter(el => !el.completed);
      }

      const togglePromises = toggleTodos.map(todo =>
        handleEdit(
          todo,
          'completed',
          todos.some(el => !el.completed),
          isLoading,
          onTodos,
          onError,
        ),
      );

      await Promise.allSettled(togglePromises);
    } catch {
      onError('Unable to update a todo');
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(el => el.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <Form
        onSubmit={handeSubmit}
        fValue={formValue}
        onChange={changeFormValue}
        isDisabled={isDisabled}
        inputRef={inputRef}
      />
    </header>
  );
};
