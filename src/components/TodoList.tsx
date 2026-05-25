import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  loadingTodoIds: number[];
  loading: boolean;
  onToggle: (todo: Todo) => void;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  onRename: (todo: Todo, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  onDelete,
  loadingTodoIds,
  onToggle,
  editingTodoId,
  setEditingTodoId,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {loading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}

      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              loading={loadingTodoIds.includes(todo.id)}
              onDelete={onDelete}
              onToggle={onToggle}
              editingTodoId={editingTodoId}
              setEditingTodoId={setEditingTodoId}
              onRename={onRename}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
