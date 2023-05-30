import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  onDeleteTodo: (todoId: number) => void,
  pendingTodoIds: number[],
  onToggleCompleted: (todoId: number, completed: boolean) => void,
  onUpdateTodoTitle: (todoId: number, newTitle: string) => void,
};

export const TodosList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  onDeleteTodo,
  pendingTodoIds,
  onToggleCompleted,
  onUpdateTodoTitle,
}) => {
  return (
    <section
      className="todoapp__main"
    >
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              key={todo.id}
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              isProcessed={pendingTodoIds.includes(todo.id)}
              onToggleCompleted={
                () => onToggleCompleted(todo.id, !todo.completed)
              }
              onUpdateTodoTitle={onUpdateTodoTitle}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              isProcessed={pendingTodoIds.includes(0)}
              onDeleteTodo={onDeleteTodo}
              onUpdateTodoTitle={onUpdateTodoTitle}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
