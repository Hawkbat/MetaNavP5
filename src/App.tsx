import React, { useMemo, useState } from 'react'
import './App.css'
import { ARCANA } from './data'

function classes(...args: (string | string[] | Record<string, any>)[]) {
  let classNames: string[] = []
  for (const arg of args) {
    if (Array.isArray(arg)) {
      classNames.push(...arg)
    } else if (typeof arg === 'string') {
      classNames.push(arg)
    } else {
      for (const k in arg) {
        if (arg[k]) classNames.push(k)
      }
    }
  }
  return classNames.join(' ')
}

function ImageLink({ href, src, text }: { href: string, src: string, text: string }) {
  return <a className={classes('ImageLink')} href={href} data-label={text}>
    <img src={src} alt={text} />
  </a>
}

function App() {
  let [page, setPage] = useState(window.location.search ? window.location.search.substring(1) : '')

  const selectedArcana = useMemo(() => ARCANA.find(a => a.arcana === page.replace('+', ' ')), [page])

  /*let [csv, setCsv] = useState('')
  const json = useMemo(() => {
    if (!csv) return ''
    const rows = csv.split('\n').map(r => r.split('\t'))
    const headers = rows[0].map(s => s.substring(0, 1).toLowerCase() + s.substring(1).replaceAll(' ', ''))
    const data = rows.slice(1)
    const results = data.map(r => r.reduce((p, c, i) => ({ ...p, [headers[i]]: c }), {}))
    return JSON.stringify(results)
  }, [csv])*/
  return (
    <>
      {selectedArcana ? <>
        <div className={classes('Header')}>
          <ImageLink href='?' src='images/General.png' text='Back' />
          <ImageLink key={selectedArcana.arcana} href={`?${selectedArcana.arcana.replace(' ', '+')}`} text={selectedArcana.name} src={`images/${selectedArcana.arcana}.png`} />
        </div>
        {selectedArcana.abilities ? <>
          <div className={classes('Rank')}>Abilities</div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Ability</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {selectedArcana.abilities.map((a, i) => <tr key={i}>
                <th>{a.rank}</th>
                <td>{a.ability}</td>
                <td>{a.description}</td>
              </tr>)}
            </tbody>
          </table>
        </> : null}
        {selectedArcana.conversations ? selectedArcana.conversations.map((g, i) => <div key={i}>
          <div className={classes('Rank')}>Rank {g.rank ? g.rank : i === 9 ? 'MAX' : i + 1}</div>
          {g.note ? <div className={classes('RankNote')}>{g.note}</div> : null}
          {g.responses?.length ? <table>
            <tbody>
              {g.responses.map(r => <tr key={r.prompt}>
                <th>{r.prompt}</th>
                {r.choices.map(c => <td key={c.text} className={classes('Choice', { invalid: c.invalid })}>{c.text} {c.value ? <span className={classes('ChoiceValue', { boosted: c.boosted })}>+{c.value}</span> : null} {c.note ? <span className={classes('ChoiceNote')}>{c.note}</span> : null}</td>)}
              </tr>)}
            </tbody>
          </table> : null}
        </div>) : null}
      </> : <>
        {ARCANA.filter(a => !!a.abilities).map(a => <ImageLink key={a.arcana} href={`?${a.arcana.replace(' ', '+')}`} text={a.name} src={`images/${a.arcana}.png`} />)}
      </>}
      {/*<textarea value={csv} rows={10} onChange={e => setCsv(e.target.value)}></textarea>
      <textarea value={json} rows={10} readOnly></textarea>*/}
    </>
  )
}

export default App
