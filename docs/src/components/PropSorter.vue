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
    prop: Object,
    allData: [Object, Array],
  },
  render(h, ctx) {
    function tokenComponent() {
      const propExample = has(ctx.props.prop, 'docs.example') ? ctx.props.prop.docs.example : 'token';
      if (propExample === 'color') return TypeColor;
      if (propExample === 'spacing') return TypeSpace;
      if (propExample === 'sizing') return TypeSpace;
      if (propExample === 'radius') return TypeRadius;
      if (propExample === 'prominence') return TypeProminence;
      if (propExample === 'text') return TypeTypography;
      if (propExample === 'inset') return TypeInset;
      if (propExample === 'breakpoint') return TypeBreakpoint;
      if (
        propExample === 'timing'
        || propExample === 'duration'
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