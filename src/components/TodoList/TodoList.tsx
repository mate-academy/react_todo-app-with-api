import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import './TodoList.scss';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

export const USER_ID = 67;

interface Props {
  visibleTodos: Todo[];
  deleteTodo: (idToDelete: number) => Promise<unknown>;
  creating: boolean;
  processings: number[];
  tempTodo: Todo;
  onUpdate
  : (idToUpdate: number,
    dataToUpdate: string | boolean) => void | Promise<void | Partial<Todo>>,
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  creating,
  tempTodo,
  processings,
  onUpdate,
}) => {
  const handleUpdate = (idToUpdate: number) => {
    return (
      dataToUpdate: string | boolean,
    ) => onUpdate(idToUpdate, dataToUpdate);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDelete={() => deleteTodo(todo.id)}
              isProcessed={processings.includes(todo.id)}
              onUpdate={handleUpdate(todo.id)}
            />
          </CSSTransition>
        ))}

        {creating && (
          <CSSTransition
            key={tempTodo?.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              isProcessed
              onDelete={() => deleteTodo(tempTodo.id)}
              onUpdate={handleUpdate(tempTodo.id)}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
