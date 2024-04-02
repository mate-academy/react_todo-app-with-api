import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { createTodo } from '../../api/todos';
import { USER_ID } from '../../utils/consts';
import { TodoError } from '../../types/errors';

interface Props {
  setError: (errorMessage: string) => void;
  addTodo: (todo: Todo) => void;
  handleTempTodo: (todo: Todo | null) => void;
  todos: Todo[];
}

export const TodoForm: React.FC<Props> = (props) => {
  // eslint-disable-next-line object-curly-newline
  const { setError, addTodo, handleTempTodo, todos } = props;

  const [newTitle, setNewTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), [todos.length, disableInput]);

  function approveTodoSave(todo: Todo): void {
    addTodo(todo);
    setNewTitle('');
    setDisableInput(false);
    handleTempTodo(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>):void {
    event.preventDefault();

    const value = newTitle.trim();

    if (!value) {
      setError(TodoError.EmptyTitle);
      setNewTitle('');

      return;
    }

    const todo: Partial<Todo> = {
      title: value,
      completed: false,
      userId: USER_ID,
    };

    setDisableInput(true);
    handleTempTodo({
      id: 0, title: value, completed: false, userId: 0,
    });

    createTodo(todo)
      .then(approveTodoSave)
      .catch(() => setError(TodoError.AddTodo))
      .finally(() => {
        setDisableInput(false);
        handleTempTodo(null);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        placeholder="What needs to be done?"
        ref={inputRef}
        disabled={disableInput}
      />
    </form>
  );
};
