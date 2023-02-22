import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo, TodoData } from '../../types';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  processedTodos: Todo[],
  tempTodo: Todo | null,
  onDelete: (todo: Todo) => void,
  onUpdate: (todo: Todo, data: TodoData) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  processedTodos,
  tempTodo,
  onDelete,
  onUpdate,
}) => {
  return (
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            onDelete={() => onDelete(todo)}
            onUpdate={(fields) => onUpdate(todo, fields)}
            beingProcessed={processedTodos.includes(todo)}
          />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={tempTodo}
            onDelete={() => {}}
            onUpdate={() => {}}
            beingProcessed
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
