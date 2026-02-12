<template>
  <section class="right" @click="toCustomer">
    <img src="../../../../assets/images/customer.png" />
    <div>客服</div>
  </section>
</template>

<script setup>
const props = defineProps({
  link: {
    type: String,
  },
});
const toCustomer = () => {
  location.href = props.link;
};
</script>

<style lang="less" scoped>
.right {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: column nowrap;
  position: fixed;
  right: calc((100vw - 375px) / 2);
  bottom: 25vh;
  font-size: 12px;
  width: 16px;
  text-align: center;
  color: #fff;
  padding: 6px 3px;
  box-sizing: content-box;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius:  5px 0 0 5px ;
  z-index: 99;
  img {
    width: 12px;
    margin-bottom: 3px;
  }
}
@media screen and (min-width: @max-device-width) {
  .right {
    width: 20PX;
    font-size: 12PX;
    img {
      width: 12PX;
      margin-bottom: 3PX;
    }
  }
}
</style>
