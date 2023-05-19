import { TFunction } from 'i18next';

export const validateTitle = (inputTitle: string, t: TFunction) => {
  if (inputTitle.trim() === '') {
    return t('Error.empty');
  }

  if (!/[a-zA-Zа-яА-ЯіІїЇ0-9]/i.test(inputTitle.trim())) {
    return t('Error.symbols');
  }

  return null;
};
