import { Toaster } from "sonner";
import { useState, createContext } from "react";

import "./App.css";
import Main from "./components/Main";
import Headers from "./components/Header";
import Menu from "./components/FloatingMenu";
import { SecretEntry } from "./libs/FS";

export const Context = createContext<{
  otp: SecretEntry[];
  setOtp: React.Dispatch<React.SetStateAction<SecretEntry[]>>;
}>(null!);

function App() {
  const [otp, setOtp] = useState<SecretEntry[]>([]);
  return (
    <Context.Provider value={{ otp, setOtp }}>
      <Headers />
      <Toaster />
      <Menu />
      <Main />
    </Context.Provider>
  );
}

export default App;
