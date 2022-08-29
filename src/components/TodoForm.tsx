/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  Dispatch, FC, LegacyRef, SetStateAction,
} from 'react';
import { createTodo } from '../api/todos';
import { Todo, TodoOptimistic } from '../types/Todo';
import { User } from '../types/User';

interface Props {
  newTodoField: LegacyRef<HTMLInputElement> | undefined,
  user: User,
  onAdd: (todo: Todo) => void;
  onAddOptimistic: (todo: TodoOptimistic) => void;
  deleteOptimistic: () => void;
  setErrorMessages: Dispatch<SetStateAction<string []>>,
  todoTitle: string,
  setTodoTitle: (todoTitle: string) => void,
}

export const TodoForm: FC<Props> = (props) => {
  const {
    newTodoField,
    user,
    onAdd,
    onAddOptimistic,
    deleteOptimistic,
    setErrorMessages,
    todoTitle,
    setTodoTitle,
  } = props;

  const clearInput = () => setTodoTitle('');

  const submitHandler = () => {
    onAddOptimistic({
      title: todoTitle,
    });

    if (!todoTitle.length) {
      setErrorMessages((prev: string []) => [...prev, 'Title can\'t be empty']);

      return;
    }

    createTodo({
      title: todoTitle,
      userId: user.id,
      completed: false,
    })
      .then(onAdd)
      .finally(() => {
        deleteOptimistic();
        clearInput();
      });
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        submitHandler();
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
