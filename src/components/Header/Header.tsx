/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React, {
  FormEvent, useEffect, useState,
} from 'react';
import cn from 'classnames';
import { addTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Error';
import { Toggler } from '../../types/toggle';

interface Props {
  setTodos: (newTodos: Todo[] | ((prevValue: Todo[]) => Todo[])) => void
  todos: Todo[]
  setError: (value: string) => void,
  setTempTodo: (value: Todo | null) => void,
  temptodo: Todo | null
  setToggled: (value: string) => void
  titleField: React.MutableRefObject<HTMLInputElement | null>;
}

export const Header: React.FC<Props> = ({
  setTodos,
  todos,
  setError,
  setTempTodo,
  temptodo,
  setToggled,
  titleField,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [temptodo, titleField]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Errors.title);

      return;
    }

    setTempTodo({
      id: 0,
      userId: 11843,
      title: title.trim(),
      completed: false,
    });

    addTodo({
      userId: 11843,
      title: title.trim(),
      completed: false,
    }).then((todo) => {
      setTodos([...todos, todo]);
      setTitle('');
    })
      .catch(() => setError(Errors.unableAdd))
      .finally(() => {
        setTempTodo(null);
      });
  };

  const inactive = todos.some(todo => !todo.completed);

  const toggle = () => {
    const toggled = [...todos];

    setToggled(inactive ? Toggler.completed : Toggler.incompleted);
    toggled.forEach(todo => {
      if (todo.id) {
        if (!inactive || !todo.completed) {
          updateTodo(todo.id, { completed: inactive })
            .then(ftodo => {
              const index = toggled.findIndex(itodo => itodo.id === todo.id);

              toggled.splice(index, 1, ftodo);
              setTodos([...toggled]);
            }).finally(() => setToggled(''));
        }
      }
    });
  };

  return (

    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}

      {
        todos.length > 0 && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: !inactive })}
            data-cy="ToggleAllButton"
            onClick={toggle}
          />
        )
      }

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          disabled={temptodo !== null}
          value={title}
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
