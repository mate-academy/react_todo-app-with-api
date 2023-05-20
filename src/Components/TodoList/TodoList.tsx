import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';
import './TodoList.scss';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  updatingTodoId: number | null;
  isRemovingCompleted: boolean;
  isUpdatingEveryStatus: boolean;
  isEveryTotoCompleted: boolean;
  onTodoRemove: (todoId: number) => void;
  onTodoUpdate: (todo: Todo) => void;
  onTodoTitleUpdate: (todo: Todo, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  updatingTodoId,
  isRemovingCompleted,
  isUpdatingEveryStatus,
  isEveryTotoCompleted,
  onTodoRemove,
  onTodoUpdate,
  onTodoTitleUpdate,
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
            isUpdatingEveryStatus={isUpdatingEveryStatus}
            isEveryTotoCompleted={isEveryTotoCompleted}
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
);
