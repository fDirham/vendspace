import React from 'react';
import styles from './LoadingRepage.module.scss';
import PageContainer from 'components/all/PageContainer';
import PageHeader from 'components/all/PageHeader';

type LoadingRepageProps = {};

export default function LoadingRepage(props: LoadingRepageProps) {
  return (
    <PageContainer className={styles.container}>
      <PageHeader title={''} />
    </PageContainer>
  );
}
