<template>
  <div v-if="!isEmpty">
    <svg :viewBox="viewBox">
      <foreignObject :x="-cr" :y="-cr" :width="cr * 2" :height="cr * 2">
        <ul :style="{ height: `${cr * 2}px`, width: `${cr * 2}px` }">
          <li>{{ centerItem.percent }}%</li>
          <li>{{ centerItem.name }}</li>
          <li>{{ centerItem.value }}</li>
        </ul>
      </foreignObject>
      <path
        v-for="c in charts"
        :key="c.id"
        :style="{ fill: c.color }"
        :d="beforePathds[c.id] ?? c.pathd"
        @click="$emit('click', c.data)"
      >
        <animate
          ref="anims"
          attributeName="d"
          dur="0.3s"
          :to="c.pathd"
          repeatCount="1"
          fill="freeze"
        />
      </path>
    </svg>
    <table>
      <tbody>
        <tr
          v-for="{ id, color, name, value, percent, data } in dataset"
          :key="id"
          @click="$emit('click', data)"
        >
          <td :style="{ color }">●</td>
          <td>{{ name }}</td>
          <td>{{ value }}</td>
          <td>{{ percent }}%</td>
        </tr>
        <tr>
          <td></td>
          <td>{{ $t('form.total') }}</td>
          <td>{{ total }}</td>
          <td>100%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="
    T extends {
      id: string
      name: string
      value: number
      color?: string
      selected?: boolean
      disabled?: boolean
    }
  "
>
defineEmits<{
  (e: 'click', item: T): void
}>()

const props = withDefaults(
  defineProps<{
    r?: number
    cr?: number
    cx?: number
    cy?: number
    rounding?: number
    dataset: T[]
  }>(),
  {
    r: 100,
    cr: 60,
    cx: 0,
    cy: 0,
    rounding: 1,
    dataset: () => [],
  },
)

const anims = ref<SVGAnimateElement[]>()

const isEmpty = computed(() => props.dataset.length === 0)

const total = computed(() =>
  props.dataset.filter((c) => !c.disabled).reduce((sum, c) => sum + c.value, 0),
)

const dataset = computed(() =>
  props.dataset
    .map((data) => ({
      id: data.id,
      name: data.name,
      value: data.value,
      percent:
        Math.round(
          (data.value / total.value) * Math.pow(10, props.rounding) * 100,
        ) / Math.pow(10, props.rounding),
      color: data.color ?? '#fff',
      line: isWhite(data.color ?? '#fff'),
      selected: !!data.selected,
      disabled: !!data.disabled,
      data,
    }))
    .toSorted((a, b) => b.value - a.value),
)

const beforePathds = ref<Record<string, string>>({})

const viewBox = computed(() => {
  const s = props.r * 2 * 1.2
  const c = -(s / 2)
  return `${c} ${c} ${s} ${s}`
})

const charts = computed(() => {
  let p = 0
  return dataset.value
    .filter((c) => !c.disabled)
    .map((c) => {
      const deg1 = (360 * p) / total.value
      const deg2 = (360 * (p += c.value)) / total.value
      return {
        ...c,
        pathd: pathd({ deg1, deg2 }, c.selected),
      }
    })
})

const selectedItem = computed(() =>
  charts.value.find(({ selected }) => selected),
)

const centerItem = computed(() => {
  const selected = selectedItem.value
  if (selected) {
    return {
      name: selected.name,
      value: selected.value,
      percent: selected.percent,
    }
  } else {
    return {
      name: useI18n().t('form.total'),
      value: total.value,
      percent: 100,
    }
  }
})

watch(charts, (_, oldValue) => {
  oldValue?.forEach((d) => {
    beforePathds.value[d.id] = d.pathd
  })
  anims.value?.map((anim) => anim.beginElement())
})

function isWhite(color: string) {
  return [/(255\s*,\s*){2}(255\s*,\s*)/, /^#FFF(FFF)?$/i].some((x) =>
    x.test(color),
  )
}

function pathd(c: { deg1: number; deg2: number }, selected: boolean) {
  const { r, cr } = props
  const mv = selected ? 5 : 0
  const fx = 10

  return donut({ r, cr, mv, fx }, c)
}

function donut100({ r, cr, mv }: { r: number; cr: number; mv: number }) {
  return [
    `M0,${-cr - mv}`,
    `A${cr},${cr} 0 0 1 0,${cr + mv}`,
    `A${cr},${cr} 0 1 1 0,${-cr - mv}`,
    `M0,${-r - mv}`,
    `A${r},${r} 0 0 0 0,${r + mv}`,
    `A${r},${r} 0 1 0 0,${-r - mv}`,
    'Z',
  ].join(' ')
}

function donut(
  { r, cr, mv, fx }: { r: number; cr: number; mv: number; fx: number },
  { deg1, deg2 }: { deg1: number; deg2: number },
) {
  const round = (i: number) =>
    Math.round(i * Math.pow(10, fx)) / Math.pow(10, fx)

  if (round(deg2 - deg1) === 360) {
    return donut100({ r, cr, mv })
  }

  const deg0 = deg2 - deg1
  const rad0 = ((deg1 + deg0 * 0.5 - 90) * Math.PI) / 180
  const rad1 = ((deg1 - 90) * Math.PI) / 180
  const rad2 = ((deg2 - 90) * Math.PI) / 180

  const r0 = cr + (deg0 / 180) * mv
  const r1 = r + (deg0 / 180) * mv

  const ox = round(Math.cos(rad0) * mv)
  const oy = round(Math.sin(rad0) * mv)

  const x0 = round(Math.cos(rad1) * r0 + ox)
  const y0 = round(Math.sin(rad1) * r0 + oy)

  const x1 = round(Math.cos(rad1) * r1 + ox)
  const y1 = round(Math.sin(rad1) * r1 + oy)

  const x2 = round(Math.cos(rad2) * r1 + ox)
  const y2 = round(Math.sin(rad2) * r1 + oy)

  const x3 = round(Math.cos(rad2) * r0 + ox)
  const y3 = round(Math.sin(rad2) * r0 + oy)

  const f = deg0 > 180 ? 1 : 0

  return [
    `M${x0},${y0}`,
    `L${x1},${y1}`,
    `A${r1},${r1} 0 ${f} 1 ${x2},${y2}`,
    `L${x3},${y3}`,
    `A${r0},${r0} 0 ${f} 0 ${x0},${y0}`,
    'Z',
  ].join(' ')
}
</script>
