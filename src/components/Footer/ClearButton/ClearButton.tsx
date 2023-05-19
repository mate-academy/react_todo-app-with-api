import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import React, { useContext } from 'react';
import { FooterContext } from '../../../context/FooterContext';

export const ClearButton: React.FC = React.memo(() => {
  const { isCompletedExist, deleteCompletedTodos } = useContext(FooterContext);
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={classNames('todoapp__clear-completed', {
        'todoapp__clear-completed--hide': !isCompletedExist,
      })}
      onClick={deleteCompletedTodos}
    >
      {t('Footer.clear')}
    </button>
  );
});
