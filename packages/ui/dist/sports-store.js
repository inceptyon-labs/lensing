// ── Helpers ───────────────────────────────────────────────────────────────────
function copyGame(g) {
    return { ...g };
}
function copyData(d) {
    return {
        games: d.games.map(copyGame),
        lastUpdated: d.lastUpdated,
    };
}
// ── Factory ───────────────────────────────────────────────────────────────────
export function createSportsStore(options = {}) {
    const { maxStale_ms = 120_000 } = options;
    let data = null;
    let isLoading = false;
    let error = null;
    const callbacks = [];
    let notifying = false;
    function notifyChange() {
        if (notifying)
            return;
        notifying = true;
        try {
            for (const cb of [...callbacks]) {
                try {
                    cb();
                }
                catch {
                    // isolate callback errors
                }
            }
        }
        finally {
            notifying = false;
        }
    }
    return {
        getState() {
            return {
                data: data ? copyData(data) : null,
                isLoading,
                error,
            };
        },
        setData(newData) {
            data = copyData(newData);
            error = null;
            isLoading = false;
            notifyChange();
        },
        setLoading(loading) {
            isLoading = loading;
            notifyChange();
        },
        setError(errorMessage) {
            error = errorMessage;
            data = null;
            isLoading = false;
            notifyChange();
        },
        isStale() {
            if (!data)
                return false;
            if (!Number.isFinite(data.lastUpdated))
                return true;
            return Date.now() - data.lastUpdated > maxStale_ms;
        },
        onChange(callback) {
            callbacks.push(callback);
            return () => {
                const idx = callbacks.indexOf(callback);
                if (idx !== -1)
                    callbacks.splice(idx, 1);
            };
        },
        getByLeague(league) {
            if (!data)
                return [];
            return data.games.filter((g) => g.league === league).map(copyGame);
        },
        getByTeam(team) {
            if (!data)
                return [];
            const needle = team.toLowerCase();
            return data.games
                .filter((g) => g.homeTeam.toLowerCase().includes(needle) || g.awayTeam.toLowerCase().includes(needle))
                .map(copyGame);
        },
        getLiveGames() {
            if (!data)
                return [];
            return data.games.filter((g) => g.status === 'in_progress').map(copyGame);
        },
        getUpcoming() {
            if (!data)
                return [];
            return data.games.filter((g) => g.status === 'scheduled').map(copyGame);
        },
        getLeagues() {
            if (!data)
                return [];
            return [...new Set(data.games.map((g) => g.league))];
        },
    };
}
//# sourceMappingURL=sports-store.js.map