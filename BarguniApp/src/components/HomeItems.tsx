import React, {useCallback, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Divider} from '@rneui/base';
import {changeItemStatus, Item} from '../api/item';
import {getCategory} from '../api/category';
import Config from 'react-native-config';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
interface HomeItem {
  item: Item;
  category: string;
  remove: Function;
  basketName: string;
}

function HomeItems(props: HomeItem) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);
  let item = props.item;

  const deleteItem = useCallback(async () => {
    // Todo : 삭제 할 아이템
    try {
      console.log(item.itemId, 'itemid');
      await changeItemStatus(item.itemId, true);
      props.remove(item.itemId);
    } catch (error) {
      console.log(error, 'error');
    }
    // console.log(item);
  }, [item.itemId, props]);
  const shelfLife = new Date();
  const onClick = useCallback(() => {
    navigation.navigate('ItemDetail', {...item, basketName: props.basketName});
  }, [item, navigation, props.basketName]);

  const handleConfirm = useCallback(() => {
    setVisible(true);
  }, []);
  return item.category === props.category || props.category === '전체' ? (
    <TouchableOpacity onLongPress={handleConfirm}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>아이템을 삭제합니다</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={deleteItem}>삭제</Button>
            <Button onPress={hideDialog}>취소</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={Style.container}>
        <View style={Style.row}>
          <Image
            style={Style.picture}
            source={{uri: Config.BASE_URL + item.pictureUrl}}
          />
        </View>
        <Pressable style={Style.row2} onPress={onClick}>
          <Text style={Style.date}>{item.name}</Text>
          {/*<Text style={Style.date2}>*/}
          {/*  {item.usedDate}*/}
          {/*  {item.regDate.toString().substring(0, 10)}*/}
          {/*</Text>*/}
          {/*<Text style={Style.date2}>카테고리 : {item.category}</Text>*/}
        </Pressable>
        <View style={Style.row3}>
          <Text style={Style.dDay}>
            D{' '}
            {item.dday === null
              ? (
                  (-1 *
                    (new Date(item.shelfLife).getTime() -
                      new Date().getTime())) /
                  (1000 * 3600 * 24)
                )
                  .toFixed(0)
                  .substring(0, 1) === '-'
                ? `- ${Math.abs(
                    (new Date(item.shelfLife).getTime() -
                      new Date().getTime()) /
                      (1000 * 3600 * 24),
                  ).toFixed(0)}`
                : `+ ${Math.abs(
                    (new Date(item.shelfLife).getTime() -
                      new Date().getTime()) /
                      (1000 * 3600 * 24),
                  ).toFixed(0)}`
              : `${
                  (
                    item.dday -
                    (new Date().getTime() - new Date(item.regDate).getTime()) /
                      (1000 * 3600 * 24)
                  )
                    .toFixed(0)
                    .substring(0, 1) === '-'
                    ? `+ ${Math.abs(
                        item.dday -
                          (new Date().getTime() -
                            new Date(item.regDate).getTime()) /
                            (1000 * 3600 * 24),
                      ).toFixed(0)}`
                    : `- ${Math.abs(
                        item.dday -
                          (new Date().getTime() -
                            new Date(item.regDate).getTime()) /
                            (1000 * 3600 * 24),
                      ).toFixed(0)}`
                }`}
            {/*5 17 5/ 5 12 5 13 5 / dday(5)-( date(513) -regDate(512))*/}
          </Text>
          <Text style={Style.lifetime}>
            {item.shelfLife === null
              ? new Date(
                  shelfLife.setDate(
                    new Date(item.regDate).getDate() + item.dday,
                  ),
                )
                  .toJSON()
                  .substring(0, 10)
              : item.shelfLife}{' '}
            까지
          </Text>
        </View>
        {/*
          <View style={Style.container}>
            <Pressable onPress={deleteItem}>
              <Image
                style={Style.cancel}
                source={require('../assets/close.png')}
              />
            </Pressable>
          </View>
        */}
      </View>
      <View style={{alignItems: 'center', marginTop: '1%'}}>
        <Divider
          width={1}
          style={{width: '93%', alignItems: 'center'}}
          color="#ECECEC"
        />
      </View>
    </TouchableOpacity>
  ) : (
    <></>
  );
}
const Style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // marginBottom: 10,
  },
  row: {
    width: '20%',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  row2: {
    marginLeft: 15,
    width: '32%',
  },
  row3: {
    // backgroundColor: '#ECECEC',
    // borderRadius: 30,
    width: '35%',
    marginTop: 20,
    height: 70,
  },
  date2: {
    fontSize: 12,
    marginTop: 3,
    // marginLeft: 8,
    color: 'black',
  },
  date: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Pretendard-Bold',
    marginTop: 25,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    // marginLeft: 4,
    color: 'black',
  },
  picture: {
    width: 80,
    height: 80,
    borderRadius: 800,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 5,
    marginLeft: 12,
    color: 'black',
    fontFamily: 'Pretendard-Black',
    fontSize: 15,
  },
  cancel: {
    marginTop: 15,
    width: 13,
    height: 13,
  },
  dDay: {
    // marginTop: 15,
    marginLeft: 15,
    textAlign: 'center',
    alignContent: 'center',
    marginRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Bold',
  },
  lifetime: {
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
  },
});
export default HomeItems;
