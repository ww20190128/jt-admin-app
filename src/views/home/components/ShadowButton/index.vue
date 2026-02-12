<template>
  <div class="shadow-button"><span>
      <slot class="slot">
      </slot>
    </span>
  </div>
</template>

<script>
export default {
  name: "ShadowButton",
  setup() { },
};
</script>

<style lang="less" scoped>
.shadow-button {
  margin: @padding-sm 0px;
  box-shadow: 0px 0px 2px #d6d6d6;
  border-radius: @radius-base;
  height: 38px;
  line-height: 38px;
  text-align: center;
  font-size: @font-size-base;
  color: @light-black;
  .pointer();

  span {
    display: inline-block;
    transition: transform 0.3s;
  }

  &:active .span {
    animation: zoomInOut 0.3s ease-in-out;
  }
}

@keyframes zoomInOut {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }
}
</style>