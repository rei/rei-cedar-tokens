import { c as u, g as t, y as d } from "./index-DIC7bB7E.js";
const { useEffect: i, addons: p } = __STORYBOOK_MODULE_PREVIEW_API__;
function g(e) {
  let r = e?.parameters.docs?.source,
    s = e?.parameters.__isArgsStory;
  return r?.type === t.DYNAMIC ? !1 : !s || r?.code || r?.type === t.CODE;
}
var l = (e, r) => {
    let s = e(),
      o = r?.parameters.docs?.source?.excludeDecorators
        ? r.originalStoryFn(r.args, r)
        : s,
      a;
    return (
      g(r) ||
        (typeof o == "string"
          ? (a = o)
          : o instanceof Element && (a = o.outerHTML)),
      i(() => {
        let { id: c, unmappedArgs: n } = r;
        a && p.getChannel().emit(d, { id: c, args: n, source: a });
      }),
      s
    );
  },
  m = [l],
  _ = {
    docs: {
      story: { inline: !0 },
      source: {
        type: t.DYNAMIC,
        language: "html",
        code: void 0,
        excludeDecorators: void 0,
      },
    },
  },
  f = [u];
export { f as argTypesEnhancers, m as decorators, _ as parameters };
