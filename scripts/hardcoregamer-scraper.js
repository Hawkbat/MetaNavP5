
JSON.stringify([...document.body.querySelectorAll('.entry-content h2 ~ table')].map(t => {
    let rankEl = t.previousElementSibling
    while (rankEl && rankEl.tagName !== 'H2') rankEl = rankEl.previousElementSibling
    const rank = rankEl.textContent.substring(5).trim()
    const responses = [...t.querySelectorAll('tr')].map(r => {
        const tds = [...r.querySelectorAll('td')]
        const prompt = tds[0].textContent.trim()
        const choices = tds.slice(1).flatMap(d => {
            let text = d.textContent.trim()
            const boosted = [...d.children].some(s => s.tagName === 'SPAN' && s.style.color === 'rgb(255, 0, 0)') ? true : undefined
            const invalid = [...d.children].some(s => s.tagName === 'DEL') ? true : undefined
            const noteEl = [...d.children].find(s => s.tagName === 'STRONG')
            const note = noteEl ? noteEl.textContent.trim() : undefined
            let value = undefined
            if (text.includes('+')) {
                value = parseInt(text.substring(text.indexOf('+') + 1).trim(), 10)
                text = text.substring(0, text.indexOf('+')).trim()
            }
            return text ? [{ text, value, note, boosted, invalid }] : []
        })
        return { prompt, choices }
    })
    return { rank, responses }
}))
