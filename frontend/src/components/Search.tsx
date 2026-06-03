import { useEffect, useRef, useState } from "react";
import { fetchUsers, User } from "../api";
import UserModal from "./UserModal";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  async function doSearch(term: string) {
    setLoading(true);
    const users = await fetchUsers(term);
    setResults(users);
    setLoading(false);
  }

  // load initial list on mount
  useEffect(() => {
    doSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce typing to avoid rapid requests
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      doSearch(q);
    }, 300);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const initials = (name: string | null | undefined) => {
    if (!name) return "";
    return name.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
  };

  return (
    <div className="search">
      <div className="search-label">Search users</div>
      <div className="controls">
        <input
          id="user-search"
          aria-label="Search users"
          placeholder="Search name, role or team"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') doSearch(q); }}
        />
        <button className="primary" onClick={() => doSearch(q)}>Search</button>
        <button className="ghost" onClick={() => { setQ(""); doSearch(""); }}>Clear</button>
      </div>

      <div className="results">
        {loading && (
          <div className="skeleton-list">
            {[1,2,3].map(n => (
              <div key={n} className="card skeleton">
                <div className="avatar-skel"></div>
                <div className="skel-lines">
                  <div className="line short"></div>
                  <div className="line"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && <div className="muted">No results</div>}

        <ul>
          {results.map((u) => (
            <li key={u.id} className="card" onClick={() => setSelected(u)} tabIndex={0}>
              <div className="card-left">
                <div className="avatar" aria-hidden>{initials(u.name)}</div>
              </div>
              <div className="card-body">
                <div className="title">{u.name ?? ""}</div>
                <div className="meta">{u.role ?? ""} — {u.team ?? ""}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selected && (
        <UserModal user={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
