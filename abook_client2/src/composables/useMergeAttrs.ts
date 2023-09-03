import { mergeProps } from 'vue-demi'

export function useMergeAttrs() {
  const el = getCurrentInstance()
  const id = el ? `uid-${el.uid}` : undefined

  const attrs = mergeProps(
    {
      id,
    },
    useAttrs(),
  )

  return {
    uid: id,
    attrs,
  }
}
