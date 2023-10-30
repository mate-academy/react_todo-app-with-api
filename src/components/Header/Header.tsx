import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorsType } from '../../types/ErrorsType';

type HeaderProps = {
  addTodo: (newTitle: string) => void;
  todos: Todo[];
  changeTodo: (
    property: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    todoId: number,
  ) => void;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsType>>;
};

export const Header: React.FC<HeaderProps> = ({
  addTodo,
  todos,
  changeTodo,
  setErrors,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const isAllCompleted = todos.every(todo => todo.completed === true);

  const clearForm = () => {
    setNewTitle('');
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle.trim()) {
      addTodo(newTitle);
    } else if (newTitle.trim() === '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        empty: true,
      }));
    }

    clearForm();
  };

  const toggleAll = () => {
    if (isAllCompleted) {
      todos.forEach(todo => {
        changeTodo('completed', false, todo.id);
      });
    } else {
      todos.forEach(todo => {
        changeTodo('completed', true, todo.id);
      });
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isAllCompleted },
        )}
        aria-label="toggle-all-active"
        onClick={toggleAll}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handleChangeTitle}
        />
      </form>
    </header>
  );
};
