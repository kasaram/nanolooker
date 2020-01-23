import React from "react";
import { Dropdown, Icon, Input, Menu } from "antd";
import { rpc } from "api/rpc";
import { isValidPublicAddress } from "components/utils";
import DeleteHistory from "./DeleteHistory";

import useSearch, { SearchType } from "./hooks/use-search";

const { Search: SearchAnt } = Input;

const Search = () => {
  const [searchHistory, setSearchHistory] = React.useState([
    "1fnx59bqpx11s1yn7i5hba3ot5no4ypy971zbkp5wtium3yyafpwhhwkq8fc",
    "15o9qondgphdtygg17trpsrp5q8a1fcui573s33xsgysidwqxzgxkoj34sf4",
    "214421D1FC77C3D0BA6BB2B9AD6773415F31877592C39E0A614838ACD44A2903",
    "1wywzjphxagfb417ukdkteaqpsyad357n4zifti9eie8f1n14cwtm8s7ghuo"
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const { searchValue, setSearchValue, setSearchType } = useSearch();

  const searchPublicAddress = async (value: string) => {
    setIsLoading(true);
    const json =
      (await rpc("account_history", {
        account: value,
        count: "10"
      })) || {};

    setIsLoading(false);

    console.log("~~~~json", json);
  };

  const onHandleChange = (e: any) => {
    const { value } = e.target;

    setSearchValue(value);
    onHandleSearch(value);
  };

  const onHandleSearch = (value: string) => {
    const isValidAddressSearch = isValidPublicAddress(value);

    if (isValidAddressSearch) {
      setSearchValue(value);
      setSearchType(SearchType.ACCOUNT);
      searchPublicAddress(value);
    }

    setIsError(!!value && !isValidAddressSearch);
  };

  return (
    <SearchAnt
      allowClear
      style={{
        maxWidth: "calc(100vw - 40px)",
        width: isExpanded ? "650px" : "100%",
        marginLeft: "auto",
        display: "inline-block",
        position: "absolute",
        right: "-8px",
        top: "12px"
      }}
      value={searchValue}
      suffix={
        <Dropdown
          overlay={
            <Menu>
              {!searchHistory.length ? (
                <Menu.Item disabled>No search history</Menu.Item>
              ) : (
                searchHistory.map(history => (
                  <Menu.Item
                    onClick={() => setSearchValue(history)}
                    key={history}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Icon
                        type={
                          isValidPublicAddress(history) ? "wallet" : "block"
                        }
                      />
                      <div style={{ margin: "0 6px" }}>{history}</div>
                      <DeleteHistory
                        onClick={(e: Event) => {
                          e.stopPropagation();
                          setSearchHistory(
                            searchHistory.filter(h => h !== history)
                          );
                        }}
                      />
                    </div>
                  </Menu.Item>
                ))
              )}
            </Menu>
          }
          placement="bottomRight"
        >
          <Icon type="history" style={{ padding: "6px", marginRight: "6px" }} />
        </Dropdown>
      }
      className={isError ? "has-error" : ""}
      size="large"
      loading={isLoading}
      placeholder="Search by Address / Txhash / Block"
      onFocus={() => setIsExpanded(true)}
      onBlur={() => setIsExpanded(false)}
      onChange={onHandleChange}
      onSearch={onHandleSearch}
    />
  );
};

export default Search;
