import React from "react";
import { Typography } from "antd";
import BigNumber from "bignumber.js";
import usePending, { PendingBlock } from "api/hooks/use-pending";
import { AccountInfoContext } from "api/contexts/AccountInfo";
import TransactionsTable from "pages/Account/Transactions";
import { raiToRaw } from "components/utils";
import { Subtype } from "types/Transaction";

const MAX_PENDING_TRANSACTIONS = 15;
const TRANSACTIONS_PER_PAGE = 5;
const { Title } = Typography;

interface PendingHistoryBlock extends PendingBlock {
  hash: string;
  account: string;
  subtype: Subtype;
}

const PENDING_MIN_THRESHHOLD = new BigNumber(raiToRaw(0.000001)).toFixed();

const AccountPendingHistory = () => {
  const { account, accountInfo } = React.useContext(AccountInfoContext);
  const {
    pending: { blocks = {} } = {},
    isLoading: isAccountHistoryLoading,
  } = usePending(account, {
    count: String(MAX_PENDING_TRANSACTIONS),
    sorting: true,
    source: true,
    threshold: PENDING_MIN_THRESHHOLD,
  });
  const totalPending = Object.keys(blocks).length;
  const isPaginated = true;
  const showPaginate = totalPending > TRANSACTIONS_PER_PAGE;
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  let pendingHistory: PendingHistoryBlock[] | undefined = undefined;
  if (totalPending) {
    pendingHistory = Object.entries(blocks).map(
      // @ts-ignore
      ([block, { amount, source }]): PendingHistoryBlock => ({
        hash: block,
        amount,
        account: source,
        subtype: "pending",
      }),
    );
  }

  const start = 0 + (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const data = pendingHistory?.slice(start, start + TRANSACTIONS_PER_PAGE);

  return Number(accountInfo?.pending) > Number(PENDING_MIN_THRESHHOLD) ? (
    <>
      <Title level={3} style={{ marginTop: "0.5em" }}>
        {isAccountHistoryLoading ? "" : pendingHistory?.length} Pending
        Transactions
      </Title>

      <TransactionsTable
        data={data}
        isLoading={isAccountHistoryLoading}
        isPaginated={isPaginated}
        showPaginate={showPaginate}
        pageSize={TRANSACTIONS_PER_PAGE}
        currentPage={currentPage}
        totalPages={pendingHistory?.length || 0}
        setCurrentPage={setCurrentPage}
      />
    </>
  ) : null;
};

export default AccountPendingHistory;
