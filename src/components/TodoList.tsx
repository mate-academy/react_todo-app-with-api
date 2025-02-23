/* eslint-disable jsx-a11y/label-has-associated-control */
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';
import cn from 'classnames';

type Props = {
  filteredTodos: TodoType[];
  onDelete: (id: number) => void;
  onEdit: (id: number, data: Partial<TodoType>) => void;
  tempTodo: TodoType | null;
  idsProcessing: number[];
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDelete,
  onEdit,
  tempTodo,
  idsProcessing,
  inputRef,
}) => {
  const transitionConfig = {
    timeout: 300,
  };

  const renderTodoItem = ({
    id,
    title,
    completed,
    isTemp = false,
  }: TodoType & { isTemp?: boolean }) => (
    <CSSTransition
      key={id}
      timeout={transitionConfig.timeout}
      classNames={cn({
        'temp-item': isTemp,
        item: !isTemp,
      })}
    >
      <Todo
        id={id}
        title={title}
        completed={completed}
        onDelete={onDelete}
        onEdit={onEdit}
        idsProcessing={idsProcessing}
        isTemp={isTemp}
        inputRef={inputRef}
      />
    </CSSTransition>
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => renderTodoItem({ ...todo }))}
        {tempTodo && renderTodoItem({ ...tempTodo, isTemp: true })}
      </TransitionGroup>
    </section>
  );
};
