/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
  Picker,
  TextInput,
  AsyncStorage,
} from 'react-native';


import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

/*
Colors:
Black : #1d1f21
White : #efeae1
Red   : #ef3e36
Yellow: #e4b363
Orange: #ee8434
Purple: #a06cd5
Blue  : #507dbc
Green : #62a87c

*/









class Task extends Component {
  render(){
    return(
      <View key={this.props.keyval} style={{marginHorizontal:20, marginTop:6, padding:2}}>
        <Text style={{fontFamily:'Roboto Bold', fontSize:30, textAlign: 'center', color: '#1d1f21'}}>{this.props.title}</Text>
        <Text style={{fontFamily:'Roboto Regular', fontSize:15, textAlign: 'center', color: '#1d1f21'}}>{this.props.time}</Text>
        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontFamily:'Roboto Thin', fontSize:15, color: '#1d1f21'}}>{this.props.date}</Text>
          <TouchableOpacity onPress={this.props.deleteMethod} style={{alignItems: 'center', paddingVertical:5, borderRadius:10}}>
            <Image style={{width:25, height:25}} source={{uri: 'https://img.icons8.com/material-outlined/24/000000/waste.png'}}/>
          </TouchableOpacity>
        </View>
        <Text style={{fontFamily:'Roboto Thin', fontSize:15, textAlign:'justify', color: '#1d1f21'}}>{this.props.notes}</Text>
      </View>
      )
  }
}








class HomePage extends Component {

  newTask(){
      if(this.state.taskTitle != ''){
        var d = new Date();
        this.state.taskArray.push({'title':this.state.taskTitle, notes:this.state.taskNotes, time:this.state.taskTime, date:d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear()});
        
        var stringifiedArray = JSON.stringify(this.state.taskArray)
        AsyncStorage.setItem(
          '@Dopamine:taskArray',
          stringifiedArray
        )
        this.setState({taskTitle:''})
        this.setState({taskNotes:''})
        this.setState({taskTime:''})
        this.setState({newTaskModal:false})  
      }
    }

  removeTask(key){
      this.state.taskArray.splice(key, 1)
      this.setState({taskArray:this.state.taskArray})

      var stringifiedArray = JSON.stringify(this.state.taskArray)
      AsyncStorage.setItem(
        '@Dopamine:taskArray',
        stringifiedArray
      )
    }

  LoadTasks() {
      AsyncStorage.getItem(
        '@Dopamine:taskArray'
      ).then(taskArray => {
        var restoredArray = JSON.parse(taskArray)
        if(restoredArray != null){
          this.setState({
            taskArray: restoredArray
          })
        }else{
          this.setState({
            taskArray: []
          })
        }
      })
  }

  setDate = (event, date) => {
    date = date || this.state.date;

    var time = String(date).split(' ');
    time = String(time[4]).split(':');
    time = String(time[0]) + ":" + String(time[1]);

    this.setState({
      taskTime:time,
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
  }
 
  timepicker = () => {
    this.setState({
      show: true,
    });
  }

  constructor(){
    super()
    this.LoadTasks()
    this.state={
      taskArray: [],
      taskTitle:'',
      taskNotes:'',
      taskTime: '',
      newTaskModal:false,
      date: new Date(),
      show: false,
      taskList:''

    }
  }

  render(){
    
    var tasks = this.state.taskArray.map((val, key) => {
      return(
        <Task key={key} keyval={key} deleteMethod={() => this.removeTask(key)} title={val.title} date={val.date} notes={val.notes} time={val.time}/>
      ) 
    })


    const { show, date } = this.state;

    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var day = days[new Date().getDay()];
    var month = months[new Date().getMonth()];
    var year = new Date().getFullYear();

    return (
      <View style={{flex:1,backgroundColor:'#ebf2fa'}}>
        <Modal transparent={true} visible={this.state.newTaskModal} animationType="slide">
            <View style={{backgroundColor: 'rgba(0,0,0,0.8)',flex:1, justifyContent: 'center'}}>
              <View style={{margin:25,backgroundColor: '#ebf2fa', borderRadius:10}}>
                <ScrollView>

                  <View style={{alignItems:'flex-end', margin:6}}>
                    <TouchableOpacity onPress={()=>{this.setState({newTaskModal:false})}} style={{backgroundColor:'#1d1f21',height:30, width:30, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontFamily:'Roboto Bold', fontSize:10, color: '#efeae1'}}>X</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{margin:4, alignItems: 'center'}}>
                    <Text style={{fontFamily:'Roboto Regular', fontSize:35}}>Title:</Text>
                    <TextInput onChangeText={(taskTitle) => this.setState({taskTitle})} style={{fontSize:25, fontFamily:'Roboto Thin', borderBottomWidth: 1, borderBottomColor: '#1d1f21'}} placeholder="     Ex: Pay Bills     "/>
                  </View>

                  <View style={{margin:4, alignItems: 'center'}}>
                    <Text style={{fontFamily:'Roboto Regular', fontSize:35}}>Details:</Text>
                    <TextInput onChangeText={(taskNotes) => this.setState({taskNotes})} style={{fontSize:25, fontFamily:'Roboto Thin', borderBottomWidth: 1, borderBottomColor: '#1d1f21'}} placeholder="Ex: Pay the bill of house"/>
                  </View>

                  <View style={{marginHorizontal:60, marginTop:10, borderWidth: 2, borderColor: '#4B77BE', borderRadius:15 }}>
                    <TouchableOpacity style={{backgroundColor:'#4B77BE', alignItems: 'center', paddingVertical:5, borderRadius:10}} onPress={this.timepicker}>
                      <Text style={{fontFamily:'Roboto Regular', fontSize:20, color: '#efeae1'}}>Set a Time</Text>
                    </TouchableOpacity>

                    <View style={{alignItems: 'center', paddingVertical:5}}> 
                      <Text style={{fontFamily:'Roboto Regular', fontSize:20, color: '#1d1f21'}}>{this.state.taskTime}</Text>
                    </View>

                  </View>
                  
                  { show && <DateTimePicker value={date} mode='time' onChange={this.setDate} /> }

                  <TouchableOpacity onPress={this.newTask.bind(this)} style={{backgroundColor:'#1d1f21', padding: 10, marginHorizontal: 80, marginVertical: 10, borderRadius:15, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontFamily:'Roboto Regular', fontSize:20, color: '#efeae1'}}>Create</Text>
                  </TouchableOpacity>

                </ScrollView>
              </View>
            </View>
        </Modal>

        <View style={{padding:15, backgroundColor: '#4B77BE', flex:1.5}}>
          <Text style={{color:'#efeae1', fontFamily:'Roboto Bold', fontSize:30}}>{day},</Text>
          <Text style={{color:'#efeae1', fontFamily:'Roboto Bold', fontSize:25}}>{month} {year}</Text>
        </View>

        <View style={{flex:10}}>
          <ScrollView style={{marginTop:10}}>
            {tasks}
            <View style={{paddingVertical:20}} />
          </ScrollView>
        </View>

        <View style={{flex:1,backgroundColor: '#4B77BE'}}>
          
        </View>

        <TouchableOpacity onPress={()=>{this.setState({newTaskModal:true})}} style={{position:'absolute',bottom:30, right:20, backgroundColor:'#ebf2fa',height:60, width:60, borderRadius:50, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#4B77BE'}}>
          <Text style={{fontFamily:'Roboto Regular', fontSize:30}}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const App: () => React$Node = () => {
  return (<HomePage/>);
};

export default App;
