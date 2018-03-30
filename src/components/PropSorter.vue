<script>
import TypeColor from './TypeColor';
import TypeSpace from './TypeSpace';
import TypeRadius from './TypeRadius';
import TypeProminence from './TypeProminence';
import TypeTypography from './TypeTypography';
import TypeToken from './TypeToken';
import TypeInset from './TypeInset';
import TypeBreakpoint from './TypeBreakpoint';

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
      if (ctx.props.type === 'radius') return TypeRadius;
      if (ctx.props.type === 'prominence') return TypeProminence;
      if (ctx.props.type === 'typography') return TypeTypography;
      if (ctx.props.type === 'inset') return TypeInset;
      if (ctx.props.type === 'breakpoint') return TypeBreakpoint;

      return TypeToken;
    }

    return h(
      tokenComponent(),
      { ...ctx },
      ctx.children);
  },
};
</script>
