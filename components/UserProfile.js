import * as React from 'react';
import { useState } from 'react';

import { View, StyleSheet, Platform, Text, Dimensions, FlatList } from 'react-native';
import { Button, TextInput, Title, Subheading, Avatar, Card, List, Snackbar, Banner } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form'
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import Firebase from '../configure/Firebase';
import SafeAreaView from 'react-native-safe-area-view';


const styles = StyleSheet.create({
  label: {
    color: '#FFFFFF',
    margin: 20,
    marginLeft: 0
  },
  button: {
    marginTop: 40,
    height: 20,
    backgroundColor: '#1DE9B6',
    borderRadius: 4
  },
  container: {
    flex: 1,
    //position: "relative",
    paddingTop: 3,
    padding: 8,
    backgroundColor: '#263238',
    borderRadius: 10,
    height: 'auto',
    ...Platform.select({
      ios: {
        width: 320
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 50) : 600,
      },
      android: {
        width: 320
      },
    })
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 3,
    padding: 8,
    margin: 10,
    backgroundColor: '#F48FB1',
    borderRadius: 10,
    height: 'auto',
    shadowColor: "#D81B60",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.33,
    shadowRadius: 8.62,

    elevation: 8,

  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    height: 30,
    padding: 5,
    borderRadius: 4,
  }
});



function UserProfile({ props, user }) {
  console.log('USER PROFLE: ******')

  const [showSnack, setShowSnack] = useState(false);
  var firstName = 'User';
  var lastName = 'Profile';
  console.log('USER IS ))))))))))) : ')
  console.log(user);

  /*if(params.names) {

    firstName = params.names.firstName;
    lastName = params.names.lastName;
  }*/
  // Fill with data from API call for user saved recipes  
  const savedRecipes = [
    /*{ title: "Recipe 1", source: 'https://picsum.photos/200', key: 'item1' },
    { title: "Recipe 2", source: 'https://picsum.photos/200', key: 'item2' },
    { title: "Recipe 3", source: 'https://picsum.photos/200', key: 'item3' }*/
  ];

  // Fill with data from API call for user cookbooks  
  const savedCookbooks = [
    /*{title: "Cookbook 1", source: 'https://picsum.photos/200', key: 'item1'},
    {title: "Cookbook 2", source: 'https://picsum.photos/200', key: 'item2'},
    {title: "Cookbook 3", source: 'https://picsum.photos/200', key: 'item3'}*/
  ];

  // Adds a space between the cards in the Flatlist
  const seperator = () => { return <View style={{ width: 20, height: 20 }} /> }

  // Returns the cards for saved Recipes
  const showRecipeCard = ({ item: item }) => {

    return (
      <Card key={item.key} style={{ width: 200 }} onPress={() => props.navigate('Recipes')}>
        <Card.Cover source={{ uri: item.source }}></Card.Cover>
        <Card.Content>
          <Title >{item.title}</Title>
        </Card.Content>
      </Card>);

  }

  // Returns the cards for Cookbooks
  const showCookbookCard = ({ item: item }) => {

    return (
      <Card key={item.key} style={{ width: 200 }} onPress={() => props.navigate('Cookbook')}>
        <Card.Cover source={{ uri: item.source }}></Card.Cover>
        <Card.Content>
          <Title >{item.title}</Title>
        </Card.Content>
      </Card>);

  }

  // Renders a button to search Recipes if no saved recipes are found
  const noSavedCookbooks = () => {

    return (
      <Button style={{ marginHorizontal: 10, marginVertical: 20, backgroundColor: '#64B5F6' }} mode="contained" onPress={() => props.navigate('CreateCookbook')}>
        Create a Cookbook
      </Button>
    )

  }

  // Renders a button to create cookbook if no cookbooks are found
  const noSavedRecipes = () => {

    return (
      <Button style={{ marginHorizontal: 10, marginVertical: 20, backgroundColor: '#64B5F6' }} mode="contained" onPress={() => props.navigate('Search')}>
        Go to Recipes
      </Button>
    )

  }

  return (
    <SafeAreaView style={{ flex: 3 }}>

      <Banner
        visible={showSnack}
        style={{ backgroundColor: '#EEEEEE' }}
        actions={[
          {
            label: 'Dismiss',
            onPress: () => { setShowSnack(false) },
          }
        ]}

      >
        Under Development
      </Banner>
      <View style={styles.innerContainer}>
        <Title>Welcome, {user.displayName}</Title>
      </View>
      <View style={styles.innerContainer} >
        <Title>Account Settings</Title>
        <Button style={{ marginHorizontal: 10, marginTop: 20, backgroundColor: '#64B5F6' }} mode="contained" onPress={() => props.navigate('ChangeEmail')}>
          Change Email
          </Button>
        <Button style={{ marginHorizontal: 10, marginTop: 20, backgroundColor: '#64B5F6' }} mode="contained" onPress={() => props.navigate('ChangePassword')}>
          Change Password
          </Button>
        <Button style={{ marginHorizontal: 10, marginVertical: 20, backgroundColor: '#B71C1C' }} mode="contained" onPress={() => props.navigate('DeleteUser')}>
          Delete Account
          </Button>
      </View>




      <View style={styles.innerContainer} >
        <Subheading style={{ color: '#EEEEEE', fontSize: 20, marginVertical: 10 }}>Saved Recipes</Subheading>

        {
          <FlatList
            ListEmptyComponent={noSavedRecipes}
            ItemSeparatorComponent={seperator}
            style={{ borderColor: 'green' }}
            horizontal={true}
            data={savedRecipes}
            renderItem={showRecipeCard}

          />
        }
      </View>

      <View style={styles.innerContainer} >
        <Subheading style={{ color: '#EEEEEE', fontSize: 20, marginVertical: 10 }}>Cookbooks</Subheading>
        <FlatList
          ListEmptyComponent={noSavedCookbooks}
          ItemSeparatorComponent={seperator}
          style={{ borderColor: 'green' }}
          horizontal={true}
          data={savedCookbooks}
          renderItem={showCookbookCard}

        />
      </View>
    </SafeAreaView>

  );


}
export default UserProfile;
