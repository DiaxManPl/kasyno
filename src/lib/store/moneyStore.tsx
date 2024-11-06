import { createContext, useContext, useEffect, useState } from "react";

export const MoneyStoreContext = createContext({
	money: 0,
	setMoney: (value: number) => {},
} as { money: number; setMoney: React.Dispatch<React.SetStateAction<number>> });

export function MoneyStoreProvider({ children }: { children: React.ReactNode }) {
	const [money, setMoney] = useState(localStorage.getItem("money") ? parseInt(localStorage.getItem("money")!) : 0);

	useEffect(() => {
		localStorage.setItem("money", money.toString());
	}, [money]);

	return <MoneyStoreContext.Provider value={{ money, setMoney }}>{children}</MoneyStoreContext.Provider>;
}

export const useMoneyStore = () => {
	return useContext(MoneyStoreContext);
};
