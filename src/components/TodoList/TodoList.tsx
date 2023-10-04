import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { preparedTodos } from '../../utils/TodoFilter';
import { TodoAppRow } from '../TodoAppRow';
import { FilterLink } from '../../types/FilterLinkTypes';

type Props = {
  todos: Todo[],
  selectedFilter: FilterLink,
  processingTodoIds: number[],
  handleDeleteTodo: (todoId: number) => void,
  handleUpdateTodo: (todo: Todo, newTodoTitle: string) => Promise<void>,
  handleCompletedChange: (todo: Todo) => void,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  selectedFilter,
  processingTodoIds,
  handleDeleteTodo,
  handleUpdateTodo,
  handleCompletedChange,
  tempTodo,
}) => {
  const visibleTodos = preparedTodos(todos, selectedFilter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoAppRow
              todo={todo}
              isLoading={processingTodoIds.includes(todo.id)}
              onTodoDelete={handleDeleteTodo}
              onChangeBox={() => (
                handleCompletedChange(todo))}
              onTodoUpdate={(todoTitle) => (
                handleUpdateTodo(todo, todoTitle)
              )}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoAppRow
              todo={tempTodo}
              isLoading
              onTodoDelete={handleDeleteTodo}
              onChangeBox={() => (
                handleCompletedChange(tempTodo))}
              onTodoUpdate={(todoTitle) => (
                handleUpdateTodo(tempTodo, todoTitle)
              )}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
