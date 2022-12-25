import React from 'react';
import ChangeItemRepage from 'components/repages/ChangeItemRepage';

export default function newItem() {
  return (
    <ChangeItemRepage
      pageTitle='New Item'
      metaTitle='New VendSpace Item'
      headerTitle='new'
      edit={false}
    />
  );
}
