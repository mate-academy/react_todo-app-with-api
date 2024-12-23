import { useState } from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  filteredTodos: Todo[];
  handleRemoveTodo: (todoId: number) => Promise<void>;
  handleUpdateTodo: (todo: Todo) => Promise<void>;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  handleRemoveTodo,
  handleUpdateTodo,
  loadingTodoIds,
  tempTodo,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              handleRemoveTodo={handleRemoveTodo}
              handleUpdateTodo={handleUpdateTodo}
              isLoading={loadingTodoIds.includes(todo.id)}
              isInEditMode={editedTodoId === todo.id}
              setEditedTodoId={setEditedTodoId}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isLoading
              handleRemoveTodo={handleRemoveTodo}
              handleUpdateTodo={handleUpdateTodo}
              setEditedTodoId={setEditedTodoId}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
