JSON.stringify((() => {
    const dates = [...document.querySelectorAll('.c-entry-content h4')]
    return dates.map(e => {
        const date = e.textContent
        const questions = []
        let q = 0
        let a = 0
        for (let p = e.nextElementSibling; p && p.tagName !== 'H4'; p = p.nextElementSibling) {
            if (p.tagName !== 'P') continue
            const text = p.textContent.trim()
            if (text.startsWith('Q') || text.startsWith('Assist')) {
                const prompt = text.substring(text.indexOf(': ') + 2).trim()
                if (q >= questions.length) questions.push({ prompt, answer: '' })
                else questions[q].prompt = prompt
                q++
            } else if (text.startsWith('A')) {
                const answer = text.substring(text.indexOf(': ') + 2).trim()
                if (a >= questions.length) questions.push({ prompt: '', answer })
                else questions[a].answer = answer
                a++
            } else {
                console.log(text)
            }
        }
        return { date, questions }
    })
})())