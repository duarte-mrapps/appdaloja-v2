import { NativeModules } from 'react-native'

const { ModernSplashScreen } = NativeModules

export default {
  hide: () => ModernSplashScreen.hide(),
  show: () => ModernSplashScreen.show(),
}
