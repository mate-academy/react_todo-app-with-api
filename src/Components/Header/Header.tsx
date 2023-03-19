import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Submits } from '../../types/Submits';

type Props = {
  todosLength: number;
  completedTodosLength: number;
  addNewTodo: (value: string) => Promise<void>;
  changeAllTodo: (completed: boolean) => void;
};

const Header: React.FC<Props> = ({
  todosLength,
  completedTodosLength,
  addNewTodo,
  changeAllTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [submitState, setSubmitState] = useState(Submits.none);
  const isActiveToggleAll = completedTodosLength === todosLength;

  useEffect(() => {
    if (submitState !== Submits.success) {
      return;
    }

    inputRef.current?.focus();
  }, [submitState]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitState(Submits.pending);
    addNewTodo(value)
      .finally(async () => {
        setValue('');
        setSubmitState(Submits.success);
      });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    setSubmitState(Submits.none);
  };

  const onCheckAllTodos = useMemo(() => {
    return () => {
      if (isActiveToggleAll) {
        changeAllTodo(false);
      } else {
        changeAllTodo(true);
      }
    };
  }, [isActiveToggleAll, changeAllTodo]);

  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          type="button"
          className={
            classNames(
              'todoapp__toggle-all',
              { active: isActiveToggleAll },
            )
          }
          onClick={onCheckAllTodos}
          aria-label="select all"
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={submitState === Submits.pending}
        />
      </form>
    </header>
  );
};

export default Header;
