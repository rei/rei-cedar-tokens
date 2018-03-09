<script>
import TypeColor from './TypeColor';
import TypeSpace from './TypeSpace';
import TypeTypography from './TypeTypography';
import TypeToken from './TypeToken';

export default {
  name: 'PropSorter',
  functional: true,
  props: {
    type: String,
    prop: Object,
  },
  render(h, ctx) {
    function tokenComponent() {
      if (ctx.props.type === 'color') return TypeColor;
      if (ctx.props.type === 'spacing') return TypeSpace;
      if (ctx.props.type === 'typography') return TypeTypography;

      return TypeToken;
    }

    return h(
      tokenComponent(),
      { ...ctx },
      ctx.children);
  },
};
</script>
