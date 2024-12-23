import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = props => {
  const { todos, tempTodo, loadingTodoIds, onRemoveTodo, onUpdateTodo } = props;

  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              key={todo.id}
              isLoading={loadingTodoIds.includes(todo.id)}
              onRemoveTodo={onRemoveTodo}
              onUpdateTodo={onUpdateTodo}
              isInEditMode={editedTodoId === todo.id}
              setEditedTodoId={setEditedTodoId}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isLoading={true}
              onRemoveTodo={onRemoveTodo}
              onUpdateTodo={onUpdateTodo}
              setEditedTodoId={setEditedTodoId}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
