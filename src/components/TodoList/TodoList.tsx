import { FC, memo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import './TodoList.scss';
import { TodoTask } from '../TodoTask';
import { emptyFunction } from '../../utils/functions';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  onDelete: (id: number) => void;
  loadingTodosIDs: number[];
  onUpdate: (id: number, data: Partial<Todo>) => void;
};

export const TodoList: FC<Props> = memo(({
  todos,
  tempTodo,
  onDelete,
  loadingTodosIDs,
  onUpdate,
}) => {
  return (
    <section className="App__main TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const isLoading = loadingTodosIDs.some(id => id === todo.id);

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="TodoList__item"
            >
              <TodoTask
                todo={todo}
                onDelete={onDelete}
                isLoading={isLoading}
                onUpdate={onUpdate}
              />
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="TodoList__temp-item"
          >
            <TodoTask
              todo={tempTodo}
              onDelete={emptyFunction}
              onUpdate={emptyFunction}
              isLoading
            />
          </CSSTransition>
        )}

      </TransitionGroup>
    </section>
  );
});
