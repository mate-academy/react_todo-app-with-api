import React from 'react';
import { Todo } from '../../types/todo/Todo';
import { TodoItem } from '../TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const CSS_TRANSITION_TIMEOUT = 300;

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isTodoLoading: (todoId: Todo['id']) => boolean;
  onTodoDelete: (todoId: Todo['id']) => Promise<void>;
  onTodoUpdate: (
    todoId: Todo['id'],
    todoData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isTodoLoading,
  onTodoDelete,
  onTodoUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={CSS_TRANSITION_TIMEOUT}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              isTodoLoading={isTodoLoading}
              onTodoDelete={onTodoDelete}
              onTodoUpdate={onTodoUpdate}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={CSS_TRANSITION_TIMEOUT}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              isTodoLoading={isTodoLoading}
              isTempTodo={true}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
