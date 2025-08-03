import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import { loginRequest } from '../services/api';

export default function Login() {
  const navigation = useNavigation();

  // Renomeado para 'email' para maior clareza
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha seu e-mail e senha.");
      return;
    }

    setIsLoading(true);

    try {
      const data = { email, senha };
      const { token } = await loginRequest(data);

      console.log(token)
      const decoded = jwtDecode(token);
      const tipoUsuario = decoded?.role || decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      console.log("Tipo do usuário:", tipoUsuario);
      Alert.alert("Sucesso", "Login realizado com sucesso!");

      switch (tipoUsuario) {
        case 'Admin':
          navigation.navigate("HomeAdmin", decoded?.nome);
          break;
        case 'Jogador':
          navigation.navigate("HomeAluno", decoded?.nome);
          break;
        case 'Professor':
          navigation.navigate("HomeGestor", decoded?.nome);
          break;
        default:
          Alert.alert("Erro", "Tivemos um erro ao identificar seu usuario.");
      }

      navigation.navigate("Home", { tipoUsuario });
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      Alert.alert("Erro no Login", "E-mail ou senha inválidos. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperação de senha', 'Funcionalidade ainda não implementada.');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/lauerp-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.label}>E-mail:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!isLoading}
      />

      {/* O botão agora mostra um indicador de atividade quando está carregando */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
        <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f4f4f4',
  },
  logo: {
    width: '80%',
    height: 150,
    alignSelf: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F2BD1D',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F2BD1D_80', // Cor com opacidade para indicar que está desabilitado
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  forgotPassword: {
    color: '#007bff',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
