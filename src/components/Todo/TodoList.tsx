import React from 'react';
import { Todo, TodoUpdate } from '../../types/Todo';
import { TodoItem } from './TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface Props {
  todoList: Todo[];
  loadingIds: Todo['id'][];
  onDeleteTodo: (id: Todo['id']) => void;
  onChangeTodo: (id: Todo['id'], values: TodoUpdate) => Promise<void>;
  tempTodo?: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todoList = [],
  loadingIds = [],
  onDeleteTodo,
  onChangeTodo,
  tempTodo = null,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todoList.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onDelete={onDeleteTodo}
              onChange={onChangeTodo}
              loading={loadingIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              loading
              onChange={onChangeTodo}
              onDelete={onDeleteTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
