import React, { Fragment, useEffect, useMemo, useState } from 'react'
import './App.css'
import { ARCANA, CLASSROOM_ANSWERS } from './data'

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
  const page = window.location.search ? window.location.search.substring(1) : ''
  const selectedArcana = useMemo(() => ARCANA.find(a => a.arcana === page.replace('+', ' ')), [page])
  const [includePrompts, setIncludePrompts] = useState(false)

  useEffect(() => {
    const handle = setInterval(() => {
      setIncludePrompts(window.innerWidth > 500)
    }, 100)
    return () => {
      clearInterval(handle)
    }
  }, [])

  return (
    <>
      {page === 'Answers' ? <>
        <div className={classes('Header')}>
          <ImageLink href='?' src='images/General.png' text='Back' />
          <ImageLink href="?Answers" text="Classroom Answers" src="images/Other.png" />
        </div>
        <table>
          <tbody>
            {includePrompts ? CLASSROOM_ANSWERS.map((d, i) => <Fragment key={i}>
              <tr>
                <th rowSpan={d.questions.length * 2}>{d.date}</th>
                {d.questions.length ? <th>{d.questions[0].prompt}</th> : null}
              </tr>
              {d.questions.length ? <tr>
                <td>{d.questions[0].answer}</td>
              </tr> : null}
              {d.questions.slice(1).map((q, j) => <Fragment key={j}>
                <tr><th>{q.prompt}</th></tr>
                <tr><td>{q.answer}</td></tr>
              </Fragment>)}
            </Fragment>) : CLASSROOM_ANSWERS.map((d, i) => <Fragment key={i}>
              <tr>
                <th rowSpan={d.questions.length}>{d.date}</th>
                {d.questions.length ? <td>{d.questions[0].answer}</td> : null}
              </tr>
              {d.questions.slice(1).map((q, j) => <Fragment key={j}>
                <tr><td>{q.answer}</td></tr>
              </Fragment>)}
            </Fragment>)}
          </tbody>
        </table>
      </> : selectedArcana ? <>
        <div className={classes('Header')}>
          <ImageLink href='?' src='images/General.png' text='Back' />
          <ImageLink key={selectedArcana.arcana} href={`?${selectedArcana.arcana.replace(' ', '+')}`} text={selectedArcana.name} src={`images/${selectedArcana.arcana}.png`} />
        </div>
        {selectedArcana.abilities ? <>
          <div className={classes('Rank')} data-label="Abilities">Abilities</div>
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
        {selectedArcana.fusions ? <>
          <div className={classes('Rank')} data-label="Fusions">Fusions</div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Persona</th>
                <th>Skill</th>
              </tr>
            </thead>
            <tbody>
              {selectedArcana.fusions.map((f, i) => <tr key={i}>
                <th>{f.rank}</th>
                <td>{f.persona}</td>
                <td>{f.skill}</td>
              </tr>)}
            </tbody>
          </table>
        </> : null}
        {selectedArcana.outings ? <>
          <div className={classes('Rank')} data-label="Outings">Outings</div>
          <table>
            <thead>
              <tr>
                <th>Availability</th>
                <th>Location</th>
                <th>Reward</th>
              </tr>
            </thead>
            <tbody>
              {selectedArcana.outings.map((o, i) => <tr key={i}>
                <td>{o.from} to {o.to}</td>
                <td>{o.location}</td>
                <td>{o.reward}</td>
              </tr>)}
            </tbody>
          </table>
        </> : null}
        {selectedArcana.conversations ? selectedArcana.conversations.map((g, i) => <div key={i}>
          <div className={classes('Rank')} data-label={'Rank ' + g.rank}>Rank {g.rank}</div>
          {g.note ? <div className={classes('RankNote')}>{g.note}</div> : null}
          {g.responses?.length ? <table>
            <tbody>
              {g.responses.map(r => <tr key={r.prompt}>
                {includePrompts ? <th>{r.prompt}</th> : null}
                {r.choices.map(c => <td key={c.text} className={classes('Choice', { invalid: c.invalid })}>{c.text} {c.value ? <span className={classes('ChoiceValue', { boosted: c.boosted })}>+{c.value}</span> : null} {c.note ? <span className={classes('ChoiceNote')}>{c.note}</span> : null}</td>)}
              </tr>)}
            </tbody>
          </table> : null}
        </div>) : null}
      </> : <>
        {ARCANA.filter(a => !!a.abilities).sort((a, b) => a.name.localeCompare(b.name)).map(a => <ImageLink key={a.arcana} href={`?${a.arcana.replace(' ', '+')}`} text={a.name} src={`images/${a.arcana}.png`} />)}
        <ImageLink href='?Answers' text='Classroom Answers' src='images/Other.png' />
      </>}
    </>
  )
}

export default App
