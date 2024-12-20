import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className={theme}>
        <div className="bg-white text-grey-700 dark:text-grey-200 dark:bg-black min-h-screen">
            { children }
        </div>
    </div>
  )
}
