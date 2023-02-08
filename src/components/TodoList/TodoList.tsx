import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  updateTodo: (id: number, data: Partial<Todo>) => void,
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodo,
    deleteTodo,
    updateTodo,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup as="ul">
          {todos.map((todo) => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={todo}
                deleteTodo={deleteTodo}
                updateTodo={updateTodo}
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
                deleteTodo={deleteTodo}
                updateTodo={updateTodo}
              />
            </CSSTransition>

          )}
        </TransitionGroup>
      </section>
    );
  },
);
