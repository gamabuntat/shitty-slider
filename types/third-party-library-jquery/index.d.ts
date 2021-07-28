interface JQuery {
  slider(): JQuery<HTMLElement>
}

interface Storage {
  [id: string]: Presenter
}

interface Options {
  interval?: boolean
  vertical?: boolean
  displayVisibility?: boolean
  scaleVisibility?: boolean
  min?: number
  max?: number
  step?: number
}

type buttonT = 'buttonS' | 'buttonE'
type visibilityT = 'scale' | 'display'
type argsT = (
  ['move', buttonT, number] 
  | ['get'] 
  | ['toggleVisibility', visibilityT]
)

