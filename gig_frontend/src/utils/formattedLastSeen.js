export const formatLastSeen = (date) => {
    // console.log("last seen date",date)

    if (!date) return "last seen recently";

    const lastSeen = new Date(date);
    const now = new Date();

    if (isNaN(lastSeen.getTime())) {
        return "last seen recently";
    }

    const diffMs = now - lastSeen;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Future date protection
    if (diffMs < 0) {
        return "last seen recently";
    }

    // Less than 1 minute
    if (diffSeconds < 60) {
        return "last seen just now";
    }

    // Less than 1 hour
    if (diffMinutes < 60) {
        return `last seen ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    }

    // Less than 24 hours
    if (diffHours < 24) {
        return `last seen ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    }

    // Yesterday
    if (diffDays === 1) {
        return `last seen yesterday at ${lastSeen.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        })}`;
    }

    // Within the last 7 days
    if (diffDays < 7) {
        return `last seen ${lastSeen.toLocaleDateString([], {
            weekday: "long",
        })} at ${lastSeen.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        })}`;
    }

    // Older dates
    return `last seen : ${lastSeen.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: lastSeen.getFullYear() !== now.getFullYear()
            ? "numeric"
            : undefined,
    })} at ${lastSeen.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    })}`;
};