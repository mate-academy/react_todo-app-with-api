import React, { Dispatch, SetStateAction } from 'react';
import { Filter } from '../Filter/Filter';
import { SelectOption } from '../../App';

type Props = {
  todosCounter: number;
  checkCompleted: boolean;
  option: SelectOption;
  onSetOption: Dispatch<SetStateAction<string>>;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  option,
  todosCounter,
  checkCompleted,
  onSetOption,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      <Filter option={option} onSetOption={onSetOption} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
        disabled={!checkCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
