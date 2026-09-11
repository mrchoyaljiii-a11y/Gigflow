export const formatMessageDate = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);
    const today = new Date();

    // Remove time from both dates
    const messageDay = new Date(
        messageDate.getFullYear(),
        messageDate.getMonth(),
        messageDate.getDate()
    );

    const todayDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const diffTime = todayDay - messageDay;
    
    const diffDays = Math.floor(
        diffTime / (1000 * 60 * 60 * 24)
    );

    // Today
    if (diffDays === 0) {
        return "Today";
    }

    // Yesterday
    if (diffDays === 1) {
        return "Yesterday";
    }

    // Within the last 7 days
    if (diffDays > 1 && diffDays < 7) {
        return messageDate.toLocaleDateString([], {
            weekday: "long",
        });
    }

    // Older messages
    return messageDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};