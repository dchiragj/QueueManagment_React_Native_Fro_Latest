import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Linking, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { colors } from '../styles';

const UpdatePopup = () => {

  const [show, setShow] = useState(false);
  const [force, setForce] = useState(false);
  const [url, setUrl] = useState('');

  const JSON_URL = "https://raw.githubusercontent.com/dchiragj/QueueFlow_Version_Update/main/appupdate.json";

  useEffect(() => {
    checkUpdate();
  }, []);

  async function checkUpdate() {
    try {

      const currentCode = await DeviceInfo.getBuildNumber();

      const res = await fetch(JSON_URL + "?t=" + Date.now());
      const data = await res.json();

      if (Number(data?.latestVersionCode) > Number(currentCode)) {
        setForce(data?.forceUpdate);
        setUrl(data?.playStoreUrl);
        setShow(true);
      }

    } catch (e) {
      console.log("Update API error:", e.message);
    }
  }

  return (
    <Modal visible={show} transparent animationType="fade">

      <View style={{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.6)',
        justifyContent:'center',
        alignItems:'center'
      }}>

        {/* CARD */}
        <View style={{
          backgroundColor:'#fff',
          borderRadius:20,
          padding:20,
          width:'85%',
          alignItems:'center'
        }}>

          {/* IMAGE */}
          <Image
            source={require('../assets/images/appupdate.png')}
            style={{width:250,height:150,resizeMode:'contain',marginBottom:10,borderRadius:20}}
          />

          <Text style={{fontSize:18,fontWeight:'800',marginTop:10}}>
            App Update Required!
          </Text>

          <Text style={{textAlign:'center',marginTop:8,fontSize:14,color:'#555'}}>
            We have added new features and fixes to improve your experience.
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor:colors.primary,
              padding:12,
              borderRadius:10,
              marginTop:18,
              width:'90%'
            }}
            onPress={() => Linking.openURL(url)}
          >
            <Text style={{color:'#fff',textAlign:'center',fontSize:16}}>
              Update App
            </Text>
          </TouchableOpacity>

          {!force && (
            <TouchableOpacity
              style={{padding:10,marginTop:8}}
              onPress={() => setShow(false)}
            >
              <Text style={{textAlign:'center'}}>Later</Text>
            </TouchableOpacity>
          )}

        </View>

      </View>

    </Modal>
  );
};

export default UpdatePopup;
