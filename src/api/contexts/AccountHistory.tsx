import React from "react";
import { rpc } from "api/rpc";
import { isValidAccountAddress } from "components/utils";
import { Type, Subtype } from "types/Transaction";

export interface History {
  type: Type;
  subtype?: Subtype;
  representative: string;
  account: string;
  amount: string;
  local_timestamp: string;
  height: string;
  hash: string;
}

export interface AccountHistory {
  account: string;
  history: History[];
  previous: string;
}

interface AccountHistoryParams {
  count?: string;
  raw?: boolean;
  head?: string;
  offset?: number;
  reverse?: boolean;
  account_filter?: string[];
}

export interface UsePeersReturn {
  accountHistory: AccountHistory;
  isLoading: boolean;
  isError: boolean;
}

const Provider = (
  account: string,
  params: AccountHistoryParams,
): UsePeersReturn => {
  const [accountHistory, setAccountHistory] = React.useState(
    {} as AccountHistory,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const getAccountHistory = async (
    account: string,
    params: AccountHistoryParams,
  ) => {
    setIsError(false);
    setIsLoading(true);

    const json = await rpc("account_history", {
      account,
      ...params,
    });

    !json || json.error ? setIsError(true) : setAccountHistory(json);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (!isValidAccountAddress(account)) return;

    getAccountHistory(account, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, params.offset, params.head]);

  return { accountHistory, isLoading, isError };
};

export default Provider;
