import { AbookViewModel } from '@abook/models'

export function useCurrentAbookState() {
  const current = useState<AbookViewModel>()
  return {
    current: computed(() => current.value),
    setCurrent(abook: AbookViewModel) {
      current.value = abook
    },
  }
}
