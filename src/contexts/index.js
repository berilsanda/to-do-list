import { ThemeContextProvider } from "./ThemeContext";
import { UserContextProvider } from "./UserContext";

export default function ContextProvider({ children }) {
  return (
    <UserContextProvider>
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </UserContextProvider>
  );
}
