/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ActiveForm } from './ActiveForm';
import { DefaultForm } from './DefaultForm';
import { handleDeleteTodo, handleUpdateTodo } from './utilsTodoItem';

interface TodoItemProps {
  todo: Todo;
  isTemp?: Todo | null;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, isTemp }) => {
  const { title, completed } = todo;

  const dispatch = useAppDispatch();
  const { isProcessing, processingTodoId, isToggling, todos, isClearing } =
    useAppSelector(state => state.todos);

  const [isFocused, setIsFocused] = React.useState(false);
  const [query, setQuery] = React.useState(title);

  const updateArguments = {
    query: query,
    todo: todo,
    completed: completed,
    title: title,
    dispatch: dispatch,
    setIsFocused: setIsFocused,
  };

  const editingArgs = {
    todo: todo,
    query: query,
    title: title,
    completed: completed,
    todoId: todo.id,
    setQuery: setQuery,
    setIsFocused: setIsFocused,
  };

  const isAllCompleted = React.useMemo(() => {
    todos.every(t => t.completed);
  }, [todos]);

  React.useEffect(() => {
    const keyEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFocused(false);
        setQuery(title);
      }
    };

    document.addEventListener('keyup', keyEvent);

    return () => {
      document.removeEventListener('keyup', keyEvent);
    };
  }, [title]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          readOnly
          checked={completed}
          onClick={event =>
            handleUpdateTodo({ ...updateArguments, event, newData: completed })
          }
        />
      </label>

      {isFocused ? (
        <ActiveForm
          query={query}
          editingArgs={editingArgs}
          setQuery={setQuery}
        />
      ) : (
        <DefaultForm
          query={query}
          todoId={todo.id}
          setIsFocused={setIsFocused}
          handleDeleteTodo={handleDeleteTodo}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (isClearing && todo.completed) ||
            (isToggling && isAllCompleted) ||
            (isToggling && !todo.completed) ||
            (isProcessing && processingTodoId === todo.id) ||
            (isProcessing && isTemp),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
