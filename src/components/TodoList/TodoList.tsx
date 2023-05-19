import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

type Props = {
  todos: Todo[];
  onDelete: (todoToDeleteId: number) => void;
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onCompletedChange: (todoId: number, completed: boolean) => Promise<void>;
  onTitleChange: (todoId: number, title: string) => Promise<void>
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  loadingTodoIds,
  onCompletedChange,
  onTitleChange,
}) => {
  const isCreating = tempTodo?.id === 0;

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              loadingTodoIds={loadingTodoIds}
              onCompletedChange={onCompletedChange}
              onTitleChange={onTitleChange}
            />
          </CSSTransition>
        ))}

        {isCreating && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodo title={tempTodo.title} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
