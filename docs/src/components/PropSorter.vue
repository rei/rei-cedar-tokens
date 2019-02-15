<script>
import has from 'lodash/has';
import TypeColor from './TypeColor';
import TypeSpace from './TypeSpace';
import TypeRadius from './TypeRadius';
import TypeProminence from './TypeProminence';
import TypeTypography from './TypeTypography';
import TypeToken from './TypeToken';
import TypeInset from './TypeInset';
import TypeBreakpoint from './TypeBreakpoint';
import TypeMotion from './TypeMotion';
export default {
  name: 'PropSorter',
  functional: true,
  props: {
    name: String,
    prop: Object,
    allData: [Object, Array],
  },
  render(h, ctx) {
    function tokenComponent() {
      const propType = has(ctx.props.prop, 'docExample') ? ctx.props.prop.docExample : 'token';
      if (propType === 'color') return TypeColor;
      if (propType === 'spacing') return TypeSpace;
      if (propType === 'sizing') return TypeSpace;
      if (propType === 'radius') return TypeRadius;
      if (propType === 'prominence') return TypeProminence;
      if (propType === 'text') return TypeTypography;
      if (propType === 'inset') return TypeInset;
      if (propType === 'breakpoint') return TypeBreakpoint;
      if (
        propType === 'timing'
        || propType === 'duration'
      ) return TypeMotion;
      
      return TypeToken;
    }
    return h(
      tokenComponent(),
      { ...ctx },
      ctx.children);
  },
};
</script>