import React from 'react';
import './TodoList.css';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { LoadingType } from '../../types';

const TRANSITION_TIME = 300;

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: LoadingType;
  onEdit: (
    todo: Todo,
    key: keyof Todo,
    value: boolean | string,
  ) => Promise<boolean>;
  onDelete: (todoID: number) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onEdit,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={TRANSITION_TIME}
          classNames="item"
        >
          <TodoItem
            key={todo.id}
            todo={todo}
            loadingIds={loadingIds}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </CSSTransition>
      ))}

      {tempTodo !== null && (
        <CSSTransition key={0} timeout={TRANSITION_TIME} classNames="temp-item">
          <TodoItem
            todo={tempTodo}
            onDelete={onDelete}
            loadingIds={loadingIds}
            onEdit={onEdit}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
