import { component$, createContextId, Slot, useContextProvider, useStore, $ } from "@builder.io/qwik";
import { v4 } from 'uuid'
import { Toaster } from "./toaster.css";

export const ToasterColor = {
  WARN: 'orange',
  ERROR: 'red',
  SUCCESS: 'green',
  INFO: 'blue'
}

export type Toaster = {
  id?: string,
  message: string,
  color: string
}

const useToaster = () => {

  const toasterStore = useStore<Toaster[]>([]);

  const addToaster = $((toaster: Toaster) => {
    toaster.id = v4()
    toasterStore.push(toaster);

    setTimeout(() => {
      toasterStore.splice(toasterStore.indexOf(toaster), 1)
    }, 5000)
  })

  return {
    addToaster,
    toasters: toasterStore
  }
}

export const ToasterContext = createContextId<ReturnType<typeof useToaster>>('toaster');

export default component$(() => {
  const toasterHook = useToaster();
  useContextProvider(ToasterContext, toasterHook);

  return <>
    <div class="absolute right-2 bottom-2">
      {toasterHook.toasters.map(toaster => <Toaster key={toaster.id} style={{ backgroundColor: toaster.color }}>{toaster.message}</Toaster>)}
    </div>
    <Slot />
  </>
})