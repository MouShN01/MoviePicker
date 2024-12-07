import { Alert, ImageBackground, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {auth} from "../../firebase"

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () =>{
        if(email.trim()==="" || password.trim()==="")
        {
            return Alert.alert("Ohh!", "You have not entered all the details")
        }
        try{
            await signInWithEmailAndPassword(auth, email, password)
            router.replace("/")
        }
        catch(error:any)
        {
            Alert.alert(error.message)
        }
    }
    return (
        <ImageBackground 
            className="flex-1"
            resizeMode='cover'
            source = {require("C:\\Users\\sasha\\MoviePicker\\assets\\images\\Bg_2var.jpg")}
        >
            <View className="flex-1 justify-center items-center">
                <Text className="font-bold text-2xl text-black">Sign In</Text>
                <Text className="text-white font-semibold">Access to your accont</Text>
                <View className="w-full p-5">
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
                        onPress={signIn}
                    >
                        <Text className="text-center text-white font-bold">Sign In</Text>
                    </TouchableOpacity>
                    <Link href="/register">
                        <Text className="text-center text-gray-100 pt-3">
                            Doesn't have an account?
                        </Text>
                    </Link>
                </View>
            </View>
        </ImageBackground>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})