import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  removeTodo: (id: number) => void;
  onTodoUpdate: (todoId: number, data: unknown) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  processingIds,
  removeTodo,
  onTodoUpdate,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            processingIds={processingIds}
            removeTodo={removeTodo}
            onTodoUpdate={onTodoUpdate}
            key={todo.id}
          />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TempTodo
            todo={tempTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
