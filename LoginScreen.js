import React, { useState, Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, AsyncStorage } from 'react-native';
import { Block, Errors } from "galio-framework";

import axios from 'axios';
import {
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView
} from 'react-native';
import { Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { Alert } from 'react-native';

const { width, height } = Dimensions.get("screen");
export default class LoginScreen extends Component {


  constructor(props) {

    super(props);

    this.checkIfLogged();
    this.state = {
      username: "",
      password: "",

    }

  }


  async checkIfLogged() {
    let token = await AsyncStorage.getItem('ACCESS_TOKEN');
    let userRole = await AsyncStorage.getItem('USER_ROLE');
    // alert(token);
    if (token != undefined && token != null) {
      if(userRole==1)
      this.props.navigation.navigate('TherapistHome');
      else
      this.props.navigation.navigate('PatientDashboard');
    }
  }

  async onLoginPressed() {
    const { username, password } = this.state;
    if (username == "" || password == "") {
      Alert.alert('جميع الحقول مطلوبة');
      return;
    }
    axios({
      method: 'POST',
      responseType: 'json',
      url: `http://165.22.218.109/api/login`,
      data: {
        username: this.state.username,
        password: this.state.password
      }
    })
      .then(response => {
        const data = response.data;
        
        
        this.storeData(JSON.stringify(data.token_data.access_token),
        JSON.stringify(data.user_role),JSON.stringify(data.user.id),JSON.stringify(data.user.name));
        if(data.user_role == 1){
          this.props.navigation.navigate('TherapistHome');
        }
       else if(data.user_role == 2){
        this.props.navigation.navigate('PatientDashboard');

      }
      else {
        alert("Unkonw User Role! , Contact Admin plase.")
        return;
      }
      })
      .catch(err => {
        Alert.alert('invalid username or password!');
        return;
      });

  }//end of onLoginPressed

 
 

  async storeData(token, user_role , user_id , full_name) {

    try {
      await AsyncStorage.multiSet([['ACCESS_TOKEN', token], ['USER_ROLE', user_role] , ['USER_ID', user_id] , ['USER_FULL_NAME',full_name]], null);
    } catch (err) {
      console.log('error during storing data: ', err);
    }
  }
  




  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.container}>
          <Block flex middle>
            <StatusBar hidden />
            <ImageBackground
              source={Images.RegisterBackground}
              style={{ width, height, zIndex: 1 }}>
              <Block flex middle>
                <Block style={styles.registerContainer}>
                  <Block flex={0.25} middle style={styles.socialConnect}>
                    <Text style={{ fontSize: 30 }} > تسجيل الدخول</Text>

                  </Block>
                  <Block flex>
                    <Block flex={0.17} middle>

                    </Block>
                    <Block flex center>
                      <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="padding"
                        enabled>

                        <Block width={width * 0.8} style={{ marginBottom: 15 }}>



                          <View style={styles.container}>


                            <View style={styles.inputContainer}>
                              <Image style={styles.inputIcon} source={{ uri: 'https://img.icons8.com/ultraviolet/40/000000/email.png' }} />
                              <TextInput style={styles.inputs}
                                placeholder="اسم المستخدم"
                                underlineColorAndroid='transparent'
                                onChangeText={(username) => this.setState({ username })} />
                            </View>

                            <View style={styles.inputContainer}>
                              <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }} />
                              <TextInput style={styles.inputs}
                                placeholder="كلمة المرور"
                                secureTextEntry={true}
                                underlineColorAndroid='transparent'
                                onChangeText={(password) => this.setState({ password })} />
                            </View>

                            <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]}
                              onPress={this.onLoginPressed.bind(this)}>
                              <Text style={styles.signUpText}>تسجيل الدخول</Text>
                            </TouchableHighlight>


                          </View>

                        </Block>
                      </KeyboardAvoidingView>
                    </Block>
                    <Button
                      title="نسيت كلمة المرور؟"
                      onPress={() => this.props.navigation.navigate('ResetPassword')}
                    />
                  </Block>

                </Block>
              </Block>
              <Text style={styles.error}>
                {this.state.errors}
              </Text>
            </ImageBackground>
          </Block>
        </View>
      </KeyboardAvoidingView>
    );
  }
}


const styles = StyleSheet.create({
  container: {

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00b5ec',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  signupButton: {
    backgroundColor: "#FF4DFF",
  },
  signUpText: {
    color: 'white',
  }
  ,
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    paddingTop: 10
  },
  input: {
    height: 20,
    marginTop: 0,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'

  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  heading: {
    fontSize: 30,
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  success: {
    color: 'green',
    paddingTop: 10
  },
  loader: {
    marginTop: 20
  }

  , registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  }
});

