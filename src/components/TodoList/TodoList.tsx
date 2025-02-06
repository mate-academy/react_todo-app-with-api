import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  listOfTodos: Todo[];
  onUpdate: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  savingTodoIds: number[];
  tempTodo?: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  listOfTodos,
  onUpdate,
  onDelete,
  savingTodoIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {listOfTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="todo item">
            <TodoItem
              key={todo.id}
              todo={todo}
              isSaving={savingTodoIds.includes(todo.id)}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="todo item">
            <TodoItem
              key="temp"
              todo={tempTodo}
              isSaving={true}
              onUpdate={() => {}}
              onDelete={() => {}}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
