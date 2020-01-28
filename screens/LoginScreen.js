import * as React from 'react';
import { View, StyleSheet, Platform, SafeAreaView, ScrollView, Dimensions, Text } from 'react-native';
import TopNavbar from '../components/TopNavbar';
import LoginForm from '../components/LoginForm';


class LoginScreen extends React.Component {
   constructor(props) {
    super(props);
      this.state = {
        navigation: this.props.navigation,

      }
   }

    callbackFunction = (childData) => {
        this.setState({login: childData});
        console.log("login complete!")
    }
  
  render() {
    
    console.log(this.state.navigation);
    //console.log('NAVIGATION USER %%%%%%% ');
    //console.log(this.props.navigation.state.routeName);
    return (
  
      <SafeAreaView style={{ flex: 3 }}>
        <TopNavbar title='Log in'></TopNavbar>
        <ScrollView >
          <View style={{ marginStart:10, marginTop: 10, marginEnd:10, position: 'relative', top: 0, left: 0, right: 0, bottom: 0 , justifyContent: 'center', alignItems: 'center', borderWidth: 0, borderRadius: 30, overflow: "hidden"}}>
            
              <LoginForm props={this.props.navigation}></LoginForm>
            
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

LoginScreen.navigationOptions = {
  header: null,
};
export default LoginScreen;