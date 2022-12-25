import React from 'react';
import ChangeStoreRepage from 'components/repages/ChangeStoreRepage';

export default function newStore() {
  return (
    <ChangeStoreRepage
      metaTitle='Create VendSpace Store'
      headerTitle='create store'
      pageTitle='Create Store'
      edit={false}
    />
  );
}
