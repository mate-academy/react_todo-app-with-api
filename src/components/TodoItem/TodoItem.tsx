/* eslint-disable no-console */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { AppDispatch, RootState } from '../../redux/store';
import { Todo } from '../../types/Todo';
import {
  deleteTodo,
  setCompletion,
} from '../../redux/todoThunks';

type TodoItemProps = {
  todo: Todo;
  isTemporary: boolean;
  isDeleting: boolean;
};

export const TodoItem = React.memo<TodoItemProps>(
  ({
    todo, isTemporary, isDeleting,
  }) => {
    console.log('item is temporary now', isTemporary);
    console.log('Rendering TodoItem');

    const dispatch = useDispatch<AppDispatch>();
    const updatingTodoIds = useSelector(
      (state: RootState) => state.todos.updatingTodoIds,
    );

    const handleDeleteTodo = () => {
      dispatch(deleteTodo(todo.id))
        .catch((err: string) => {
          console.error('Unable to delete todo:', err);
        });
    };

    const handleToggleCompletion = () => {
      dispatch(setCompletion(
        { todoId: todo.id, completed: !todo.completed },
      ));
    };

    const itemClasses = cn({
      todo: true,
      'temp-item': isTemporary,
      completed: todo.completed,
    });

    return (
      <div data-cy="Todo" className={itemClasses}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleToggleCompletion}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDeleteTodo}
        >
          ×
        </button>

        {(isTemporary || isDeleting || updatingTodoIds.includes(todo.id)) && (
          <div data-cy="TodoLoader" className="overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.todo.id === nextProps.todo.id
      && prevProps.todo.completed === nextProps.todo.completed
      && prevProps.todo.title === nextProps.todo.title
      && prevProps.isTemporary === nextProps.isTemporary
      && prevProps.isDeleting === nextProps.isDeleting
    );
  },
);
