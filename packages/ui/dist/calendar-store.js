export function createCalendarStore(options = {}) {
    const { size = 'small', rangeDays = 7, staleness_ms = 300000 } = options;
    let events = [];
    let widgetSize = size;
    let lastUpdated = 0;
    let loading = false;
    let error;
    /** Parse date string, treating date-only strings (YYYY-MM-DD) as local time */
    function parseDate(dateStr) {
        // Date-only strings (no 'T') are parsed as UTC by spec, causing timezone issues
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [y, m, d] = dateStr.split('-').map(Number);
            return new Date(y, m - 1, d);
        }
        return new Date(dateStr);
    }
    function startOfDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    function filterAndSort(predicate) {
        return events
            .filter(predicate)
            .sort((a, b) => parseDate(a.start).getTime() - parseDate(b.start).getTime());
    }
    return {
        getEvents() {
            return events;
        },
        setEvents(newEvents) {
            events = newEvents;
            lastUpdated = Date.now();
            error = undefined;
        },
        getTodayEvents() {
            const todayStart = startOfDay(new Date());
            const tomorrowStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate() + 1);
            // Event overlaps today if it starts before tomorrow AND ends after today starts
            return filterAndSort((event) => {
                const eventStart = parseDate(event.start);
                const eventEnd = parseDate(event.end);
                return eventStart < tomorrowStart && eventEnd > todayStart;
            });
        },
        getUpcomingEvents() {
            const now = new Date();
            const maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + rangeDays + 1);
            // Event overlaps range if it starts before maxDate AND ends after now
            return filterAndSort((event) => {
                const eventStart = parseDate(event.start);
                const eventEnd = parseDate(event.end);
                return eventStart < maxDate && eventEnd > now;
            });
        },
        getSize() {
            return widgetSize;
        },
        setSize(newSize) {
            widgetSize = newSize;
        },
        isStale() {
            if (lastUpdated === 0)
                return false;
            return Date.now() - lastUpdated > staleness_ms;
        },
        getLastUpdated() {
            return lastUpdated;
        },
        isLoading() {
            return loading;
        },
        setLoading(isLoading) {
            loading = isLoading;
        },
        getError() {
            return error;
        },
        setError(errorMsg) {
            error = errorMsg;
        },
        clearError() {
            error = undefined;
        },
    };
}
//# sourceMappingURL=calendar-store.js.map