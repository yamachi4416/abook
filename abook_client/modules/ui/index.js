import Confirm from '@/components/ui/Confirm'

export const showConfirm = ({ parent, title, message }) => {
  const m = new Confirm({
    parent,
    propsData: {
      message,
      title
    }
  })

  return new Promise(resolve => {
    let result = false

    m.$on('ok', () => {
      result = true
    })
    m.$on('close', () => resolve(result))

    const div = document.createElement('div')
    document.body.appendChild(div)
    m.$mount(div)
  })
}
