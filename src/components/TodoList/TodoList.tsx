import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import './TodoList.scss';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

export const USER_ID = 6980;

interface Props {
  visibleTodos: Todo[];
  deleteTodo: (idToDelete: number) => Promise<unknown>;
  creating: boolean;
  processings: number[];
  tempTodo: Todo | null;
  onUpdate: (
    idToUpdate: number,
    newTitle: string
  ) => void | Promise<void | Partial<Todo>>,
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  creating,
  tempTodo,
  processings,
  onUpdate,
}) => {
  const handleUpdate = (idToUpdate: number | 0) => {
    return (newTitle: string) => onUpdate(idToUpdate, newTitle);
  };

  // const onDelete = (idToDelete) => {
  //   return deleteTodo(idToDelete);
  // }

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
              isProcessed={processings.includes(todo.id)}
              onDelete={() => deleteTodo(todo.id)}
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
              onUpdate={handleUpdate(tempTodo?.id || 0)}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
