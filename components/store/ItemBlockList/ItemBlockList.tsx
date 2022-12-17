import React, { useEffect, useState } from 'react';
import styles from './ItemBlockList.module.scss';
import { ItemInfo } from 'utilities/types';
import ItemBlock from '../ItemBlock/ItemBlock';
import { useRouter } from 'next/router';
import ControllerItems from 'controllers/ControllerItems';

type ItemBlockListProps = {
  handle: string;
  storeId: string;
  isUser: boolean;
};

export default function ItemBlockList(props: ItemBlockListProps) {
  const [items, setItems] = useState<ItemInfo[]>([]);
  const router = useRouter();

  useEffect(() => {
    getItems();
  }, [props.handle, props.storeId]);

  async function getItems() {
    const { handle, storeId } = props;
    if (!handle || !storeId) return;

    const getRes = await ControllerItems.getStoreItems(handle, storeId);
    console.log(getRes);
    if (!getRes.isError) {
      setItems(getRes.items!);
    }
  }

  function onBlockClick(index: number) {}

  function onAdd() {
    router.push('/list/' + props.storeId);
  }

  const renderItemBlocks = () => {
    const toReturn = items.map((item, index) => {
      return (
        <ItemBlock
          onClick={() => onBlockClick(index)}
          item={item}
          key={item.id}
        />
      );
    });
    if (props.isUser) {
      toReturn.push(<ItemBlock onClick={onAdd} add />);
    }

    return toReturn;
  };

  return <div className={styles.container}>{renderItemBlocks()}</div>;
}
