<template>
  <div class="top-up-wrap">
    <div class="head-warper">
      <div class="left" @click="$router.go(-1)">
        <img src="@/assets/images/icon/back.png" alt="返回" />
      </div>
    </div>
    <div class="section user-info-section">
      <div class="account-info-wrap">
        <div class="form-row">
          <div class="label">商铺ID1</div>
          <div class="value-wrap">
            <span>{{ id }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="label">商铺名称</div>
          <div class="value-wrap">
            <span>{{ name }}</span>
          </div>
        </div>

        <div class="form-row required">
          <div class="label">充值金额</div>
          <div class="value-wrap">
            <!-- 金额输入框：仅允许数字（含小数点） -->
            <input
              v-model="amount"
              type="text"
              class="form-input"
              placeholder="请输入充值金额"
              @input="handleAmountInput"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="label">回执单</div>
          <div class="receipt-wrap">
            <!-- 上传组件容器 -->
            <van-uploader
              class="upload-wrap"
              v-model="topUpProof"
              :max-count="1"
              accept="image/*"
              :max-size="5242880"
              :after-read="afterRead"
              :before-read="beforeRead"
              :preview-image="true"
              preview-size="120"
            >
              <!-- 自定义上传按钮样式 -->
              <div class="upload-btn" v-if="!topUpProof.length">
                <van-icon name="plus" size="24" />
                <span class="upload-text">点击上传回执单</span>
                <span class="upload-tip">支持jpg/png格式，大小不超过5MB</span>
              </div>
            </van-uploader>
          </div>
        </div>

        <div class="form-row">
          <div class="label">备注</div>
          <div class="value-wrap">
            <!-- 备注改为多行文本框 -->
            <textarea
              v-model="remark"
              class="form-textarea"
              placeholder="请输入备注（选填）"
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="op-wrap">
        <button class="op-btn cancel-btn" @click="handleCancel">取消</button>
        <button class="op-btn confirm-btn" @click="handleCreate">
          确认充值
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Toast, Uploader, Icon, Loading } from "vant";
import { topup, uploadFile } from "@/api/admin";

export default {
  name: "top-up",
  components: {
    VanUploader: Uploader,
    VanIcon: Icon,
    VanLoading: Loading,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { id, name } = route.query;

    const state = reactive({
      id: id || "",
      name: name || "",
      amount: "1000",
      remark: "",
      topUpProof: [], // 充值凭证
      receipt: "", // 上传成功后的回执单URL
    });

    // 取消按钮逻辑
    const handleCancel = () => {
      router.go(-1);
    };

    // 图片上传前校验
    function beforeRead(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        Toast("请上传图片格式文件");
        return false;
      }
      const isLt5M = file.size <= 5 * 1024 * 1024;
      if (!isLt5M) {
        Toast("图片大小不能超过5MB");
        return false;
      }
      return true;
    }

    // 图片上传后处理
    async function afterRead(file) {
      console.log("上传的文件：", file);
      // 模拟上传接口请求
      const loading = Toast.loading({
        message: "上传中...",
        forbidClick: true,
        duration: 0,
      });
      const formData = new FormData();
      formData.append("file", file.file); // 二进制文件
      formData.append("method", "post");
      formData.append("filename", "receipt"); // 文件名，可根据实际修改
      formData.append("action", "#"); // 对应截图中的 action 字段
      const { data } = await uploadFile(formData);
      state.receipt = data.path;
      setTimeout(() => {
        loading.clear();
        file.status = "success";
        Toast("图片上传成功");
      }, 2000);
    }

    // 金额输入处理：仅允许数字和小数点，且小数点只能有一个
    const handleAmountInput = () => {
      state.amount = state.amount
        .replace(/[^0-9.]/g, "") // 移除所有非数字和非小数点的字符
        .replace(/^\./g, "") // 移除开头的小数点
        .replace(/\.{2,}/g, ".") // 多个小数点只保留第一个
        .replace(".", "$#$") // 临时替换小数点
        .replace(/\./g, "") // 移除其他小数点
        .replace("$#$", "."); // 恢复小数点
    };

    // 创建按钮逻辑（包含表单验证）
    async function handleCreate() {
      // 验证充值金额
      if (!state.amount || Number(state.amount) <= 0) {
        Toast("请输入有效的充值金额");
        return;
      }
      if (!state.receipt) {
        Toast("请上传充值凭证");
        return;
      }
      try {
        const { data } = await topup({
          agentId: Number(state.id),
          receipt: state.receipt,
          amount: Number(state.amount),
          remark: state.remark,
        });
        Toast("充值成功");
        router.go(-1);
      } catch (error) {
        Toast("充值失败，请重试");
      }
    }

    onMounted(() => {
      // 初始化数据
    });

    return {
      ...toRefs(state),
      handleCancel,
      handleAmountInput,
      handleCreate,
      beforeRead,
      afterRead,
    };
  },
};
</script>

<style lang="less" scoped>
// 基础变量
@primary: #1890ff;
@primary-light: #e8f4ff;
@border: #dcdfe6;
@border-light: #e5e6eb;
@text-main: #333;
@text-secondary: #666;
@text-placeholder: #909399;
@bg-light: #f5f7fa;
@danger: #f56c6c;
@success: #00b42a;
@padding-base: 16px;
@radius-base: 8px;
@radius-sm: 4px;

// 页面容器
.top-up-wrap {
  max-width: 900px;
  margin: 0 auto;
  background-color: @bg-light;
  min-height: 100vh;
}

// 头部
.head-warper {
  width: 100%;
  height: 48px;
  display: flex;
  padding: 0 @padding-base;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid @border-light;

  .left {
    cursor: pointer;
    img {
      height: 20px;
    }
  }
}

// 内容区域
.section {
  background: #fff;
  margin-top: 12px;
  border-radius: @radius-base;
  margin: 12px @padding-base 0;
  overflow: hidden;
}

.account-info-wrap {
  padding: 0 @padding-base;
}

// 表单行
.form-row {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid @border-light;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &.required label::before {
    content: "*";
    color: @danger;
    margin-right: 4px;
  }

  .label {
    height: 44px;
    line-height: 44px;
    flex: 0 0 80px;
    color: @text-main;
    font-size: 15px;
  }

  .value-wrap {
    height: 44px;
    flex: 1;
    display: flex;
    flex-direction: column;
    span {
      line-height: 44px;
      font-size: 15px;
    }
  }

  // 输入框样式优化
  .form-input {
    width: 100%;
    height: 44px;
    padding: 0 16px;
    border: 1px solid @border;
    border-radius: @radius-base;
    font-size: 15px;
    color: @text-main;
    background-color: #fff;
    transition: all 0.2s ease;

    &:focus {
      border-color: @primary;
      outline: none;
      box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
    }

    &::placeholder {
      color: @text-placeholder;
      font-size: 14px;
    }
  }

  // 多行文本框样式优化
  .form-textarea {
    width: 100%;
    min-height: 80px;
    padding: 16px;
    border: 1px solid @border;
    border-radius: @radius-base;
    font-size: 15px;
    color: @text-main;
    resize: vertical;
    line-height: 1.6;
    transition: all 0.2s ease;

    &:focus {
      border-color: @primary;
      outline: none;
      box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
    }

    &::placeholder {
      color: @text-placeholder;
      font-size: 14px;
    }
  }

  // 上传区域样式优化
  .receipt-wrap {
    flex: 1;
    :deep(.van-uploader) {
      width: 100%;

      // 自定义上传按钮
      .upload-btn {
        height: 100px;
        border: 1px dashed @border;
        border-radius: @radius-base;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: @bg-light;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          border-color: @primary;
          background-color: @primary-light;
        }

        .van-icon {
          color: @primary;
          margin-bottom: 8px;
        }

        .upload-text {
          font-size: 14px;
          color: @text-secondary;
          margin-bottom: 4px;
        }

        .upload-tip {
          font-size: 12px;
          color: @text-placeholder;
        }
      }

      // 上传后的图片样式
      :deep(.van-uploader__preview) {
        width: 100%;
        height: 100px;
        border-radius: @radius-base;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      // 移除默认的删除按钮背景，优化位置
      :deep(.van-uploader__preview-delete) {
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
      }
    }
  }
}

// 操作按钮区域
.op-wrap {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 40px @padding-base;
  background-color: #fff;
  margin: 12px @padding-base;
  border-radius: @radius-base;

  .op-btn {
    flex: 1;
    height: 44px;
    border-radius: @radius-base;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &.cancel-btn {
      background-color: #fff;
      color: @text-secondary;
      border: 1px solid @border;

      &:hover {
        background-color: @bg-light;
      }
    }

    &.confirm-btn {
      background-color: @primary;
      color: #fff;

      &:hover {
        background-color: #40a9ff;
      }

      &:active {
        background-color: #096dd9;
      }
    }
  }
}
</style>
