import React,{ useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SvgUri } from 'react-native-svg';
import MapView, { Marker } from 'react-native-maps';

import api from '../../services/api';

interface IItem{
  id: number;
  title: string;
  imgUrl: string;
}

const Points = () =>{
  const [items, setItems] = useState<IItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  useEffect(() => {
    api.get('items').then(response =>{
      setItems(response.data);
    }); 
  }, []);

  const navigation = useNavigation();
  
  function handleNavigationBack(){
    navigation.goBack();
  }
  function handleNavigationToDetail(){
    navigation.navigate('Detail');
  }  
  function handleSelectItem(id: number){
    const alredySelected = selectedItems.findIndex(item => item === id);

    if(alredySelected >= 0){
      const filteredItems = selectedItems.filter(item => item !== id);
      
      setSelectedItems(filteredItems);
    } else{
      setSelectedItems([...selectedItems, id]);
    }
  }
  return(
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Bem Vindo.
        </Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>
        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map} 
            initialRegion={{
              latitude: -24.2858571, 
              longitude: -46.9707956,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker 
              style={styles.mapMarker}
              coordinate={{
                latitude: -24.2858571, 
                longitude: -46.9707956
              }}
              onPress={handleNavigationToDetail}
            >
              <View style={styles.mapMarkerContainer}>
                <Text style={styles.mapMarkerTitle}>Mercado</Text>
              </View>
            </Marker>
          </MapView>
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{paddingHorizontal: 20}}
        >
          {items.map(item =>(
            <TouchableOpacity 
              onPress={() => handleSelectItem(item.id)} 
              key={String(item.id)} 
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.imgUrl}/>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;