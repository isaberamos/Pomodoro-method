import { createContext, useContext, useState } from 'react'

const CyclesContext = createContext({} as any)

function NewCycleForm() {
  const { activeCycle, setActiveCycle } = useContext(CyclesContext)

  return (
    <h1>
      NewCycleForm: {activeCycle}
      <button
        onClick={() => {
          setActiveCycle(2)
        }}
      >
        Alterar ciclo ativo
      </button>
    </h1>
  )
}

function CountDown() {
  const { activeCycle } = useContext(CyclesContext)

  return <h1>CountDown: {activeCycle}</h1>
}

export function Home() {
  const [activeCycle, setActiveCycle] = useState(654988590)

  return (
    <CyclesContext.Provider value={{ activeCycle, setActiveCycle }}>
      <div>
        <NewCycleForm />
        <CountDown />
      </div>
    </CyclesContext.Provider>
  )
}
