import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const i18n = useTranslation();
  return <h1>{i18n.t('error.pageNotFound')}</h1>;
};

export default NotFoundPage;
