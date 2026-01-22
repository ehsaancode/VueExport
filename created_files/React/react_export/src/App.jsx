import AppRoutes from "./routes";
import { useSystemTheme } from "./theme/useSystemTheme";  // ✅ import here

function App() {
  useSystemTheme();
  return <AppRoutes />;
}

export default App;
