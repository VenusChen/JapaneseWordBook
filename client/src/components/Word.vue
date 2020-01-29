<template>
  <div>
    <h1 align="center">单词列表</h1>

    <el-row>
      <el-col :span="12">
        <div style="margin-bottom: 15px;">
          <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="名称" value="name"></el-option>
              <el-option label="词性" value="type"></el-option>
              <el-option label="含义" value="meaning"></el-option>
              <el-option label="使用率" value="level"></el-option>
              <el-option label="出现次数" value="count"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="getList(0, sizePage)"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="12">
        <div id="addButton">
          <el-button type="text" @click="dialogFormVisible = true" icon="el-icon-plus">新建单词</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="单词" :visible.sync="dialogFormVisible" :before-close="handleClickCancel">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="读音" :label-width="formLabelWidth">
          <el-input v-model="form.pronunciation" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="词性" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="名词"></el-checkbox>
            <el-checkbox label="动词"></el-checkbox>
            <el-checkbox label="形容词"></el-checkbox>
            <el-checkbox label="na形容词"></el-checkbox>
            <el-checkbox label="形容动词"></el-checkbox>
            <el-checkbox label="副词"></el-checkbox>
            <el-checkbox label="他动词"></el-checkbox>
            <el-checkbox label="助词"></el-checkbox>
            <el-checkbox label="副助词"></el-checkbox>
            <el-checkbox label="连接词"></el-checkbox>
            <el-checkbox label="自动"></el-checkbox>
            <el-checkbox label="自他"></el-checkbox>
            <el-checkbox label="惯用"></el-checkbox>
            <el-checkbox label="一段二类"></el-checkbox>
            <el-checkbox label="五段一类"></el-checkbox>
            <el-checkbox label="か变三类"></el-checkbox>
            <el-checkbox label="sa变三类"></el-checkbox>
            <el-checkbox label="未知"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="含义" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.meaning" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="例子" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.example" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用率" :label-width="formLabelWidth">
          <el-select v-model="form.level" placeholder="请选择">
            <el-option label="极高" value="极高"></el-option>
            <el-option label="高" value="高"></el-option>
            <el-option label="中" value="中"></el-option>
            <el-option label="低" value="低"></el-option>
            <el-option label="极低" value="极低"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClickCancel()">取 消</el-button>
        <el-button
          type="primary"
          @click="handleClickAdd()"
          v-loading.fullscreen.lock="fullscreenLoading"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName" height="550">
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="pronunciation" label="读音" align="center"></el-table-column>
      <el-table-column prop="typeString" label="词性" align="center" width="150"></el-table-column>
      <el-table-column prop="meaning" label="含义" align="center" width="400"></el-table-column>
      <el-table-column prop="count" label="出现次数" align="center" width="100"></el-table-column>
      <!-- <el-table-column prop="createdAt" label="创建时间" align="center"></el-table-column> -->
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleClickCountAdd(scope.row)"
            type="primary"
            size="small"
            icon="el-icon-plus"
            circle
            plain
          ></el-button>
          <el-button
            @click="handleClickEdit(scope.row)"
            type="success"
            size="small"
            icon="el-icon-edit"
            circle
            plain
          ></el-button>
          <el-button
            @click="handleClickDel(scope.row)"
            type="danger"
            size="small"
            icon="el-icon-delete"
            circle
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block" id="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="sizePage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  mounted() {
    this.getList(0, this.sizePage);
  },
  methods: {
    getList(skip, limit) {
      const params = {
        skip,
        limit
      };
      if (this.input && this.select) {
        params[this.select] = this.input;
      }
      this.$axios({
        method: "get",
        url: this.address + "/word/list",
        params
      }).then(res => {
        if (res.data.list) {
          for (const data of res.data.list) {
            data.createdAt = new Date(data.createdAt).toLocaleString();
            data.typeString = data.type.toString();
            data.count = data.count || 0;
          }
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.fullscreenLoading = false;
        }
      });
    },
    handleClickAdd() {
      this.fullscreenLoading = true;
      let method;
      if (this.form._id) {
        method = "put";
      } else {
        method = "post";
      }
      // window.console.log(this.form);
      this.$axios({
        method,
        url: this.address + "/word",
        data: this.form
      }).then(res => {
        if (res.status === 200) {
          this.getList(0, this.sizePage);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }
      });
      this.handleClickCancel();
    },
    handleClickCancel() {
      this.form = { type: [] };
      this.dialogFormVisible = false;
    },
    handleClickCountAdd(row) {
      this.$axios({
        method: "put",
        url: this.address + "/word",
        data: { _id: row._id, count: row.count ? row.count + 1 : 1 }
      }).then(res => {
        if (res.status === 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          row.count++;
        }
      });
    },
    handleClickEdit(row) {
      this.dialogFormVisible = true;
      if (!row.type) {
        row.type = [];
      }
      this.form = row;
    },
    handleClickDel(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.fullscreenLoading = true;
          this.$axios({
            method: "delete",
            url: this.address + "/word",
            data: { _id: row._id }
          }).then(res => {
            if (res.status === 200) {
              this.getList(0, this.sizePage);
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      // window.console.log(`每页 ${val} 条`);
      this.sizePage = val;
      this.getList((this.currentPage - 1) * this.sizePage, this.sizePage);
    },
    handleCurrentChange(val) {
      // window.console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getList((this.currentPage - 1) * this.sizePage, this.sizePage);
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.count && row.count >= 5) {
        if (row.count >= 30) {
          return "red-row";
        } else if (row.count >= 25) {
          return "yellow-row";
        } else if (row.count >= 20) {
          return "orange-row";
        } else if (row.count >= 15) {
          return "purple-row";
        } else if (row.count >= 10) {
          return "blue-row";
        } else {
          return "green-row";
        }
      } else {
        if (rowIndex % 2 === 0) {
          return "grap-row";
        } else {
          return "";
        }
      }
    }
  },

  data() {
    return {
      input: "",
      select: "",
      address: "http://localhost:3000",
      total: 0,
      currentPage: 1,
      sizePage: 10,
      tableData: [],
      fullscreenLoading: false,
      dialogFormVisible: false,
      form: { type: [] },
      formLabelWidth: "100px"
    };
  }
};
</script>

<style>
.el-table .green-row {
  background: lightgreen;
}
.el-table .blue-row {
  background: lightblue;
}
.el-table .grap-row {
  background: #e8e8e8;
}
.el-table .orange-row {
  background: orange;
}
.el-table .yellow-row {
  background: yellow;
}
.el-table .red-row {
  background: Tomato;
}
.el-table .purple-row {
  background: magenta;
}

.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

#addButton {
  text-align: right;
}
#page {
  text-align: center;
}
</style>