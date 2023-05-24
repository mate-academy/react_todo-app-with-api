import React, { memo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';
import './TodoList.scss';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  updatingTodoId: number | null;
  isRemovingCompleted: boolean;
  isUpdatingStatus: boolean;
  isAllTotoCompleted: boolean;
  onRemove: (todoId: number) => void;
  onUpdate: (todo: Todo) => void;
  onTitleUpdate: (todo: Todo, title: string) => void;
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  tempTodo,
  updatingTodoId,
  isRemovingCompleted,
  isUpdatingStatus,
  isAllTotoCompleted,
  onRemove: onTodoRemove,
  onUpdate: onTodoUpdate,
  onTitleUpdate: onTodoTitleUpdate,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map((todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            key={todo.id}
            todo={todo}
            updatingTodoId={updatingTodoId}
            isRemovingCompleted={isRemovingCompleted}
            isUpdatingEveryStatus={isUpdatingStatus}
            isEveryTotoCompleted={isAllTotoCompleted}
            onTodoRemove={onTodoRemove}
            onTodoUpdate={onTodoUpdate}
            onTodoTitleUpdate={onTodoTitleUpdate}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={tempTodo}
            isLoadingNewTodo
            onTodoRemove={() => { }}
            onTodoUpdate={() => { }}
            onTodoTitleUpdate={() => { }}
          />
        </CSSTransition>
      )}
    </TransitionGroup>

  </section>
));
