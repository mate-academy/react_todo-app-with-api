import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodoItem } from './TempTodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          return (
            <CSSTransition key={todo.id} timeout={500} classNames="item">
              <TodoItem
                todo={todo}
                onDelete={onDelete}
                onUpdateTodo={onUpdateTodo}
              />
            </CSSTransition>
          );
        })}
        {tempTodo && (
          <CSSTransition key="tempTodo" timeout={300} classNames="temp-item">
            <TempTodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
