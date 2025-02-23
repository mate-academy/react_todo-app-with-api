import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UpdatingFunction, DeletingFunction } from '../types/Functions';

type Props = {
  todos: Todo[];
  changindIds: number[];
  onDeleteItem: DeletingFunction;
  onUpdate: UpdatingFunction;
  tempTodo: null | Todo;
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, changindIds, onDeleteItem, onUpdate, tempTodo: tempTodoTitle }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                isProcessed={changindIds.includes(todo.id)}
                onDelete={() => onDeleteItem(todo.id)}
                onUpdate={onUpdate}
              />
            </CSSTransition>
          ))}

          {tempTodoTitle && (
            <CSSTransition key={0} timeout={300} classNames="temp-item">
              <TodoItem
                todo={tempTodoTitle}
                isProcessed={true}
                onDelete={() => onDeleteItem(tempTodoTitle.id)}
                onUpdate={onUpdate}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
