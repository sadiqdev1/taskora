export default function VerifiedBadge({ size = 14 }) {
    return (
        <i
            className="ri-verified-badge-fill text-blue-500"
            style={{ fontSize: size, lineHeight: 1 }}
            title="Verified"
        />
    );
}
