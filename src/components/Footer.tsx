/* eslint-disable import/no-extraneous-dependencies */
// src/components/Footer.tsx
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FilteredValue } from '../types/FilteredValue';
import { Filter } from './Filter';

interface Props {
  isDisableBtn: boolean;
  activeTodos: { id: number }[]; // sau direct number dacă vrei doar count
  setFilter: (value: FilteredValue) => void;
  filter: FilteredValue;
  handleComletedDelete: () => void;
}

export const Footer: React.FC<Props> = ({
  isDisableBtn,
  activeTodos,
  setFilter,
  filter,
  handleComletedDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <Filter filter={filter} setFilter={setFilter} />

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-disabled': isDisableBtn,
        })}
        data-cy="ClearCompletedButton"
        onClick={handleComletedDelete}
        disabled={isDisableBtn}
      >
        Clear completed
      </button>
    </footer>
  );
};

Footer.propTypes = {
  isDisableBtn: PropTypes.bool.isRequired,
  activeTodos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
  setFilter: PropTypes.func.isRequired,
  filter: PropTypes.oneOf([
    FilteredValue.All,
    FilteredValue.Active,
    FilteredValue.Completed,
  ]).isRequired,
  handleComletedDelete: PropTypes.func.isRequired,
};
