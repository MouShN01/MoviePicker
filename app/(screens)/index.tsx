import { Button, StyleSheet, Text, View } from 'react-native'
import {useEffect} from 'react'
import {router} from 'expo-router'
import useAuth from '../../hooks/useAuth'


const Index = () => {
  const {user, logout} = useAuth()
  if(!user) return null
  return (
    <View>
      <Text>{user.email}</Text>
      <Button title="logout" onPress={logout}/>
    </View>
  )
}

export default Index

const styles = StyleSheet.create({})