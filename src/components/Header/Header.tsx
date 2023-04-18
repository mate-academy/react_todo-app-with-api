import {
  FC,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  onAdd: (title: string) => Promise<void>,
  tempTodo: Todo | null,
  activeTodos: number,
  handleUpdatingAll: () => void,
};

export const Header: FC<Props> = (props) => {
  const {
    onAdd,
    tempTodo,
    activeTodos,
    handleUpdatingAll,
  } = props;

  const [title, setTitle] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await onAdd(title);
    setTitle('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const isTodoLoading = tempTodo !== null;

  return (
    <header className="todoapp__header">
      <button
        aria-label="all"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !activeTodos },
        )}
        onClick={handleUpdatingAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isTodoLoading}
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>

  );
};
