import { AccountsService, JournalsService } from "../services";
import { JournalsBalanceState } from "./interfaces";

export function journalsBalanceComponent<State extends JournalsBalanceState>({
  journalsService,
  accountsService,
  state
}: {
  journalsService: JournalsService
  accountsService: AccountsService
  state: State
}) {

  
}