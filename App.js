import { StatusBar } from 'expo-status-bar'; 
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

let nextId = 0;

export default function App() {
  const [name, setName] = useState('');
  const [todos, setTodos] = useState([]);

useEffect(()=> {
  const loadTodos=async()=>{
    try{
      const todosString=await AsyncStorage.getItem('todos');
      if(todosString){
        setTodos(JSON.parse(todosString));
      }
    }catch(error){
      console.error('Failed to load todos from AsyncStorage',error);
    }
  };
  loadTodos();
},[]);

useEffect(()=>{
  const saveTodos=async()=>{
    try{
      await AsyncStorage.setItem('todos',JSON.stringify(todos));
    }catch (error){
      console.error('Failed to save todos to AsyncStorage',error);
    }
  };
saveTodos();
},[todos]);

  const addTodo = () => {
    if (name.trim()) {
      setTodos([...todos, { id: nextId++, name, completed: false }]); 
      setName('');
    }
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleComplete(item.id)}>
      <View style={styles.item}>
        <Text style={[styles.itemText, item.completed && styles.completed]}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder='Enter task'
        />
        <TouchableOpacity style={styles.saveButton} onPress={addTodo}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
   textAlign: 'center'
  },
  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'transparent',
    borderBottomWidth: 1, 
    borderBottomColor: 'gray',
    paddingHorizontal: 8,
  },
  saveButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    backgroundColor:'white', 
    fontWeight: 'bold',
    color: 'blue',
  
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  itemText: {
    fontSize: 18,
  },
  completed: {
    textDecorationLine: 'line-through', 
    color: 'gray',
  },
});
