import classNames from 'classnames';
import React from 'react';
import { updateTodoCompleted } from '../api/todos';
import { Todo } from '../types/Todo';
import { pause } from '../utils/methods';
import { NewTodoField } from './NewTodoField';

interface Props {
  todos: Todo[];
  sizeLeft: number;
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onErrorMessage: (v: string) => void;
  onMassLoader: (v: boolean) => void;
  onLoader: (v: boolean) => void;
  onTempTodo: (v: Todo | null) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  sizeLeft,
  onTodos,
  onErrorMessage,
  onMassLoader,
  onLoader,
  onTempTodo,
}) => {
  const handleChangeAll = async () => {
    const notCompletedTodos = todos.filter(e => !e.completed);

    try {
      onMassLoader(true);
      await pause();
      const todosToUpdate =
        notCompletedTodos.length > 0 ? notCompletedTodos : todos;

      const updatedTodos = await Promise.all(
        todosToUpdate.map(async e => {
          const newTodo = await updateTodoCompleted({
            id: e.id,
            completed: notCompletedTodos.length > 0 || sizeLeft !== 0,
          });

          return {
            ...e,
            completed: newTodo.completed,
          };
        }),
      );

      onTodos(prev =>
        prev.map(todo => {
          const updated = updatedTodos.find(
            updatedTodo => updatedTodo.id === todo.id,
          );

          return updated ? updated : todo;
        }),
      );
    } catch {
      onErrorMessage('Unable to update a todo');
    } finally {
      onMassLoader(false);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: sizeLeft === 0,
          })}
          // className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          onClick={handleChangeAll}
        />
      )}

      {/* Add a todo on form submit */}
      <NewTodoField
        onErrorMessage={onErrorMessage}
        onTempTodo={onTempTodo}
        onLoader={onLoader}
        onTodos={onTodos}
      />
    </header>
  );
};
