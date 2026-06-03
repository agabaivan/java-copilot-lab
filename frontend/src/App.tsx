import { useEffect, useState } from "react";
import Search from "./components/Search";

export default function App() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const pref = localStorage.getItem("theme");
        if (pref) setDark(pref === "dark");
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);

    return (
        <div className={`app ${dark ? "theme-dark" : "theme-light"}`}>
            <header className="header">
                <div className="header-inner">
                    <h1>CopilotLab — Users</h1>
                    <div className="header-actions">
                        <button className="theme-toggle" onClick={() => setDark(!dark)} aria-pressed={dark}>
                            {dark ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5 5L3.5 3.5M20.5 20.5L19 19M19 5l1.5-1.5M4.5 19.5L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>
            <main className="container">
                <Search />
            </main>
        </div>
    );
}
