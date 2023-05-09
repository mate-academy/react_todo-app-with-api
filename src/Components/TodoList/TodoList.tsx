import React, { memo, useMemo } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem';

import { Category } from '../../utils/Category';

import './TodoList.scss';

interface Props {
  todos: Todo[],
  onDelete: (id: number) => void;
  category: Category;
  onUpdate: (todoId: number) => void
  isUpdating: (todoId: number) => boolean;
  tempTodo: Todo | null;
  onChangeTitle: (todoId: number, title: string) => void;
}
export const TodoList: React.FC<Props> = memo(({
  todos,
  onDelete,
  category,
  onUpdate,
  isUpdating,
  tempTodo,
  onChangeTitle,
}) => {
  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (category) {
        case Category.Active:
          return !todo.completed;
        case Category.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [category, todos]);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map((todo) => {
          const isTodoUpdated = isUpdating(todo.id);

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDelete}
                onUpdate={onUpdate}
                isUpdating={isTodoUpdated}
                onChangeTitle={onChangeTitle}
              />
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isUpdating
              onChangeTitle={onChangeTitle}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
