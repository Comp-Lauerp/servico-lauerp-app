import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaskInput from 'react-native-mask-input';
import { criarUsuario } from '../services/api'; // ajuste caminho

export default function CadastrarUsuario() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    tipoUsuario: null, // número
    matricula: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const tiposUsuario = [
    { label: 'Professor', value: 1 },
    { label: 'Jogador', value: 2 },
  ];

  const handleChange = (key, value) => {
    if (key === 'tipoUsuario' && value === 1) {
      setForm(prev => ({ ...prev, tipoUsuario: value, matricula: '' }));
    } else {
      setForm(prev => ({ ...prev, [key]: value }));
    }
  };

  // Converte "DD/MM/AAAA" para objeto Date válido para o DatePicker
  const parseDate = (str) => {
    const [day, month, year] = str.split('/');
    if (!day || !month || !year) return new Date();
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      handleChange('dataNascimento', formattedDate);
    }
  };

  const handleSubmit = async () => {
    if (
      !form.nome ||
      !form.cpf ||
      !form.dataNascimento ||
      !form.email ||
      !form.tipoUsuario
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);

    try {
      // Remove máscaras para enviar limpo
      const dataToSend = {
        ...form,
        cpf: form.cpf.replace(/\D/g, ''),
        telefone: form.telefone.replace(/\D/g, ''),
        matricula: form.matricula.trim(),
        // converter dataNascimento para formato ISO (yyyy-mm-dd)
        dataNascimento: (() => {
          const [d, m, y] = form.dataNascimento.split('/');
          return `${y}-${m}-${d}`;
        })(),
      };

      await criarUsuario(dataToSend);
      Alert.alert('Sucesso', 'Usuário criado com sucesso!');

      setForm({
        nome: '',
        cpf: '',
        dataNascimento: '',
        telefone: '',
        email: '',
        tipoUsuario: null,
        matricula: '',
      });
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao cadastrar usuário'
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Cadastro de Usuário</Text>

      <Text style={styles.label}>Nome completo:</Text>
      <MaskInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={form.nome}
        onChangeText={(text) => handleChange('nome', text)}
      />

      <Text style={styles.label}>CPF:</Text>
      <MaskInput
        style={styles.input}
        placeholder="000.000.000-00"
        value={form.cpf}
        keyboardType="numeric"
        mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
        onChangeText={(masked) => handleChange('cpf', masked)}
      />

      <Text style={styles.label}>Data de Nascimento:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <MaskInput
          style={[styles.input, { flex: 1 }]}
          placeholder="DD/MM/AAAA"
          value={form.dataNascimento}
          keyboardType="numeric"
          mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
          onChangeText={(masked) => handleChange('dataNascimento', masked)}
          maxLength={10}
        />
        <TouchableOpacity
          style={[styles.datePickerButton, { padding: 12, borderRadius: 10, backgroundColor: '#F2BD1D' }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>📅</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={form.dataNascimento ? parseDate(form.dataNascimento) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Telefone:</Text>
      <MaskInput
        style={styles.input}
        placeholder="(00) 00000-0000"
        value={form.telefone}
        keyboardType="phone-pad"
        mask={[
          '(',
          /\d/,
          /\d/,
          ')',
          ' ',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        onChangeText={(masked) => handleChange('telefone', masked)}
      />

      <Text style={styles.label}>E-mail:</Text>
      <MaskInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={form.email}
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}
      />

      <Text style={styles.label}>Tipo de Usuário:</Text>
      <View style={styles.radioGroup}>
        {tiposUsuario.map(({ label, value }) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.radioButton,
              form.tipoUsuario === value && styles.radioButtonSelected,
            ]}
            onPress={() => handleChange('tipoUsuario', value)}
          >
            <Text
              style={[
                styles.radioText,
                form.tipoUsuario === value && styles.radioTextSelected,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {form.tipoUsuario !== 1 && (
        <>
          <Text style={styles.label}>Matrícula (opcional):</Text>
          <MaskInput
            style={styles.input}
            placeholder="Digite a matrícula"
            value={form.matricula}
            onChangeText={(masked) => handleChange('matricula', masked)}
          />
        </>
      )}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 28,
    textAlign: 'center',
    color: '#222',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 14,
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#F2BD1D',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
    gap: 12,
    flexWrap: 'wrap',
  },
  radioButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    minWidth: 110,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#F2BD1D',
    borderColor: '#F2BD1D',
  },
  radioText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  radioTextSelected: {
    color: '#000',
    fontWeight: '700',
  },
});
