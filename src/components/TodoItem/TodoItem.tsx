import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { deleteTodos, patchTodos } from '../../api/todos';
import { ErrorType } from '../../types/type';

type Props = {
  todo: Todo;
  posts: Todo[];
  setPosts: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  resetError: () => void;
};

export const TodoItem: React.FC<Props> = ({
  posts, setPosts, setError, resetError, todo: todoProps,
}) => {
  const [onChange, setOnChange] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { id: idProps, completed, title } = todoProps;

  useEffect(() => {
    if (editing !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const onDoubleClick = (id: number) => {
    const selectedTodo = posts.find((todo: Todo) => todo.id === id);

    if (selectedTodo) {
      setEditing(id);
      setOnChange(selectedTodo.title);
    }
  };

  const handleCheckboxClick = (id: number) => {
    const todoIndex = posts.findIndex((todo: Todo) => todo.id === id);
    const newTodos = [...posts];

    newTodos[todoIndex] = {
      ...newTodos[todoIndex],
      completed: !newTodos[todoIndex].completed,
    };
    setPosts(newTodos);

    return patchTodos(id, newTodos[todoIndex])
      .catch((error) => {
        setPosts(posts);
        setError((prevState: ErrorType) => ({
          ...prevState,
          updateTodo: true,
        }));
        resetError();
        throw error;
      });
  };

  const handleSubmit = (event: React.FormEvent, id: number) => {
    event.preventDefault();

    if (!onChange.trim()) {
      const newTodos = posts.filter((todo: Todo) => todo.id !== editing);

      setPosts([...newTodos]);

      setOnChange('');
      setEditing(null);

      return deleteTodos(id)
        .catch((error) => {
          setPosts(posts);
          setError((prevState: ErrorType) => ({
            ...prevState,
            deleteTodo: true,
          }));
          resetError();
          throw error;
        });
    }

    const todoIndex = posts
      .findIndex((todo: Todo) => (todo.id === id && todo.id === editing));
    const newTodos = [...posts];

    newTodos[todoIndex] = {
      ...newTodos[todoIndex],
      title: onChange,

    };
    setPosts(newTodos);
    setEditing(null);

    return patchTodos(id, newTodos[todoIndex])
      .catch((error) => {
        setPosts(posts);
        setError((prevState: ErrorType) => ({
          ...prevState,
          updateTodo: true,
        }));
        resetError();
        setEditing(id);
        throw error;
      });
  };

  const handleDeletePost = (id: number) => {
    setPosts(currentPosts => currentPosts.filter(post => id !== post.id));

    return deleteTodos(id)
      .catch((error) => {
        setPosts(posts);
        setError((prevState: ErrorType) => ({
          ...prevState,
          deleteTodo: true,
        }));
        resetError();
        throw error;
      });
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: string = event.target.value;

    newValue = newValue.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '');

    setOnChange(newValue);
  };

  const handleKeyUp = (event: React.KeyboardEvent, id: number) => {
    if (event.key === 'Escape') {
      const newTodo = posts.map((todo: Todo) => {
        if (todo.id === id && todo.id === editing) {
          setEditing(null);

          return {
            ...todo,
          };
        }

        return { ...todo };
      });

      setPosts([...newTodo]);
    }
  };

  return (
    <div
      data-cy="Todo"
      onDoubleClick={() => onDoubleClick(idProps)}
      className={classNames(
        'todo',
        {
          completed,
          editing: idProps === editing,
        },
      )}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCheckboxClick(idProps)}
        />
      </label>

      <div className={classNames(
        'todo__title',
        {
          'is-hidden': idProps === editing,
        },
      )}
      >
        <span
          data-cy="TodoTitle"
        >
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeletePost(idProps)}
        >
          ×
        </button>
      </div>
      <form
        onSubmit={(event) => handleSubmit(event, idProps)}
      >
        <input
          type="text"
          className={
            classNames('edit', {
              'todo__title-field': idProps === editing,
              'is-hidden': idProps !== editing,
            })
          }
          value={onChange}
          onChange={handleOnChange}
          onKeyUp={(event) => handleKeyUp(event, idProps)}
          onBlur={(event) => handleSubmit(event, idProps)}
          ref={inputRef}
        />
      </form>
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
