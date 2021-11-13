import { Haptics } from '@capacitor/haptics'

const vibrate = async (duration: number = 300): Promise<void> => await Haptics.vibrate({ duration })

export interface IUseHaptics {
  vibrate: (duration?: number) => Promise<void>
}

const useHaptics = (): IUseHaptics => {
  return {
    vibrate
  }
}
export default useHaptics
