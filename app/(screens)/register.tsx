import { Alert, ImageBackground, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {auth} from "../../firebase"

const RegisterScreen = () => {
  const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signUp = async () =>{
        if(name.trim()==="" || email.trim()==="" || password.trim()==="")
        {
            return Alert.alert("Ohh!", "You have not entered all the details")
        }
        try{
          const {user} = await createUserWithEmailAndPassword(auth, email, password)
          updateProfile(user, {displayName: name});
          router.replace("/")
        }
        catch(error:any)
        {
          Alert.alert(error.message)
        }
    }

    return (
        <ImageBackground className="flex-1"
            resizeMode='cover'
            source = {require("C:\\Users\\sasha\\MoviePicker\\assets\\images\\Bg_2var.jpg")}
        >
            <View className="flex-1 justify-center items-center">
                <Text className="font-bold text-2xl text-black">Sign Up</Text>
                <Text className="text-white font-semibold">Create a new accaunt</Text>
                <View className="w-full p-5">
                    <Text className="font-semibold pb-2 text-white">Name</Text>
                    <TextInput
                    className=
                        "bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg w-full p-2.5 mb-4"
                        
                        value={name}
                        onChangeText={(text)=>setName(text)} 
                    />
                    <Text className="font-semibold pb-2 text-white">Email</Text>
                    <TextInput
                    keyboardType="email-address"
                    className=
                        "bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg w-full p-2.5 mb-4"
                        
                        value={email}
                        onChangeText={(text)=>setEmail(text)}
                    />
                    <Text className="font-semibold pb-2 text-white">Password</Text>
                    <TextInput
                    secureTextEntry={true}
                    className=
                        "bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg w-full p-2.5 mb-4"
                        value={password}
                        onChangeText={(text)=>setPassword(text)}
                    />
                    <TouchableOpacity
                        className="w-full rounded-lg mt-8 bg-black py-3"
                        onPress={signUp}
                    >
                        <Text className="text-center text-white font-bold">Sign Up</Text>
                    </TouchableOpacity>
                    <Link href="/login">
                        <Text className="text-center text-gray-100 pt-3">
                            Already have an account?
                        </Text>
                    </Link>
                </View>
            </View>
        </ImageBackground>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({})