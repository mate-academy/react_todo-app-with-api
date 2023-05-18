/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { AddTodoForm } from '../AddTodoForm';
import { TodoData } from '../../types/TodoData';

interface Props {
  onError: (error: string) => void;
  onAddTodo: (newTodo: TodoData) => Promise<void>;
  isLoadingForm: boolean;
  onToggleAll: () => void;
  isAllCompleted: boolean;
}
export const Header: React.FC<Props> = ({
  onError,
  onAddTodo,
  isLoadingForm,
  onToggleAll,
  isAllCompleted,

}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllCompleted })}
        onClick={onToggleAll}
      />

      <AddTodoForm
        onError={onError}
        onAddTodo={onAddTodo}
        isLoadingForm={isLoadingForm}
      />
    </header>
  );
};
