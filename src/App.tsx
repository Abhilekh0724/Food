import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import AppRoutes from "./routes";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}
