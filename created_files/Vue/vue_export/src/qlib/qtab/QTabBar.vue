<script>
import { h, defineComponent, ref, mergeProps, Fragment } from 'vue'

export default defineComponent({
  name: 'QTabBar',
  props: {
    dividerColor: String,
    indicatorColor: String,
    tabHeaderSize: String,
    dividerSize: String,
    indicatorHeight: {
      type: String,
      default: "3px"
    },
    tailwaindClasses: {
      type: String,
      default: ""
    },
    tabDirection: {
      type: String,
      default: "Top" // Top, Bottom, Left, Right
    },
    bgColor: String
  },
  setup(props, { slots }) {
    const activeIndex = ref(0)

    const flattenChildren = (nodes) => {
      let flattened = []
      if (!nodes) return flattened
      
      nodes.forEach(node => {
        if (node.type === Fragment) {
          flattened.push(...flattenChildren(node.children))
        } else {
          flattened.push(node)
        }
      })
      return flattened
    }

    return () => {
      const headers = []
      const bodies = []
      
      const defaultSlot = slots.default ? slots.default() : []
      const children = flattenChildren(defaultSlot)

      children.forEach((child, index) => {
        // Check if child is QTab based on its name
        const childType = child.type
        const childName = childType?.name || childType?.__name || childType?.displayName

        if (childName === 'QTab') {
          // Access QTab's default slot content
          const tabContent = child.children && child.children.default ? child.children.default() : []
          const flatTabContent = flattenChildren(tabContent)
          
          const headerNode = flatTabContent.find(c => {
            const name = c.type?.name || c.type?.__name || c.type?.displayName
            return name === 'QTabHeader'
          })
          
          const bodyNode = flatTabContent.find(c => {
            const name = c.type?.name || c.type?.__name || c.type?.displayName
            return name === 'QTabBody'
          })

          if (headerNode) {
             const isVertical = props.tabDirection === "Left" || props.tabDirection === "Right"
             const headerTailClasses = `${headerNode.props?.tailwaindClasses || ""} ${
              isVertical ? "w-full" : "flex-1"
            }`.trim()
            
            headers.push(h(headerNode.type, mergeProps(headerNode.props || {}, {
              onClick: () => activeIndex.value = index,
              isActive: index === activeIndex.value,
              indicatorColor: props.indicatorColor,
              tabDirection: props.tabDirection,
              indicatorHeight: props.indicatorHeight,
              tailwaindClasses: headerTailClasses,
              key: `header-${index}`
            }), headerNode.children))
          }

          if (bodyNode) {
             const isVertical = props.tabDirection === "Left" || props.tabDirection === "Right"
             const bodyTailClasses = `${bodyNode.props?.tailwaindClasses || ""} flex-1 ${
              isVertical ? "h-full" : "w-full"
            }`.trim()

            // We only need to push/render if it matches the logic of "one body active"
            // But we push them all to the array to select later
            bodies.push(h(bodyNode.type, mergeProps(bodyNode.props || {}, {
              isVisible: index === activeIndex.value,
              tailwaindClasses: bodyTailClasses,
              key: `body-${index}`
            }), bodyNode.children))
          }
        }
      })

      const isVertical = props.tabDirection === "Left" || props.tabDirection === "Right"
      
      const directionMap = {
        Top: "flex-col",
        Bottom: "flex-col-reverse",
        Left: "flex-row",
        Right: "flex-row-reverse",
      }
      const flexion = directionMap[props.tabDirection] || "flex-col"

      // Header Container Style/Classes
      let headersClass = `${isVertical ? "flex-col border-r-[1px]" : "flex-row border-b-[1px]"} flex`
      let headersStyle = {}
      
      switch (props.tabDirection) {
        case "Top":
           headersStyle = { height: props.tabHeaderSize, borderBottomColor: props.dividerColor, borderBottomWidth: props.dividerSize }
           break
        case "Bottom":
           headersStyle = { height: props.tabHeaderSize, borderTopColor: props.dividerColor, borderTopWidth: props.dividerSize }
           break
        case "Left":
           headersStyle = { width: props.tabHeaderSize, borderRightColor: props.dividerColor, borderRightWidth: props.dividerSize }
           break
        case "Right":
           headersStyle = { width: props.tabHeaderSize, borderLeftColor: props.dividerColor, borderLeftWidth: props.dividerSize }
           break
      }

      return h('div', {
        class: `flex ${flexion} ${props.tailwaindClasses} QTabBar`,
        style: {
           background: props.bgColor,
           ...(isVertical ? { gap: props.dividerSize } : {})
        }
      }, [
        // Tab Headers
        h('div', {
          class: headersClass,
          style: headersStyle
        }, headers),
        
        // Active Tab Body
        bodies[activeIndex.value]
      ])
    }
  }
})
</script>
