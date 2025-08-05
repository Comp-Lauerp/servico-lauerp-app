import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Login from './components/Login';
import ChamadaJogadores from './components/Chamada';
import Home from './components/Home/Home';
import HomeAdmin from './components/Home/HomeAdmin';
import Calendario from './components/Calendario'
import StatusAlunos from './components/Alunos'
import HomeJogador from './components/Home/HomeJogador';
import HomeProfessor from './components/Home/HomeProfessor';
import NovoUsuario from './components/NovoUsuario';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NovoUsuario">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeAdmin"
          component={HomeAdmin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeJogador"
          component={HomeJogador}
          options={{ headerShown: false }}
        />

         <Stack.Screen
          name="HomeProfessor"
          component={HomeProfessor}
          options={{ headerShown: false }}
        />  
        
        <Stack.Screen
          name="NovoUsuario"
          component={NovoUsuario}
          options={{ headerShown: false }}
        />




        <Stack.Screen
          name="Chamada"
          component={ChamadaJogadores}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Calendario"
          component={Calendario}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Aluno"
          component={StatusAlunos}
          options={{ headerShown: false }}
        />



      </Stack.Navigator>
    </NavigationContainer>
  );
}
