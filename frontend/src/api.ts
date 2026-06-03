export type User = { id: number; name: string | null; role: string | null; team: string | null };

const sampleUsers: User[] = [
    { id: 1, name: "Ada Lovelace", role: "Application Developer", team: "Modernization" },
    { id: 2, name: "Grace Hopper", role: "Principal Engineer", team: "Platform" },
    { id: 3, name: "Linus Torvalds", role: "Systems Developer", team: "Infrastructure" },
    { id: 4, name: "Maya Patel", role: "UX Researcher", team: "Experience" },
    { id: 5, name: "Omar Sanchez", role: "Site Reliability Engineer", team: "Reliability" },
    { id: 6, name: "Naomi Chen", role: "Product Manager", team: "Growth" },
    { id: 7, name: "Jordi López", role: "Security Architect", team: "Compliance" },
    { id: 8, name: "Aisha Mohammed", role: "Data Analyst", team: "Insights" },
    { id: 9, name: "Keisha Brown", role: "Technical Program Manager", team: "Operations" },
    { id: 10, name: "Hugo Fischer", role: "QA Lead", team: "Quality" },
    { id: 11, name: "Priya Desai", role: "Cloud Engineer", team: "Infrastructure" },
];

export async function fetchUsers(search: string | null): Promise<User[]> {
    const q = search ?? "";

    try {
        const res = await fetch(`/api/users?search=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error("bad response");
        return (await res.json()) as User[];
    } catch (e) {
        // fallback to local sample so the UI works without a backend during development
        const normalized = (q || "").trim().toLowerCase();
        if (normalized === "") return sampleUsers;

        return sampleUsers.filter((u) =>
            [u.name, u.role, u.team]
                .filter(Boolean)
                .some((v) => v!.toLowerCase().includes(normalized))
        );
    }
}

export async function fetchUserById(id: number): Promise<User | null> {
    try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) return null;
        return (await res.json()) as User;
    } catch (e) {
        // fallback to local sample
        return sampleUsers.find((u) => u.id === id) ?? null;
    }
}
