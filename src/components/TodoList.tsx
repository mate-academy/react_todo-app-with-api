import { memo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodos: (id: number) => void,
  loadingTodoIds: number[],
  updateTodo: (id: number, data: Partial<Todo>) => void,
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  tempTodo,
  deleteTodos,
  loadingTodoIds,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(({ title, completed, id }) => (
          <CSSTransition
            key={id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              title={title}
              completed={completed}
              id={id}
              deleteTodos={deleteTodos}
              isLoading={loadingTodoIds.includes(id)}
              updateTodo={updateTodo}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>

      {tempTodo && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            title={tempTodo.title}
            completed={false}
            id={tempTodo.id}
            deleteTodos={deleteTodos}
            isLoading
            updateTodo={updateTodo}
          />
        </CSSTransition>
      )}
    </section>
  );
});
