import React from 'react'
import { StyleSheet, Text, View,Button } from 'react-native'


const Profile = ({signOut}) => {
  return (
    <View style={styles.main}>
        <Text>Profile</Text>
        <Button title='Sign Out' onPress={signOut}></Button>
    </View>
  )
}


const styles=StyleSheet.create({
    main:{
        flex:1
    }
})

export default Profile
