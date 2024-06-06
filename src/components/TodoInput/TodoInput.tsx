/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { USER_ID, createTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Context } from '../Context/Context';

type Props = {
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoInput: React.FC<Props> = ({ setTempTodo, inputRef }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const { todos, setTodos, setErrorMessage } = useContext(Context);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);

    if (newTodo.title !== '') {
      setTempTodo({ ...newTodo, id: 0 });

      return createTodo(newTodo)
        .then(createdTodo => {
          setTodos(prev => [...prev, createdTodo]);
          setTempTodo(null);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTempTodo(null);
        })
        .finally(() => {
          setIsLoading(false);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        });
    } else {
      setErrorMessage('Title should not be empty');
    }

    setIsLoading(false);

    return null;
  };

  const todoToCreate = {
    title: title.trim(),
    userId: USER_ID,
    completed: false,
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(todoToCreate);
  };

  const switchCompleted = () => {
    const val = todos.filter(t => t.completed).length !== todos.length;

    todos.map(todo => {
      updateTodo({ completed: val }, todo.id)
        .then(updatedTodo => {
          setTodos(prev => {
            const prevTodos = [...prev];
            const index = prevTodos.findIndex(t => t.id === updatedTodo.id);

            prevTodos.splice(index, 1, updatedTodo);

            return prevTodos;
          });
        })
        .catch(() => setErrorMessage('Unable to update a todo'));
    });
  };

  useEffect(() => {
    if (title !== '') {
      setErrorMessage('');
    }
  }, [title, setErrorMessage]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active:
            todos.filter(t => t.completed).length === todos.length &&
            !!todos.length,
        })}
        data-cy="ToggleAllButton"
        onClick={switchCompleted}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={isLoading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
