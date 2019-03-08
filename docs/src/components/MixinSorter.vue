
<script>
import has from 'lodash/has';
import MixinToken from './MixinToken';
import MixinTypography from './MixinTypography';

export default {
  name: 'PropSorter',
  functional: true,
  props: {
    prop: [Array, Object],
  },
  render(h, ctx) {
    function tokenComponent() {
      const propExample = has(ctx.props.prop[0], 'docs.example') ? ctx.props.prop[0].docs.example : 'token';
      if (propExample === 'text') return MixinTypography;
      
      return MixinToken;
    }
    return h(
      tokenComponent(),
      { ...ctx },
      ctx.children);
  },
};
</script>
