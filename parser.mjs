var plain = function (s) { return s.replace(/<[^>]*>/g, ' ').replace(/&#(\d+);/g, function (_, n) { return String.fromCodePoint(Number(n)); }).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim(); };
export function parseTrending(html) {
    var articles = html.match(/<article\b[^>]*class="[^"]*Box-row[^"]*"[^>]*>[\s\S]*?<\/article>/g) || [];
    var repos = articles.slice(0, 10).map(function (a, i) {
        var _a, _b, _c, _d, _e;
        var heading = ((_a = a.match(/<h2\b[\s\S]*?<\/h2>/)) === null || _a === void 0 ? void 0 : _a[0]) || '';
        var path = (_b = heading.match(/href="\/([\w.-]+\/[\w.-]+)"/)) === null || _b === void 0 ? void 0 : _b[1];
        var starText = (_c = a.match(/<a\b[^>]*href="[^"]*\/stargazers"[^>]*>([\s\S]*?)<\/a>/)) === null || _c === void 0 ? void 0 : _c[1];
        var stars = Number(plain(starText || '').replaceAll(',', ''));
        var weekly = a.match(/([\d,]+)\s+stars this week/);
        if (!path || !starText || !Number.isSafeInteger(stars) || stars < 0 || !weekly)
            throw Error('GitHub 週榜格式已改變，未儲存資料。');
        return { rank: i + 1, name: path, url: "https://github.com/".concat(path), description: plain(((_d = a.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)) === null || _d === void 0 ? void 0 : _d[1]) || ''), language: plain(((_e = a.match(/itemprop="programmingLanguage"[^>]*>([\s\S]*?)<\/span>/)) === null || _e === void 0 ? void 0 : _e[1]) || ''), stars: stars, weeklyStars: Number(weekly[1].replaceAll(',', '')) };
    });
    if (repos.length !== 10 || new Set(repos.map(function (x) { return x.name.toLowerCase(); })).size !== 10)
        throw Error('GitHub 未提供完整前十名，未儲存資料。');
    return repos;
}
export function taipeiDate(now) {
    if (now === void 0) { now = new Date(); }
    return new Date(now.getTime() + 8 * 3600000).toISOString().slice(0, 10);
}
export function monday(date) { var d = new Date(date + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7); return d.toISOString().slice(0, 10); }
