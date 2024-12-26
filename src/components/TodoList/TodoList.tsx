import React, { useState } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  isLoading?: boolean;
  todos: Todo[];
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  tempTodo: Todo | null;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  onUpdateTodo,
  tempTodo,
  loadingTodoIds,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);

  return (
    <TransitionGroup>
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onRemoveTodo={onRemoveTodo}
              onUpdateTodo={onUpdateTodo}
              isLoading={loadingTodoIds.includes(todo.id)}
              isInEditMode={editedTodoId === todo.id}
              setEditedTodoId={setEditedTodoId}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              onRemoveTodo={onRemoveTodo}
              onUpdateTodo={onUpdateTodo}
              setEditedTodoId={setEditedTodoId}
              isLoading
            />
          </CSSTransition>
        )}
      </section>
    </TransitionGroup>
  );
};
