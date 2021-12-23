<template>
  <div class="json-schema-editor-container">
    <div
      v-for="(item, index) in modelValue"
      :key="index"
      style="position: relative"
    >
      <div
        style="position: absolute; left: -20px; top: 6px"
        v-show="item.type === 'object'"
      >
        <a @click="handleClose(index)">
          <el-icon>
            <caret-right v-if="item.isClosed"/>
            <caret-bottom v-else/>
          </el-icon>
        </a>
      </div>
      <div class="ct-row">
        <div class="right">
          <el-row>
            <el-col :span="1" style="text-align: center">
              <el-tooltip effect="dark" content="全选" placement="top" v-if="item.isRoot">
                <el-checkbox
                    v-model="item.required"
                    @change="handleSelectAll"
                ></el-checkbox>
              </el-tooltip>
              <el-tooltip effect="dark" content="是否必须" placement="top" v-else>
                <el-checkbox v-if="item.disabled" disabled></el-checkbox>
                <el-checkbox v-else
                  v-model="item.required"
                ></el-checkbox>
              </el-tooltip>
            </el-col>
            <el-col :span="4" style="padding-right: 10px">
              <el-select
                v-model="item.type"
                style="width: 100%"
                @change="handleChange($event, index)"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8" style="padding: 0 6px">
              <el-input v-model="item.title"></el-input>
            </el-col>
            <el-col :span="8" style="padding-left: 10px">
              <el-input v-model="item.description"></el-input>
            </el-col>
            <el-col :span="3" style="padding-left: 10px" v-if="!view">
              <!--              <el-button-->
              <!--                type="text"-->
              <!--                icon="el-icon-setting"-->
              <!--                disabled-->
              <!--              ></el-button>-->
              <el-tooltip
                effect="dark"
                content="删除节点"
                placement="top"
                v-if="!item.disabled"
              >
                <el-button
                  type="text"
                  icon="delete"
                  @click="handleDel(index)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="添加子节点"
                placement="top"
                v-if="item.type === 'object'"
              >
                <el-button
                  @click="handleAdd(index)"
                  type="text"
                  icon="plus"
                ></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
        <div class="left">
          <el-input v-model="item.prop" :disabled="item.disabled"></el-input>
        </div>
      </div>
      <transition name="el-zoom-in-top">
        <bbb v-show="!item.isClosed" v-model="item.children"></bbb>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'bbb',
    props: {
      modelValue: {
        type: Array,
        default: () => [],
      },
      view: {
        type: Boolean,
        default: false,
      },
    },
    inject: ['provideData'],
    data() {
      return {
        typeList: ['string', 'number', 'integer', 'object', 'array', 'boolean'],
      }
    },
    watch: {
      modelValue: {
        handler(val) {
          this.$emit('update:modelValue', val)
        },
        deep: true,
      },
      "provideData.isSelectAll": {
        handler(val) {
          let _modelValue = this.modelValue
          _modelValue.forEach((item)=>{
            item['required']=val
          })
        },
        deep: true,
      },
    },
    methods: {
      handleSelectAll(val){
        this.provideData.isSelectAll=val
      },
      handleClose(index) {
        let _modelValue = this.modelValue
        _modelValue[index]['isClosed'] = !_modelValue[index]['isClosed']
      },
      handleChange(val, index) {
        let _modelValue = this.modelValue
        if (val === 'array') {
          _modelValue[index]['children'] = []
          _modelValue[index]['children'].push({
            prop: 'items',
            type: 'string',
            title: '',
            description: '',
            disabled: true,
          })
        } else {
          _modelValue[index]['children'] = []
        }
      },
      handleDel(index) {
        let _modelValue = this.modelValue
        _modelValue.splice(index, 1)
      },
      handleAdd(index) {
        let _modelValue = this.modelValue
        _modelValue[index]['children'] =
          this.modelValue[index]['children'] || []
        _modelValue[index]['children'].push({
          prop: `field_${this.provideData.count}`,
          type: 'string',
          title: '',
          description: '',
          required: true,
        })
        this.provideData.count++
      },
    },
  }
</script>

<style scoped>
  .json-schema-editor-container {
    padding-left: 20px;
  }
  .ct-row {
    padding-bottom: 10px;
  }
  .left {
    margin-right: 600px;
  }
  .right {
    float: right;
    width: 600px;
  }
</style>
