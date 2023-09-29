import { AbookViewModel } from '..'
import {
  toCurrentMonthDate,
  toEndOfMonthDate,
  toStartOfMonthDate,
} from '../utils/abook'

export interface AbookViewState {
  today: Date
  abook: AbookViewModel
}

export function abookViewComponent<State extends AbookViewState>({
  state,
}: {
  state: State
}) {
  function isRegisted() {
    return !!state.abook.abookId
  }

  function startOfMonthDate() {
    return toStartOfMonthDate({
      date: state.today,
      abook: state.abook,
    })
  }

  function endOfMonthDate() {
    return toEndOfMonthDate({
      date: state.today,
      abook: state.abook,
    })
  }

  function currentMonthDate() {
    return toCurrentMonthDate({
      date: state.today,
      abook: state.abook,
    })
  }

  return {
    state,
    views: {
      get isRegisted() {
        return isRegisted()
      },
      get startOfMonthDate() {
        return startOfMonthDate()
      },
      get endOfMonthDate() {
        return endOfMonthDate()
      },
      get currentMonthDate() {
        return currentMonthDate()
      },
    },
  }
}
