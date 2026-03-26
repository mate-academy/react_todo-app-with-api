import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  updateTodo: (
    todoId: number,
    newTitle: string,
    completed: boolean,
  ) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  handleDeleteTodo,
  deletingTodoIds,
  updatingTodoIds,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map((todo: Todo) => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              key={todo.id}
              isLoading={
                deletingTodoIds.includes(todo.id) ||
                updatingTodoIds.includes(todo.id)
              }
              handleDeleteTodo={handleDeleteTodo}
              updateTodo={updateTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isLoading={true}
              handleDeleteTodo={handleDeleteTodo}
              updateTodo={updateTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
