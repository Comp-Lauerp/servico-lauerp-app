import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const hoje = new Date();
const dia = String(hoje.getDate()).padStart(2, '0');
const mes = String(hoje.getMonth() + 1).padStart(2, '0');
const dataAtual = `${dia}/${mes}`;

export default function HomeJogador() {

  
  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Image
          source={require('../../assets/lauerp-logo.png')}
          style={estilos.logo}
          resizeMode="contain"
        />
        <Text style={estilos.textocabecalho}>Tela Inicial</Text>
      </View>

      <View style={estilos.barraTopo}>
        <Text style={estilos.textoTopo}>Data de Relatório Mensal</Text>
        <Text style={estilos.dataTopo}>{dataAtual}</Text>
      </View>

      <TouchableOpacity style={[estilos.botao, { backgroundColor: '#FACC15' }]}>
        <FontAwesome5 name="users" size={24} color="white" style={estilos.icone} />
        <Text style={estilos.textoBotao}>Presenca</Text>
      </TouchableOpacity>


      <TouchableOpacity style={[estilos.botao, { backgroundColor: '#450A0A' }]}>
        <FontAwesome5 name="calendar-alt" size={24} color="white" style={estilos.icone} />
        <Text style={estilos.textoBotao}>Calendário</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 90,
    height: 90,
    marginRight: 10,
  },
  textocabecalho: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  barraTopo: {
    backgroundColor: '#FACC15',
    height: 42,
    borderRadius: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  textoTopo: {
    fontWeight: 'bold',
    color: '#000',
  },
  dataTopo: {
    fontWeight: 'bold',
    color: '#000',
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  icone: {
    marginRight: 10,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
