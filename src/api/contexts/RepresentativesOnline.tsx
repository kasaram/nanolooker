import React from "react";
import { rpc } from "api/rpc";

export interface RepresentativesOnlineReturn {
  representatives: string[];
  isLoading: boolean;
  isError: boolean;
}

export const RepresentativesOnlineContext = React.createContext<
  RepresentativesOnlineReturn
>({
  representatives: [],
  isLoading: false,
  isError: false,
});

const Provider: React.FC = ({ children }) => {
  const [representatives, setRepresentatives] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const getRepresentativesOnline = async () => {
    setIsError(false);
    setIsLoading(true);
    const json = await rpc("representatives_online");

    !json || json.error
      ? setIsError(true)
      : setRepresentatives(json.representatives);

    setIsLoading(false);
  };

  React.useEffect(() => {
    getRepresentativesOnline();
  }, []);

  return (
    <RepresentativesOnlineContext.Provider
      value={{ representatives, isLoading, isError }}
    >
      {children}
    </RepresentativesOnlineContext.Provider>
  );
};

export default Provider;
