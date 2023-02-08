import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  handleDeleteTodo: (todoDel: Todo) => void;
  tempTodo: Todo | null;
  deletingId: number[];
  handleUpdate: (updatingTodo: Todo, newField: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    handleDeleteTodo,
    tempTodo,
    deletingId,
    handleUpdate,
  }) => {
    return (
      <section className="todoapp__main">
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={240}
              classNames="item"
            >
              <TodoItem
                key={todo.id}
                todo={todo}
                deletingId={deletingId}
                handleDeleteTodo={handleDeleteTodo}
                handleUpdate={(newField) => handleUpdate(todo, newField)}
              />
            </CSSTransition>
          ))}
          {tempTodo && (
            <CSSTransition
              timeout={240}
              classNames="temp-item"
            >
              <TodoItem
                todo={tempTodo}
                handleDeleteTodo={handleDeleteTodo}
                deletingId={deletingId}
                handleUpdate={() => {}}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);
