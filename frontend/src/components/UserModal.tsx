import { useEffect, useRef, useState } from "react";
import { User, fetchUserById } from "../api";

type Props = { user: User; onClose: () => void };

function safe(v: string | null | undefined) {
    return v ?? "";
}

function queryFocusable(container: HTMLElement) {
    return Array.from(
        container.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
    ).filter((el) => !el.hasAttribute("disabled"));
}

export default function UserModal({ user, onClose }: Props) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const [detail, setDetail] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const node = modalRef.current;
        if (!node) return;

        // remember previously focused element to restore focus on close
        const previousFocus = document.activeElement as HTMLElement | null;

        // focus the close button initially
        closeRef.current?.focus();

        // mark main content as hidden to assist screen readers
        const main = document.querySelector("main");
        const prevAria = main?.getAttribute("aria-hidden");
        if (main) main.setAttribute("aria-hidden", "true");

        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }

            if (e.key === "Tab") {
                const focusables = queryFocusable(node);
                if (focusables.length === 0) {
                    e.preventDefault();
                    return;
                }

                const current = document.activeElement as HTMLElement;
                const idx = focusables.indexOf(current);
                if (e.shiftKey) {
                    // move backwards
                    const prev = idx > 0 ? focusables[idx - 1] : focusables[focusables.length - 1];
                    e.preventDefault();
                    prev.focus();
                } else {
                    // move forwards
                    const next = idx >= 0 && idx < focusables.length - 1 ? focusables[idx + 1] : focusables[0];
                    e.preventDefault();
                    next.focus();
                }
            }
        }

        document.addEventListener("keydown", onKey);
        // prevent background from scrolling while modal is open
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            if (main) {
                if (prevAria === null) main.removeAttribute("aria-hidden");
                else main.setAttribute("aria-hidden", prevAria);
            }

            // restore focus to the element that had focus before the modal opened
            if (previousFocus && typeof previousFocus.focus === "function") {
                previousFocus.focus();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchUserById(user.id).then((u) => {
            if (!mounted) return;
            setDetail(u);
            setLoading(false);
        });
        return () => {
            mounted = false;
        };
    }, [user.id]);

    return (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal" ref={modalRef} aria-labelledby="user-modal-title">
                <button
                    className="modal-close"
                    aria-label="Close"
                    onClick={onClose}
                    ref={closeRef}
                >
                    ×
                </button>
                <h2 id="user-modal-title" className="modal-title">{safe(detail?.name ?? user.name)}</h2>
                <p className="modal-summary">
                    {loading
                        ? "Loading…"
                        : `${safe(detail?.name ?? user.name)} - ${safe(detail?.role ?? user.role)} (${safe(
                            detail?.team ?? user.team
                        )})`}
                </p>
                <div className="modal-actions">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
