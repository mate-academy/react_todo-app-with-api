import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  visibleTodos: Todo[];
  creating: Todo | null;
  isLoading: number[];
  isDoubleClick: boolean;
  selectedTodoId: number | null;
  focusEdit: number;
  onDelete: (todoId: number) => void;
  onDoubleClick: (id: number) => void;
  toggleTodoStatus: (todo: Todo) => void;
  onEditTitle: (query: string, todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  creating,
  isLoading,
  isDoubleClick,
  selectedTodoId,
  focusEdit,
  onDelete,
  onDoubleClick,
  toggleTodoStatus,
  onEditTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
            appear={true}
          >
            <TodoItem
              isDoubleClick={isDoubleClick}
              todo={todo}
              isProcessed={isLoading.includes(todo.id)}
              onDelete={onDelete}
              onUpdate={toggleTodoStatus}
              onEdit={onEditTitle}
              onDoubleClick={onDoubleClick}
              selectedTodoId={selectedTodoId}
              focusEdit={focusEdit}
            />
          </CSSTransition>
        ))}

        {creating && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
            appear={true}
          >
            <TodoItem todo={creating} isProcessed={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
