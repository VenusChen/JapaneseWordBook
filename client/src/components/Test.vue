<template>
  <div>
    <el-button @click="show = !show">Click Me</el-button>

    <div style="display: flex; margin-top: 20px; height: 100px;">
      <!-- <transition name="el-fade-in"> -->
      <el-collapse-transition>
        <div v-show="show">
          <el-dialog title="提示" :visible.sync="show" width="30%">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="show = false">取 消</el-button>
              <el-button type="primary" @click="show = false">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-collapse-transition>
      <!-- </transition> -->
      <!-- <el-collapse-transition> -->
        <!-- <transition name="el-fade-in"> -->
          <!-- <div v-show="show" class="transition-box">.el-fade-in</div> -->
        <!-- </transition> -->
      <!-- </el-collapse-transition> -->
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: true
  })
};
</script>

<style>
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409eff;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>