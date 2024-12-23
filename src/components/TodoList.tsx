import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  filteredTodos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = props => {
  const {
    filteredTodos,
    onDeleteTodo,
    onUpdateTodo,
    loadingTodoIds,
    tempTodo,
  } = props;

  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              onUpdateTodo={onUpdateTodo}
              isLoading={loadingTodoIds.includes(todo.id)}
              isInEditMode={todo.id === editedTodoId}
              setEditedTodoId={setEditedTodoId}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              onDeleteTodo={onDeleteTodo}
              onUpdateTodo={onUpdateTodo}
              setEditedTodoId={setEditedTodoId}
              isLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
