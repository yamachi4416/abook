<template>
  <div
    v-if="dataset && dataset.length"
    class="wrapper row"
    :class="{ selected: isSelected }"
  >
    <div
      class="content row"
      @click="select()"
    >
      <div class="col-6 col-md-12 col-sm-12 piechart">
        <svg :viewBox="viewBox">
          <foreignObject :x="0 - cr" :y="0 - cr" :width="cr * 2" :height="cr * 2">
            <div
              :style="{ height: `${cr * 2}px`, width: `${cr * 2}px` }"
              class="center-item"
              @click.stop="clickItem"
            >
              <span>
                <div>{{ centerItem.percent || percents[centerItem.id] || 0 }}%</div>
                <div class="center-item-name">{{ centerItem.name }}</div>
                <div>{{ centerItem.amount | comma }}</div>
              </span>
            </div>
          </foreignObject>
          <path
            v-for="c in charts"
            :key="`pie-${c.id}`"
            class="pie"
            :class="{ line: isWhite(c.color), selected: c.selected }"
            :style="{ fill: c.color }"
            :d="history[c.id] || c.pathd"
            @click.stop="select(c)"
          >
            <animate
              ref="anim"
              attributeName="d"
              dur="0.3s"
              :to="c.pathd"
              repeatCount="1"
              fill="freeze"
            />
          </path>
        </svg>
      </div>

      <div class="col-6 col-md-12 col-sm-12 detail">
        <div class="table">
          <div
            v-for="c in datalist"
            :key="`detail-${c.id}`"
            class="row"
            :class="{ line: isWhite(c.color), selected: c.selected, disabled: c.disabled }"
            @click.stop="select(c)"
          >
            <div class="col-1">
              <span
                class="color"
                :style="{ background: c.color }"
              />
            </div>
            <div class="col-6">
              {{ c.name }}
            </div>
            <div class="col-3 number">
              {{ c.val | comma }}
            </div>
            <div class="col-3 number">
              {{ percents[c.id] || 0 }}%
            </div>
          </div>
          <div class="row">
            <div class="col-1" />
            <div class="col-1">
              {{ $t("form.total") }}
            </div>
            <div class="col-3 number">
              {{ total | comma }}
            </div>
            <div class="col-3 number">
              100%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const mapPieData = x => ({
  id: x.id,
  name: x.name,
  val: x.val,
  color: x.color,
  deg1: 0,
  deg2: 0,
  selected: !!x.selected,
  disabled: !!x.disabled,
  data: x
})

const donut100 = ({ r, cr, mv }) => {
  return [
        `M0,${-cr - mv}`,
        `A${cr},${cr} 0 0 1 0,${cr + mv}`,
        `A${cr},${cr} 0 1 1 0,${-cr - mv}`,
        `M0,${-r - mv}`,
        `A${r},${r} 0 0 0 0,${r + mv}`,
        `A${r},${r} 0 1 0 0,${-r - mv}`,
        'Z'
  ].join(' ')
}

const donut = ({ r, cr, mv, fx }, { deg1, deg2 }) => {
  const round = i => Math.round(i * Math.pow(10, fx)) / Math.pow(10, fx)

  if (round(deg2 - deg1) === 360) {
    return donut100({ r, cr, mv })
  }

  const deg0 = deg2 - deg1
  const rad0 = ((deg1 + deg0 * 0.5 - 90) * Math.PI) / 180
  const rad1 = ((deg1 - 90) * Math.PI) / 180
  const rad2 = ((deg2 - 90) * Math.PI) / 180

  const r0 = cr + deg0 / 180 * mv
  const r1 = r + deg0 / 180 * mv

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
        'Z'
  ].join(' ')
}

export default {
  props: {
    r: {
      type: Number,
      required: false,
      default: 100
    },
    cr: {
      type: Number,
      required: false,
      default: 60
    },
    cx: {
      type: Number,
      required: false,
      default: 0
    },
    cy: {
      type: Number,
      required: false,
      default: 0
    },
    dataset: {
      type: Array,
      required: true
    },
    filter: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      history: {},
      datalist: (this.dataset || [])
        .map(mapPieData).sort((a, b) => b.val - a.val)
    }
  },

  computed: {
    viewBox () {
      const s = this.r * 2 * 1.2
      const c = -(s / 2)
      return `${c} ${c} ${s} ${s}`
    },

    total () {
      return this.datalist
        .filter(c => !c.disabled)
        .reduce((sum, c) => sum + c.val, 0)
    },

    selectedItem () {
      return this.datalist.find(x => x.selected)
    },

    isSelected () {
      return this.datalist.some(x => x.selected)
    },

    centerItem () {
      if (!this.isSelected) {
        return {
          name: this.$t('form.total'),
          amount: this.total,
          percent: 100
        }
      } else {
        return {
          name: this.selectedItem.name,
          amount: this.selectedItem.val,
          id: this.selectedItem.id
        }
      }
    },

    charts () {
      let p = 0

      const total = this.total

      return this.datalist
        .filter(c => !c.disabled)
        .map((c) => {
          const deg1 = (360 * p) / total
          const deg2 = (360 * (p += c.val)) / total
          const pathd = this.pathd({ deg1, deg2 }, c.selected)
          return Object.assign(c, { deg1, deg2, pathd })
        })
    },

    percents () {
      const total = this.total
      if (total === 0) {
        return {}
      }

      let diff = 100
      let max = null
      const pmap = this.datalist
        .filter(c => !c.disabled)
        .reduce((p, d) => {
          const s = ~~((d.val / total) * 1000) / 10
          diff -= s
          p[d.id] = s
          if (!max || (max && max.val < d.val)) {
            max = d
          }
          return p
        }, {})

      if (diff !== 0) {
        pmap[max.id] = ~~((pmap[max.id] + diff) * 10) / 10
      }

      return pmap
    }
  },

  watch: {
    dataset (values) {
      Object.assign(this, {
        history: {},
        datalist: (values || [])
          .map(mapPieData).sort((a, b) => b.val - a.val)
      })
    },

    filter (value) {
      if (value) {
        this.updateSelected(null)
        this.animation()
      }
    }
  },

  methods: {

    isWhite (color) {
      return [/(255\s*,\s*){2}(255\s*,\s*)/, /^#FFF(FFF)?$/i].some(x =>
        x.test(color)
      )
    },

    pathd (c, d) {
      const { r, cr } = this
      const mv = d ? 5 : 0
      const fx = 10

      return donut({ r, cr, mv, fx }, c)
    },

    updateSelected (id) {
      this.history = {}
      this.datalist.forEach((d) => {
        d.selected = d.id === id
        this.history[d.id] = d.pathd
      })
    },

    async animation () {
      await this.$nextTick()
      await Promise.all(Array.from(this.$refs.anim).map(a => a.beginElement()))
    },

    async selectItem (c) {
      const selected = this.isSelected
      if (c != null && !c.disabled && !c.selected) {
        this.updateSelected(c.id)
        this.$emit('change', c)
        await this.animation()
      } else {
        this.updateSelected(null)
        if (selected) {
          this.$emit('change', c)
        }
        await this.animation()
      }
    },

    async select (c) {
      if (this.filter) {
        await this.toggleDisabled(c)
      } else {
        await this.selectItem(c)
      }
    },

    async clickItem () {
      this.$emit('click', this.selectedItem)
      await this.$nextTick()
    },

    async toggleDisabled (c) {
      if (c) {
        c.disabled = !c.disabled
        this.history = {}
        this.datalist.forEach((d) => {
          d.selected = false
        })
        await this.animation()
      }
      this.$emit('change', c)
      await this.$nextTick()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "~assets/scss/ui/table.scss";

.wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;

  @media screen and (max-width: 600px) {
    display: block;
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex: 1;
    height: 100%;

    @media screen and (max-width: 600px) {
      height: unset;
    }

    .number {
      text-align: right;
    }
  }

  .piechart {
    position: sticky;
    top: 0;

    svg {
      display: block;
      margin: 0 auto;
      height: 100%;
      max-width: calc(100vh - #{$header-height} - #{$footer-height});

      background: transparent;

      .pie {
        stroke: #fefefe;
        stroke-width: 0.1;
        fill-opacity: 1;
        transition: fill-opacity 0.3s;

        &.line {
          stroke: var(--them-color-border);
        }
      }

      .center-item {
        display: flex;
        align-items: center;

        & > * {
          width: 100%;
          text-align: center;
        }

        &-name {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }

  .detail {
    padding: 5px;
    max-height: 100%;
    overflow-y: auto;
    display: flex;

    .table {
      @include __table;

      .row {
        cursor: pointer;
        background: rgba(255, 255, 255, 0.8);

        .color {
          height: 1em;
          width: 1em;
          display: block;
          border-radius: 50%;

          &.line {
            border: 1px solid var(--them-color-border);
          }
        }

        [class^="col"] {
          position: relative;
          padding: 5px;
          border-bottom: 1px solid transparent;
        }

        &.disabled {
          color: var(--font-color-disabled);
          .color {
            opacity: 0.1;
            border: 1px solid var(--them-color-border);
          }
        }
      }
    }
  }

  &.selected {

    .piechart {
      .pie:not(.selected) {
        transition: fill-opacity 0.3s;
        fill-opacity: 0.1;
      }
    }

    .detail {
      .row:not(.selected) {
        .color {
          opacity: 0.1;
          border: 1px solid var(--them-color-border);
        }
      }
    }
  }
}
</style>
