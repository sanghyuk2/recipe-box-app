import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
//import {NavigationContainer} from '@react-navigation/navigate';

export default class RecipeCards extends React.PureComponent {
  constructor(props) {
    super(props)
    console.log('EACH CARD GOT $$$$$$$$$$$$$$$$ ');

    console.log();
    this.state = {
      baseUri: `https://spoonacular.com/recipeImages/`,
      sendItem: JSON.stringify(this.props.oneitem)
      // navigation: this.props.navigation,
    }

  }
  // source={`${this.state.baseUri}${this.props.oneitem.image}`} 
  render() {

    console.log(this.props)

    return (
      <View>

        <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('Recipe', {item: this.state.sendItem})}>
          {console.log('start')}
          {console.log(`${this.state.baseUri}${this.props.oneitem}`)}
          {console.log('end')}
          <Image style={styles.cardImage} source={require('../assets/images/burger.jpg')} />
          <Text style={styles.cardText}>{this.props.oneitem.title}</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
// I don not know the reason why but when I tried to wraip the Thumbnail component with the Left component, It aligns the image on the middle of the cardlists.

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    marginLeft: '2%',
    width: '96%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      width: 3,
      height: 3
    }
  },
  cardImage: {
    width: 80,
    height: 60,
    borderRadius: 10
    //resizeMode:'cover'
  },
  cardText: {
    padding: 10,
    fontSize: 16
  },
  title: {
    alignItems: 'flex-start',
    top: -10
  }
});
