//https://www.youtube.com/watch?v=2MjAAcF0L5s&ab_channel=kymzTech

import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
const COLORS = {primary:'#1f145c', white:'#fff'};


const App = () => {
  const [textInput, setTextInput] = useState('');
  const [todos,setTodos] = useState([
    {id:1,task: ' First Todo', complated:true},
    {id:2,task: ' Second Todo', complated:false},
  ]);
  useEffect(() => { getTodosFromUserDevices();}, []);
  useEffect(() => {
    saveTodoTouserDevice(todos);
  },[todos]);
  
  const ListItem = ({todo}) => {
    return <View style = {styles.listItem}>
      <View style={{flex:1}}>
        <Text style={{fontWeight:'bold',fontSize:15, color:COLORS.primary,
         textDecorationLine: todo?.complated ? 'line-through' : 'none',}}>{todo?.task}</Text>
      </View>
      {
        !todo?.complated && (
      <TouchableOpacity  onPress={() => markTodoComplate(todo?.id)}
                         style={[styles.actionIcon]}>
        <Icon name='done' size={20} color={COLORS.white} />
      </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => deleteTodo(todo?.id)}
                        style={[styles.actionIcon, {backgroundColor:'red'}]}>
        <Icon name='delete' size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View>;
  };
  const saveTodoTouserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    }
    catch (e) {
    console.log(e);
    }

  };
  const getTodosFromUserDevices = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if(todos != null)
      {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  }
  const addTodo = () => {
   if(textInput == '') {
     Alert.alert('Error', 'Please input Todo');
   }
   else{
   const newTodo = {
     id:Math.random(),
     task: textInput,
     complated:false,
   };
   setTodos([...todos,newTodo]);
   setTextInput('');
    }
  };

  const markTodoComplate = todoId => {
    const newTodos = todos.map((item) => {
      if(item.id == todoId) {
        return {...item,complated:true}
      }
      return item;
    });
    setTodos(newTodos);
  };
  const deleteTodo = (todoId) => {
    const newTodos = todos.filter(item => item.id != todoId);
    setTodos(newTodos);
  };

  const clearTodos = () => {
    Alert.alert('Confirm', 'Clear todos?',[
      {text:'Evet', onPress: () => setTodos([])},
      {text: 'Hayır' },
    ]);
   
  }
  return (
    <SafeAreaView style={{flex:1,backgroundColor: COLORS.white}}>
    <View style={styles.header}>
      <Text style={{fontWeight:'bold',fontSize:20,color:COLORS.primary}}>ToDo APP</Text>
      <Icon name='delete' size={25} color='red' onPress={clearTodos} />
    </View>
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{padding:20, paddingBottom:100}}
      data={todos} renderItem={ ({item}) => <ListItem todo = {item}/>}/>


    <View style={styles.footer}>
      <View style={styles.inputContainer}>
        <TextInput 
        placeholder='Add ToDo' 
        value={textInput}
        onChangeText={text => setTextInput(text)}
        />

      </View>
      <TouchableOpacity onPress={addTodo} >
      <View style={styles.iconContainer}>
        <Icon name='add' size={30} color={COLORS.white} /> 
      </View>
    </TouchableOpacity>
   
    </View>

    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  header: {
    padding:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',

  },
  footer: { 
    position:'absolute',
    bottom:0,
    color: COLORS.white,
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:20,

  },
  inputContainer:{
    backgroundColor: COLORS.white,
    elevation:40,
    flex:1,
    height:50,
    marginVertical:20,
    marginRight:20,
    borderRadius:30,
    paddingHorizontal:20,
  },
  iconContainer:{
    height:50,
    width:50,
    backgroundColor:COLORS.primary,
    borderRadius:25,
    elevation:40,
    justifyContent:'center',
    alignItems:'center',
  },
  listItem: {
    padding:20,
    backgroundColor:COLORS.white,
    flexDirection:'row',
    elevation:12,
    borderRadius:7,
    marginVertical:10
  },
  actionIcon: {
    height:25,
    width:25,
    backgroundColor:'green',
    justifyContent:'center',
    alignItems:'center',
    marginLeft: 5,
    borderRadius: 3 ,
  }
});
export default App;