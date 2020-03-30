import * as React from 'react';
import { useState, useRef } from 'react';
import { View, StyleSheet, Platform, Text, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Button, TextInput, Title, Subheading, Provider, Portal, Modal, Card, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form'
import { TouchableHighlight } from 'react-native-gesture-handler';
import Firebase from '../configure/Firebase';
import { NavigationActions } from 'react-navigation'
import Axios from 'axios';
const apiKey = require('../configure/apiKey.json');
//import * as Print from 'expo-print';

const styles = StyleSheet.create({
  label: {
    color: '#000000',
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
    justifyContent: 'center',
    paddingTop: 3,
    padding: 4,
    backgroundColor: '#FFFFFF',
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
  input: {
    backgroundColor: '#90CAF9',
    borderWidth: 0,
    height: 30,
    padding: 5,
    borderRadius: 4,
  },
  modalStyle: {
    flex: 3,
    justifyContent: 'center',
    paddingTop: 3,
    padding: 8,
    backgroundColor: '#FFFFFF',
     height: 'auto',
    ...Platform.select({
      ios: {
        //  width: (Dimensions.get('screen').width - 50),
        // height: (Dimensions.get('screen').height - 50)
      },
      web: {
        //  width: (Dimensions.get('window').width - 50),
        //  height: (Dimensions.get('window').height - 50)
      },
      android: {
        // width: (Dimensions.get('screen').width - 50),
        // height: (Dimensions.get('screen').height - 50)
      },
    })
  }
});

var errorb = false;


function RegisterForm({ nav }) {

  const navigation = nav;
  //console.log(navigation);
  const { control, handleSubmit, errors, setError } = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({});
  const captureView = useRef();
  const onSubmit = data => {
    console.log("Form Data = ")

    //  JSON.
    JSON.stringify(data);
    console.log(data);

    if (data.email && data.password && data.confirmEmail && data.confirmPassword && data.firstName && data.lastName && data.question && data.answer) {

      if (data.email === data.confirmEmail && data.password === data.confirmPassword && data.question != data.answer) {

        var name = data.firstName + " " + data.lastName;
        setLoading(true);
        errorb = false;
        //Create User with Email and Password
        console.log("Checking Mail Server at "+"http://apilayer.net/api/check?access_key=" + apiKey.emailValidator + "&email=" + data.email + "&smtp=1&format=1");
        Axios.get("http://apilayer.net/api/check?access_key=" + apiKey.emailValidator + "&email=" + data.email + "&smtp=1&format=1").then(res => {
          console.log('REQ SUCCESSFUL');
          if (!(res.data.smtp_check)) {
            setLoading(false);
            console.log('SMTP ERROR');
            setError("email", "invalid");
            var testID = "dsaddsa"

          }
          else if (res.data.smtp_check) {

            Firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then(function (result) {
              var userObj = { "uid": result.user.uid, "userEmail": result.user.email, "securityQuestion": data.question, "response": data.answer }
              const baseURL = apiKey.baseURL;
              const sendData = JSON.stringify(userObj);
              console.log('Sending at ' + baseURL + '/userAccount/createUserAccount');
              console.log("SENDING DATA : " + userObj);
              Axios.post(baseURL + '/userAccount/createUserAccount', sendData, {
                headers: {
                  'content-type': 'application/json',
                  'Access-Control-Allow-Origin': '*',

                }
              }).then(() => {
                console.log('Success');
              }).catch(error => {
                setLoading(false);
                console.log("Error" + error);
              });

              result.user.sendEmailVerification().then(function () {

                console.log('Verification Email sent to new user : ' + user.email);
                Firebase.auth().signOut();
              }).catch(function (error) {
                console.log(' Already Verified.');
                setLoading(false);
                console.log(error);
              });
              return result.user.updateProfile({ displayName: name })

            }).catch(function (error) {
              // Handle Errors here.


              var errorCode = error.code;
              errorb = true;
              var errorMessage = error.message;
              console.log("ErrorCode");
              console.log(errorCode);
              console.log("ErrorMessage");
              console.log(errorMessage);
              setLoading(false);
              setError("firebase", 'error', errorMessage);
            });
          }

          Firebase.auth().onAuthStateChanged(function (user) {

            if (user) {
              setUser(user);
              if (!user.emailVerified) {

              }


              setLoading(false);
              setShowModal(true);

              //    props.navigate("Auth");
              //   props.navigate("UserProfile");


            } else {
              setLoading(false);
              console.log("oops");
            }

          });
        }).catch(error => {
          console.log(error);
          setLoading(false);
        });

      } else {
        setLoading(false);
        if (data.email != data.confirmEmail) {

          console.log("email no good");
          setError("matchEmail", 'no match', "Emails do not match");

        }

        if (data.password != data.confirmPassword) {

          console.log("password no good");
          setError("matchPassword", 'no pmatch', "Passwords do not match");

        }

        if (!data.firstName) {

          setError("firstName", 'empty', "Cannot be blank!");

        }

        if (!data.lastName) {

          setError("lastName", 'empty', "Cannot be blank!");

        }

        if (data.question == data.answer) {

          console.log("password no good");
          setError("same", 'match', "Question and Answer must differ");

        }

      }
    } else {

      console.log('bad');

    }

  }
  const onChange = args => {
    return {
      value: args[0].nativeEvent.text,
    };
  };
  const logoutOfStack = () => {
    Firebase.auth().signOut();
    navigation.navigate('Login');
  }
  const capturePrint = async args => {
   
    captureView.capture().then(uri => {
      console.log("do something with ", uri);
    });
  };
  const pdfPrint = args => {
    
    /*
   Print.printAsync().then(data=>{
    console.log(data);
   });
   */
  };
  return (


    <View   style={styles.container}>
      <Button onPress={pdfPrint}>Print</Button>
      <Button onPress={capturePrint}>capture</Button>
      <Title style={{ color: '#1E88E5', fontSize: 30, marginTop: 20, alignSelf: 'center' }}>Create Account</Title>
      <Subheading style={styles.label}>Email</Subheading>
      <Controller
        as={<TextInput style={styles.input} />}
        name="email"
        control={control}
        onChange={onChange}
        rules={{ pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9][a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }}
      />
      {errors.email && <Subheading style={{ color: '#BF360C', fontSize: 15, fontWeight: '600' }}>Invalid Email.</Subheading>}

      <Subheading style={styles.label}>Confirm Email</Subheading>
      <Controller
        as={<TextInput style={styles.input} />}
        name="confirmEmail"
        control={control}
        onChange={onChange}
        rules={{ pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9][a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }}
      />
      {errors.confirmEmail && <Subheading style={{ color: '#BF360C', fontSize: 15, fontWeight: '600' }}> Invalid Email.</Subheading>}
      {errors.matchEmail && <Subheading style={{ color: '#BF360C', fontSize: 15, fontWeight: '600' }}> Emails do not match</Subheading>}

      <Subheading style={styles.label}>Password</Subheading>
      <Controller
        as={<TextInput maxLength={25} style={styles.input} secureTextEntry={true} />}
        name="password"
        control={control}
        onChange={onChange}
        rules={{ required: true, pattern: /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/ }}
      />
      <HelperText style={{ fontSize: 15, color: "#FFC400" }}>Rules: Must be at least 8 characters.Should contain at least an uppercase letter,a number and a special character. </HelperText>
      {errors.password && <Subheading style={{ color: '#BF360C', fontSize: 15, fontWeight: '600' }}>Invalid Password.</Subheading>}

      <Subheading style={styles.label}>Confirm Password</Subheading>
      <Controller
        as={<TextInput maxLength={25} style={styles.input} secureTextEntry={true} />}
        name="confirmPassword"
        control={control}
        onChange={onChange}
        rules={{ required: true, pattern: /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/ }}
      />
      {errors.confirmPassword && <Subheading style={{ color: '#BF360C', fontSize: 15, fontWeight: '600' }}>Invalid Password.</Subheading>}
      {errors.matchPassword && <Subheading style={{ color: '#BF360C', fontSize: 15, fontWeight: '600' }}> Passwords do not match</Subheading>}

      <Title style={{ color: '#1E88E5', marginTop: 20 }}>User Details</Title>
      <Subheading style={styles.label}>First name</Subheading>
      <Controller
        as={<TextInput maxLength={30} style={styles.input} />}
        onChange={onChange}
        control={control}
        name="firstName"
        rules={{ pattern: /^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]){1,}/ }}
      />
      {errors.firstName && <Text style={{ color: '#BF360C' }}>This is required.</Text>}

      <Subheading style={styles.label}>Last name</Subheading>
      <Controller
        as={<TextInput maxLength={30} style={styles.input} />}
        name="lastName"
        control={control}
        onChange={onChange}
        rules={{ pattern: /^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]){1,}/ }}

      />
      {errors.lastName && <Text style={{ color: '#BF360C' }}>This is required.</Text>}

      <Title style={{ color: '#1E88E5', marginTop: 20 }}>Security Questions</Title>
      <Subheading style={styles.label}>Question</Subheading>
      <Controller
        as={<TextInput style={styles.input} />}
        name="question"
        control={control}
        onChange={onChange}
        rules={{ required: true }}
      />
      {errors.answer && <Subheading style={{ color: '#BF360C' }}>You must enter a question.</Subheading>}

      <Subheading style={styles.label}>Answer</Subheading>
      <Controller
        as={<TextInput style={styles.input} />}
        name="answer"
        control={control}
        onChange={onChange}
        rules={{ required: true }}
      />
      {errors.answer && <Subheading style={{ color: '#BF360C' }}>You must provide an answer.</Subheading>}
      {errors.same && <Subheading style={{ color: '#BF360C' }}>Your answer cannot be same as the question.</Subheading>}
      {errors.firebase && <Subheading style={{ color: '#BF360C' }}>{errors.firebase.message}</Subheading>}

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Button loading={loading} style={{ marginHorizontal: 10, marginTop: 20, backgroundColor: '#29D4FA' }} pre mode="contained" onPress={handleSubmit(onSubmit)}>
          Register
            </Button>

      </View>
      <Provider>
        <Portal>
          <Modal dismissable={false} visible={showModal} contentContainerStyle={styles.modalStyle}>
            <View >
              <Card.Content>
                <Title style={{ fontSize: 30 }}>Verification Required</Title>
                <Subheading style={{ fontSize: 20, color: '#000000', marginTop: 10 }}>You need to verify your account to proceed further</Subheading>
                <Subheading style={{ fontSize: 20, color: '#E91E63', marginTop: 10 }}>A verification email has been sent to your email.
                </Subheading>
                <Subheading style={{ fontSize: 20, color: '#E91E63', marginTop: 10 }}>Email: {user.email} </Subheading>
                <Button style={{ backgroundColor: '#C62828' }} color='#FF00FF' mode="contained" onPress={logoutOfStack}>Close and ReLogin </Button>
              </Card.Content>
            </View>
          </Modal>

        </Portal>
      </Provider>
    </View>

  );
}
export default RegisterForm;
