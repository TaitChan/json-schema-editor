<template>
  <div class="ct-dialog">
    <el-dialog
        class="ct-dialog"
        width="40%"
        title="导入"
        :model-value="visible"
        @open="open"
        @close="$emit('closed')"
        destroy-on-close
    >
      <el-tabs v-model="tabName">
        <el-tab-pane label="JSON" name="JSON233">
          <template #label>
          <span>
            JSON
            <el-tooltip placement="right">
              <template #content>
                <pre>{{ tempJson }}</pre>
              </template>
              <el-icon>
                <warning />
              </el-icon>
            </el-tooltip>
          </span>
          </template>
          <ct-monaco-editor v-model="jsonValue"></ct-monaco-editor>
        </el-tab-pane>
        <el-tab-pane label="JSON-SCHEMA" name="JSON-SCHEMA">
          <template #label>
          <span>
            JSON-SCHEMA
            <el-tooltip placement="right">
              <template #content>
                <pre>{{ tempJsonSchema }}</pre>
              </template>
              <el-icon>
                <warning />
              </el-icon>
            </el-tooltip>
          </span>
          </template>
          <ct-monaco-editor v-model="jsonSchemaValue"></ct-monaco-editor>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button icon="circle-close" @click="$emit('closed')">
          取消
        </el-button>
        <el-button icon="circle-check" type="primary" @click="handleSave">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import { isJson } from '@/components/utils'
  import CtMonacoEditor from '@/components/ct-monaco-editor'
  export default {
    name: 'jsonDialog',
    components: { CtMonacoEditor },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['saveJsonSchema'],
    data() {
      return {
        tabName: 'JSON233',
        jsonValue: '',
        jsonSchemaValue: '',
        tempJson: `示例:
  {
      "id": 2,
      "name": "张三",
      "someObj": {
          "age": 18
      },
      "someArr": [1,2,3]
  }`,
        tempJsonSchema: `示例:
  {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "title": "Product",
      "description": "A product from Acme's catalog",
      "type": "object",
      "properties": {
          "id": {
              "description": "The unique identifier for a product",
              "type": "integer"
          },
          "name": {
              "description": "Name of the product",
              "type": "string"
          },
          "price": {
              "type": "number",
              "minimum": 0,
              "exclusiveMinimum": true
          }
      },
      "required": ["id", "name", "price"]
  }`,
      }
    },
    methods: {
      open() {
        this.tabName = 'JSON233'
      },
      handleJson(json) {
        let res = {}
        let jsonSchema = this.jsonToSchema({ root: json }, res)
        return jsonSchema['root']
      },
      jsonToSchema(obj, res) {
        Object.keys(obj).forEach((prop) => {
          let type = Object.prototype.toString
            .call(obj[prop])
            .slice(8, -1)
            .toLowerCase()
          res[prop] = {}
          res[prop]['type'] = type
          if (type === 'object') {
            res[prop]['properties'] = this.jsonToSchema(obj[prop], {})
            res[prop]['required'] = []
          }
          if (type === 'array') {
            let _type = 'string'
            if (obj[prop].length > 0) {
              _type = Object.prototype.toString
                .call(obj[prop][0])
                .slice(8, -1)
                .toLowerCase()
            }
            res[prop]['items'] = {
              type: _type,
            }
          }
        })
        return res
      },
      handleSave() {
        if (this.tabName === 'JSON233') {
          if (!isJson(this.jsonValue)) {
            this.$message.warning('json数据格式有误')
          } else {
            this.$emit('closed')
            this.$emit(
              'saveJsonSchema',
              this.handleJson(JSON.parse(this.jsonValue.replace(/\s+/g, '')))
            )
          }
        } else {
          if (!isJson(this.jsonSchemaValue)) {
            this.$message.warning('json数据格式有误')
          } else {
            this.$emit('closed')
            this.$emit(
              'saveJsonSchema',
              JSON.parse(this.jsonSchemaValue.replace(/\s+/g, ''))
            )
          }
        }
      },
    },
  }
</script>

<style>
.ct-dialog .el-dialog__body{
  padding-top: 0;
  padding-bottom: 10px;
}
</style>
