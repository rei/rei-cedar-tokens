try {
  (() => {
    var v = __STORYBOOK_API__,
      {
        ActiveTabs: O,
        Consumer: T,
        ManagerContext: h,
        Provider: g,
        RequestResponseError: U,
        addons: i,
        combineParameters: f,
        controlOrMetaKey: A,
        controlOrMetaSymbol: x,
        eventMatchesShortcut: P,
        eventToShortcut: M,
        experimental_MockUniversalStore: R,
        experimental_UniversalStore: C,
        experimental_requestResponse: w,
        experimental_useUniversalStore: B,
        isMacLike: E,
        isShortcutTaken: I,
        keyToSymbol: K,
        merge: N,
        mockChannel: G,
        optionOrAltSymbol: L,
        shortcutMatchesShortcut: Y,
        shortcutToHumanString: q,
        types: D,
        useAddonState: F,
        useArgTypes: H,
        useArgs: j,
        useChannel: V,
        useGlobalTypes: z,
        useGlobals: J,
        useParameter: Q,
        useSharedState: W,
        useStoryPrepared: X,
        useStorybookApi: Z,
        useStorybookState: $,
      } = __STORYBOOK_API__;
    var a = (() => {
        let e;
        return (
          typeof window < "u"
            ? (e = window)
            : typeof globalThis < "u"
              ? (e = globalThis)
              : typeof window < "u"
                ? (e = window)
                : typeof self < "u"
                  ? (e = self)
                  : (e = {}),
          e
        );
      })(),
      c = "tag-filters",
      m = "static-filter";
    i.register(c, (e) => {
      let l = Object.entries(a.TAGS_OPTIONS ?? {}).reduce((o, r) => {
        let [t, u] = r;
        return (u.excludeFromSidebar && (o[t] = !0), o);
      }, {});
      e.experimental_setFilter(m, (o) => {
        let r = o.tags ?? [];
        return (
          (r.includes("dev") || o.type === "docs") &&
          r.filter((t) => l[t]).length === 0
        );
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
