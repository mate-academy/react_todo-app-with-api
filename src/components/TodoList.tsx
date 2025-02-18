import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  visibleTodos: Todo[];
  loadingTodos: Record<number, boolean>;
  isActiveTodo: number | null;
  setIsActiveTodo: (id: number | null) => void;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  onToggle: (updatedTodo: Todo) => void;
  handleEditTitle: (id: number, title: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  loadingTodos,
  isActiveTodo,
  setIsActiveTodo,
  onDelete,
  tempTodo,
  onToggle,
  handleEditTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              loading={!!loadingTodos[todo.id]}
              isActiveTodo={isActiveTodo}
              setIsActiveTodo={setIsActiveTodo}
              onDelete={onDelete}
              onToggle={onToggle}
              handleEditTitle={handleEditTitle}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key="temp" timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              loading={true}
              isActiveTodo={isActiveTodo}
              setIsActiveTodo={setIsActiveTodo}
              onDelete={onDelete}
              onToggle={onToggle}
              handleEditTitle={handleEditTitle}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
