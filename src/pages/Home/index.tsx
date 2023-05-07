import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { HandPalm, Play } from 'phosphor-react'
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  StopCountDownButton,
  TaskInput,
} from './styles'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import { NewCycleForm } from './components/NewCycleForm'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1).max(60),
})

// Ao invés de criar um tipo, poderia criar uma interface
// Sempre que quisermos referir uma variável JS no TS é preciso colocar o typeof
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

// Criando o formato dos ciclos
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  // Salva a data que o timer ficou ativo, com base nessa data saberemos quanto tempo passou
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  // Guarda todos os ciclos
  const [cycles, setCycles] = useState<Cycle[]>([])

  // Guarda o ciclo ativo
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  // Armazenando a quantidade de segundos que já passaram desde a existência do ciclo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  // const [task, setTask] = useState('')

  // form é um objeto que vai conter todas as informações e funções para criar o formulário
  // register adiciona um input no formulário, informando quais são os campos existentes no formulário

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  // Para saber qual é o ciclo ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // console.log('Restam: ', `${currentSeconds}`, 'segundos')
  // console.log('Atualmente já se passaram: ', `${amountSecondsPassed}`, 'segundos')

  // console.log(activeCycle)

  // Para este Hook precisa declarar a variável no [] quando a variável é de fora do escopo do useEffect

  // Convertendo de minutos para segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // Quanto já passou de segundos desde a existência do ciclo ativo
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  // Transformando em minutos
  const minutesAmount = Math.floor(currentSeconds / 60)

  // Segundos restantes
  const secondsAmount = currentSeconds % 60

  // Para mostrar em tela com a quantidade correta minutos e segundos, transforma em string para usar o método padStart, que  serve para preecher uma string até um tamanho específico, caso ela não tenha esse tamanho ainda.
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // Reduzir o countdown
  useEffect(() => {
    let interval: number
    // Cria o intervalo
    if (activeCycle) {
      interval = setInterval(() => {
        // Ao invés de incrementar um segundo (state => state + 1), então compararemos a data atual com a data que foi salva no startDate e ver quantos segundos ja se passaram
        // differenceInSeconds(Diferença em segundos da data atual, data em que o ciclo iniciou) dentro do intervalo de um 1s
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          // Quando um estado depende do valor anterior é necessário colocar uma função
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )

          setAmountSecondsPassed(totalSeconds)

          clearInterval(interval)
        } else {
          // Só atualiza se o total de segundos ainda não terminou
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  function handleCreateNewCicle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    // console.log(cycles)

    // Pega o estado atual da variável de ciclos (state), copia o estado atual e adiciona o novo ciclo. Pois sempre que uma alteração de estado depender do valor anterior usamos o formato d array function.

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    // Reseta a variável de amountSecondsPassed para 0, assim ele reseta os minutos que vão ser iniciados
    setAmountSecondsPassed(0)

    // console.log(data)
    reset()
  }

  // Retorna cada ciclo ativo com uma nova data
  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    // Limpa a listagem de ciclos ativos
    setActiveCycleId(null)
  }

  // Atualiza o cronômetro na data atual no título da página
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  // Monitora quando receber algo do input (linha 189)
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCicle)} action="">
        <NewCycleForm />
        <CountDownContainer />

        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}

// Controlled - atualiza o estado da variável em tempo real a cada nova informação. Geralmente é usado em pequenos formulários.
// Uncontrolled - busca a informação do valor do input somente quando precisar dela. Mais usado em dashboards e formulários com muitos inputs.
// Hooks são funções que acoplam funcionalidades em componentes. Sempre começam com o prefixo use. Ex;: useForm, useState etc.
