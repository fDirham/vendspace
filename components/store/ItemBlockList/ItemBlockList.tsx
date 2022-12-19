import React, { useEffect, useState } from 'react';
import styles from './ItemBlockList.module.scss';
import { ItemInfo } from 'utilities/types';
import ItemBlock from '../ItemBlock/ItemBlock';
import { useRouter } from 'next/router';
import ControllerItems from 'controllers/ControllerItems';
import ModalEditMenu from '../ModalEditMenu';

type ItemBlockListProps = {
  handle: string;
  storeId: string;
  isUser: boolean;
  editing: boolean;
};

export default function ItemBlockList(props: ItemBlockListProps) {
  const [items, setItems] = useState<ItemInfo[]>([]);
  const [menuItem, setMenuItem] = useState<ItemInfo>();
  const router = useRouter();

  useEffect(() => {
    getItems();
  }, [props.handle, props.storeId]);

  async function getItems() {
    const { handle, storeId } = props;
    if (!handle || !storeId) return;

    const getRes = await ControllerItems.getStoreItems(handle, storeId);
    if (!getRes.isError) {
      setItems(getRes.items!);
    }
  }

  function handleBlockClick(index: number) {
    const item = items[index];
    if (props.editing) {
      setMenuItem(item);
      return;
    }
    router.push(`/s/${props.handle}/${props.storeId}/${item.id}`);
  }

  function onAdd() {
    router.push('/list/' + props.storeId);
  }

  async function handleBlockDelete() {
    const { handle, storeId } = props;
    if (!handle || !storeId) return;

    // Confirm
    const res = confirm('Do you really want to delete this item permanently?');
    if (!res) return;

    const deleteRes = await ControllerItems.deleteItem(
      handle,
      storeId,
      menuItem!.id
    );

    if (!deleteRes.isError) {
      // Delete locally
      const newItems = [...items];
      const indexToDel = newItems.indexOf(menuItem!);
      newItems.splice(indexToDel, 1);
      setItems(newItems);
      setMenuItem(undefined);
    }
  }

  function handleBlockEdit() {
    router.push(`/edit/item/${props.storeId}/${menuItem!.id}`);
  }

  async function handleBlockBump() {
    const { handle, storeId } = props;
    if (!handle || !storeId) return;

    const bumpRes = await ControllerItems.bumpItem(
      handle,
      storeId,
      menuItem!.id
    );

    if (!bumpRes.isError) {
      const newItems = [...items];
      const index = newItems.indexOf(menuItem!);
      newItems.splice(index, 1);
      newItems.unshift(menuItem!);
      setItems(newItems);
      setMenuItem(undefined);
    }
  }

  async function handleBlockHold(hold: boolean) {
    const { handle, storeId } = props;
    if (!handle || !storeId) return;

    const holdRes = await ControllerItems.setItemHold(
      handle,
      storeId,
      menuItem!.id,
      hold
    );

    if (holdRes.isError) return;

    const newItems = [...items];
    const index = newItems.indexOf(menuItem!);
    const newItem = { ...menuItem!, hold };
    newItems[index] = newItem;
    setItems(newItems);
    setMenuItem(undefined);
  }

  async function handleBlockSold(sold: boolean) {
    const { handle, storeId } = props;
    if (!handle || !storeId) return;

    const soldRes = await ControllerItems.setItemSold(
      handle,
      storeId,
      menuItem!.id,
      sold
    );

    if (soldRes.isError) return;
    const newItems = [...items];
    const index = newItems.indexOf(menuItem!);
    const newItem = { ...menuItem!, sold };
    newItems[index] = newItem;
    setItems(newItems);
    setMenuItem(undefined);
  }

  const renderItemBlocks = () => {
    const toReturn = items.map((item, index) => {
      return (
        <ItemBlock
          onClick={() => handleBlockClick(index)}
          item={item}
          key={item.id}
          editing={props.editing}
        />
      );
    });
    if (props.isUser && !props.editing) {
      toReturn.push(<ItemBlock onClick={onAdd} add key={'addbutton'} />);
    }

    return toReturn;
  };

  return (
    <>
      <ModalEditMenu
        item={menuItem}
        onClose={() => setMenuItem(undefined)}
        onDelete={handleBlockDelete}
        onEdit={handleBlockEdit}
        onBump={handleBlockBump}
        onHold={handleBlockHold}
        onSold={handleBlockSold}
      />
      <div className={styles.container}>{renderItemBlocks()}</div>
    </>
  );
}
