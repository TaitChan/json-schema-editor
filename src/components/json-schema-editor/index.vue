<template>
  <div>
    <bbb v-model="jsonRun" :view="view"></bbb>
  </div>
</template>

<script>
  import { deepClone } from '@/components/utils'
  import Bbb from '@/components/json-schema-editor/bbb'

  export default {
    name: 'JsonSchemaEditor',
    components: { Bbb },
    props: {
      modelValue: {
        type: Object,
        default: () => {},
      },
      view: {
        type: Boolean,
        default: false,
      },
    },
    provide() {
      return {
        provideData: this.provideData
      }
    },
    data() {
      return {
        provideData: {
          count: 1,
          isSelectAll:false
        },
        jsonRun: [],
        jsonOut: [],
      }
    },
    watch: {
      jsonRun: {
        handler() {
          this.handleOutput()
          this.$emit('update:modelValue', this.jsonOut)
        },
        deep: true,
      },
    },
    created() {
      this.handleInput()
    },
    methods: {
      handleInput() {
        // 处理输入值
        this.jsonRun = this.getJsonRun(
          deepClone({ root: { ...this.modelValue, disabled: true,isRoot:true,isSelectAll:false } })
        )
      },
      handleOutput() {
        // 处理输出值
        this.jsonOut = this.getJsonSchema(deepClone(this.jsonRun)).root
        delete this.jsonOut.isRoot
        delete this.jsonOut.isSelectAll
      },
      getJsonRun(tree, requiredArr) {
        let list = []
        Object.keys(tree).forEach((key) => {
          let row = { prop: key, ...tree[key] }
          if (tree[key].properties) {
            //对象
            row.children = this.getJsonRun(
                tree[key].properties,
                tree[key].required
            )
          }
          if (tree[key].items) {
            //数组
            row.children = this.getJsonRun({
              items:{
                ...tree[key].items,
                disabled:true
              }
            })
          }
          row.required = requiredArr && requiredArr.includes(key)
          delete row.properties
          delete row.items
          list.push(row)
        })
        return list
      },
      getJsonSchema(list) {
        let tree = {}
        list.forEach((item) => {
          let required = []
          tree[item.prop] = item
          if (item.children) {
            item.children.forEach((row) => {
              if (row.required) {
                required.push(row.prop)
              }
            })
            if (item.type === 'object') {
              tree[item.prop].properties = this.getJsonSchema(item.children)
              tree[item.prop].isClosed=true
              delete tree[item.prop].isClosed
            }
            if (item.type === 'array') {
              tree[item.prop].items = this.getJsonSchema([item.children[0]]).items
              delete tree[item.prop].items.disabled
            }
            delete item.children
            delete item.disabled
          }
          tree[item.prop].required = required
          if(tree[item.prop].type!=='object'){
            delete tree[item.prop].required
          }
          delete tree[item.prop]['prop']
        })
        return tree
      },
    },
  }
</script>

<style scoped></style>
