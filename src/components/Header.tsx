import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ChangeEvent, FormEvent } from 'react';

type Props = {
  filteredTodoList: Todo[];
  submitTodo: (e: FormEvent<Element>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  loader: boolean;
  handleToogleAll: () => void;
  todoList: Todo[];
};

export const Header: React.FC<Props> = ({
  submitTodo,
  inputRef,
  title,
  handleChangeInput,
  loader,
  handleToogleAll,
  todoList,
}) => {
  return (
    <header className="todoapp__header">
      {todoList.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active:
              todoList.length > 0 && todoList.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToogleAll}
        />
      )}

      <form onSubmit={submitTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeInput}
          disabled={loader}
          autoFocus
        />
      </form>
    </header>
  );
};
