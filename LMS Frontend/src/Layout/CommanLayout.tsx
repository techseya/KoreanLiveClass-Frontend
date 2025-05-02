// CommanLayout.tsx
import "../Common/styles/style.css";

interface CommanLayoutProps {
    name: string;
    path: string;
    children?: React.ReactNode;
}

export default function CommanLayout({ name, path, children }: CommanLayoutProps) {
    return (
        <div className="comman-layout">
            <header>
                <p className="path">Home / {path}</p>
                <div className="comman-title">{name}</div>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
}
