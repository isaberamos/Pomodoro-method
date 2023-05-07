import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

export function NewCycleForm() {
  return (
    <FormContainer>
      <label htmlFor="label">Vou trabalhar em</label>
      <TaskInput
        id="task"
        list="task-suggestions"
        placeholder="nome do seu projeto"
        /* onChange={(e) => setTask(e.target.value)}
            // Atualiza o estado até mesmo quando não foi o usuário que atualizou
            value={task}
            /* register é uma função que retorna muitos métodos de input do JS, como onBlur(), onChange() */
        {...register('task')}
        disabled={!!activeCycle}
      />

      <datalist id="task-suggestions">
        <option value="Projeto 1"></option>
        <option value="Projeto 2"></option>
        <option value="Projeto 3"></option>
        <option value="Projeto 4"></option>
      </datalist>

      <label htmlFor="">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={1}
        max={60}
        {...register('minutesAmount', { valueAsNumber: true })}
        disabled={!!activeCycle}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
