import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deleteTodoHandler: (id: number) => Promise<void>;
  modifyingTodoIds: number[];
  tempTodo: Todo | null;
  onTodoUpdate: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  modifyingTodoIds,
  deleteTodoHandler,
  tempTodo,
  onTodoUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map((todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            key={todo.id}
            isLoading={modifyingTodoIds.includes(todo.id)}
            onTodoDelete={() => deleteTodoHandler(todo.id)}
            onTodoUpdate={onTodoUpdate}
          />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem todo={tempTodo} isLoading />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
