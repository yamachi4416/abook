export function useFlashAttr() {
  const attrs = useState<Map<string, any>>(() => new Map())

  function setAttr(key: string, value: any) {
    attrs.value.set(key, value)
  }

  function getAttr<T>(key: string) {
    const value = <T>attrs.value.get(key)
    attrs.value.delete(key)
    return value
  }

  return {
    setAttr,
    getAttr,
  }
}
