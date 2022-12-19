import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoModifier } from '../../types/TodoModifier';

interface Props {
  todos: Todo[];
  activeTodos: Todo[];
  completedTodos: Todo[];
  onTodoModify: (modifiedTodos: TodoModifier[]) => void;
}

export const TodosStatusToggler: React.FC<Props> = (props) => {
  const {
    todos,
    activeTodos,
    completedTodos,
    onTodoModify,
  } = props;

  const onClickHandler = () => {
    if (todos.length === completedTodos.length) {
      onTodoModify(completedTodos.map(todo => (
        { id: todo.id, completed: false }
      )));
    } else {
      onTodoModify(activeTodos.map(todo => (
        { id: todo.id, completed: true }
      )));
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      data-cy="ToggleAllButton"
      type="button"
      className={classNames(
        'todoapp__toggle-all',
        {
          active: !activeTodos.length,
        },
      )}
      onClick={onClickHandler}
    />
  );
};
