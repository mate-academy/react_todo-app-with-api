import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { NewTodo } from '../newTodo/NewTodo';
import classNames from 'classnames';

type Props = {
  isCompletedTodo: boolean;
  addPost: (title: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  shouldFocus: boolean;
  todoList: Todo[];
  updatePost: (todo: Todo) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  todoList,
  isCompletedTodo,
  addPost,
  setError,
  shouldFocus,
  updatePost,
}) => {
  const [status, setStatus] = useState(true);

  useEffect(() => {
    setStatus(!isCompletedTodo);
  }, [isCompletedTodo]);

  const toggleAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    Promise.all(
      todoList.map(todo => {
        if (todo.completed !== status) {
          const newTodo = {
            ...todo,
            completed: status,
          };

          updatePost(newTodo);
        }
      }),
    );
  };

  return (
    <header className="todoapp__header">
      {todoList.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isCompletedTodo,
          })}
          data-cy="ToggleAllButton"
          onClick={e => toggleAll(e)}
        />
      )}

      <NewTodo
        handleAdd={addPost}
        setError={setError}
        shouldFocus={shouldFocus}
      />
    </header>
  );
};
