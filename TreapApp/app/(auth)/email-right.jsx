import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ConfirmationEmail = () => {
  const goToLogIn = () => {
    // Função para reenviar o email de confirmação
    console.log('Reenviar email de confirmação');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/yes.png')} style={styles.image} />
      <Text style={styles.confirmationText}>Email confirmado com sucesso</Text>
      <TouchableOpacity onPress={goToLogIn}>
        <Text style={styles.resendLink}>Ir para a página de Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  resendLink: {
    fontSize: 14,
    color: '#8A2BE2',
    textAlign: 'center',
  },
});

export default ConfirmationEmail;
