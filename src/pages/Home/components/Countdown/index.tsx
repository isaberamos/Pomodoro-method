import { useContext, useEffect } from 'react'
import { CountDownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../../../../contexts/CyclesContext'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  // Convertendo de minutos para segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // Quanto já passou de segundos desde a existência do ciclo ativo
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  // Transformando em minutos
  const minutesAmount = Math.floor(currentSeconds / 60)

  // Segundos restantes
  const secondsAmount = currentSeconds % 60

  // Usa o método padStart, que  serve para preecher uma string até um tamanho específico, caso ela não tenha esse tamanho ainda.
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // Atualiza o cronômetro na data atual no título da página
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  // Reduzir o countdown
  useEffect(() => {
    let interval: number
    // Cria o intervalo
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          // Só atualiza se o total de segundos ainda não terminou
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  )
}
