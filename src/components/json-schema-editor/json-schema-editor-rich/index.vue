<template>
  <div>
    <el-tabs>
      <el-tab-pane label="模版">
        <el-button
          type="text"
          icon="plus"
          style="margin: 5px 0"
          @click="dialogVisible = true"
        >
          导入json
        </el-button>
        <json-schema-editor
          :key="jsonSchemaVisible"
          v-model="myValue"
        ></json-schema-editor>
      </el-tab-pane>
      <el-tab-pane label="预览">
        <div style="padding: 10px 0">
          <pre>{{ JSON.stringify(handlePreview(myValue), null, 4) }}</pre>
        </div>
      </el-tab-pane>
    </el-tabs>
    <json-dialog
      :visible="dialogVisible"
      @closed="dialogVisible = false"
      @saveJsonSchema="saveJsonSchema"
    ></json-dialog>
  </div>
</template>

<script>
  import JsonSchemaEditor from '@/components/json-schema-editor'
  import { deepClone } from '@/components/utils'
  import JsonDialog from './jsonDialog'

  export default {
    name: 'JsonSchemaEditorRich',
    components: { JsonDialog, JsonSchemaEditor },
    props: {
      modelValue: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        myValue: {},
        dialogVisible: false,
        jsonSchemaVisible: 1,
      }
    },
    watch: {
      myValue: {
        handler(val) {
          if(val){
            this.$emit('update:modelValue', deepClone(val))
          }
        },
        deep: true,
      },
    },
    created() {
      if(this.modelValue){
        this.myValue = deepClone(this.modelValue)
      }
    },
    methods: {
      saveJsonSchema(val) {
        this.myValue = val
        this.jsonSchemaVisible++
      },
      handlePreview(val) {
        let jsonSchema = deepClone(val)
        let res = {}
        if (jsonSchema['properties']) {
          Object.keys(jsonSchema['properties']).forEach((item) => {
            let row = jsonSchema['properties'][item]
            res[item] = this.handleType(row.type)
            if (row['properties']) {
              res[item] = this.handlePreview(row)
            }
          })
        }
        return res
      },
      handleType(val) {
        let res = null
        if (val === 'object') {
          res = {}
        }
        if (val === 'array') {
          res = []
        }
        if (val === 'string') {
          res = ''
        }
        if (val === 'number') {
          res = 0
        }
        if (val === 'integer') {
          res = 0
        }
        if (val === 'boolean') {
          res = false
        }
        return res
      },
    },
  }
</script>

<style scoped></style>
