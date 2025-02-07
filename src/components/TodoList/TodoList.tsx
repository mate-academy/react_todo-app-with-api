import React, { useState } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './TodoList.scss';

type Props = {
  filteredTodos: Todo[];
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  handleUpdateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = props => {
  const {
    filteredTodos,
    loadingTodoIds,
    tempTodo,
    handleDeleteTodo,
    handleUpdateTodo,
  } = props;

  const [editedTodo, setEditedTodo] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup component={null}>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              handleDeleteTodo={handleDeleteTodo}
              handleUpdateTodo={handleUpdateTodo}
              isLoading={loadingTodoIds.includes(todo.id)}
              isInEditMode={editedTodo === todo.id}
              setEditedTodo={setEditedTodo}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
          isLoading
        />
      )}
    </section>
  );
};
