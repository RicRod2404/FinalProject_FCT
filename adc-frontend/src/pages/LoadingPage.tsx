import Logo from "../components/NavBar/Logo";

export default function LoadingPage() {
    return (
        <div className="spinner" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh' // This makes the div take the full height of the viewport
        }}>
            <Logo width={400} />
        </div>
    );
}
