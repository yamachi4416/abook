import { AbookUtils, AbookViewComponent, AbookViewState } from './deps'

export function abookViewComponent<State extends AbookViewState>({
  state,
}: {
  state: State
}): AbookViewComponent<State> {
  return {
    state,
    views: {
      get isRegisted() {
        return !!state.abook.abookId
      },
      get startOfMonthDate() {
        return AbookUtils.toStartOfMonthDate({
          date: state.today,
          abook: state.abook,
        })
      },
      get endOfMonthDate() {
        return AbookUtils.toEndOfMonthDate({
          date: state.today,
          abook: state.abook,
        })
      }
    },
  }
}
