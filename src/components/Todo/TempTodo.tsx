import classNames from 'classnames';
import { TodoType } from '../../types/TodoType';
import { TodoCard } from '../TodoCard';
import { StatusToggler } from '../StatusToggler';

type Props = {
  todo: TodoType
  loading: boolean;

};

export const TempTodo: React.FC<Props> = (
  {
    todo: { title, completed },
    loading = false,
  },
) => {
  return (
    <div className={
      classNames('todo', {
        completed,
      })
    }
    >
      <StatusToggler
        completed={completed}
      />

      <TodoCard
        todoTitle={title}
        loading={loading}
        isSelected
      />

    </div>

  );
};
