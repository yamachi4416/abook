interface Options {
  'journal.timeline.order': number
  'journal.search.order': number
  'journal.piechat.disabledItems': Record<string, boolean>
  'calc.tax1': string
  'calc.tax2': string
}

type OptionKeys = keyof Options

function defaultOptions(): Options {
  return {
    'journal.timeline.order': 0,
    'journal.search.order': 0,
    'journal.piechat.disabledItems': {},
    'calc.tax1': '8',
    'calc.tax2': '10',
  }
}

export function useSettings() {
  const savedOptions = useLocalStorage('appoptions', defaultOptions(), {
    mergeDefaults: true,
  })

  const { cloned, sync } = useCloned(savedOptions, { deep: true })

  function reset() {
    sync()
  }

  function flush() {
    const editor = defaultOptions()
    const edited = cloned.value
    for (const key of Object.keys(editor) as OptionKeys[]) {
      if (typeof editor[key] === typeof edited[key]) {
        editor[key] = edited[key] as never
      }
    }
    savedOptions.value = editor
    sync()
  }

  return {
    settings: cloned,
    reset,
    flush,
  }
}
