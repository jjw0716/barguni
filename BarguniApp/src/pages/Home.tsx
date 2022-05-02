import React, {useCallback, useState} from 'react';
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
import HomeItems from '../components/HomeItems';

function Home() {
  const [basket, setBasket] = useState([
    {name: '테스트 바구니', value: 1},
    {name: '테스트 바구니2', value: 2},
    {name: '테스트 바구니3', value: 3},
  ]);
  const [category, setCategory] = useState([
    '전체',
    '식료품1',
    '식료품2',
    '식표품3',
    '식표품3',
    '식표품3',
    '식표품3',
    '식표품3',
    '식표품3',
    '식표품3',
  ]);
  const [selectedBasket, setSelectedBasket] = useState(basket[0]);
  const [selectedCategory, setselectedCategory] = useState(0);
  const selectCategory = useCallback(index => {
    // console.log(index);
    setselectedCategory(index);
    // Todo:카테고리를 바꾸면 아래 항목 리스트도 바뀌어야함
  }, []);
  const [items, setItems] = useState([11, 11]);
  const renderItem = useCallback(({item}: {item: object}) => {
    return <HomeItems></HomeItems>;
  }, []);
  return (
    <View style={Style.container}>
      <Picker
        selectedValue={selectedBasket}
        onValueChange={itemValue => {
          //Todo: 바구니 선택시 해당 카테고리로 바꿔줘야함
          setSelectedBasket(itemValue);
        }}
        style={Style.dropdown}>
        {basket.map(item => (
          <Picker.Item
            key={item.value}
            label={item.name}
            value={item.value}></Picker.Item>
        ))}
      </Picker>
      <ScrollView horizontal={true} style={Style.category}>
        {category.map((item, index) => (
          <TouchableOpacity
            style={
              selectedCategory == index ? Style.selectButton : Style.button
            }
            onPress={() => {
              selectCategory(index);
            }}
            key={index}>
            <Text
              style={
                selectedCategory == index
                  ? Style.selectButtonText
                  : Style.buttonText
              }>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={Style.line}></View>
      <FlatList data={items} renderItem={renderItem}></FlatList>
    </View>
  );
}

const Style = StyleSheet.create({
  dropdown: {
    backgroundColor: '#0094FF',
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    marginTop: 10,
    marginLeft: 3,
    marginRight: 3,
  },
  button: {
    marginTop: 3,
    marginRight: 4,
    color: 'black',
    marginLeft: 2,
    height: 30,
  },
  buttonText: {
    marginTop: 3,
    marginRight: 4,
    color: 'black',
    marginLeft: 2,
    height: 26,
  },
  selectButton: {
    marginTop: 3,
    marginRight: 4,
    marginLeft: 2,
    backgroundColor: 'red',
    height: 26,
    borderRadius: 5,
  },
  selectButtonText: {
    marginTop: 3,
    textAlign: 'center',
    marginRight: 4,
    marginLeft: 4,
    color: 'white',
  },
  category: {
    flexDirection: 'row',
    marginTop: 5,
  },
  line: {width: '100%', height: 0.7, backgroundColor: 'gray'},
});

export default Home;
