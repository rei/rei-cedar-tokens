try {
  (() => {
    var l = __REACT__,
      {
        Children: se,
        Component: ie,
        Fragment: ue,
        Profiler: ce,
        PureComponent: de,
        StrictMode: pe,
        Suspense: me,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: _e,
        cloneElement: be,
        createContext: Se,
        createElement: ye,
        createFactory: Te,
        createRef: ve,
        forwardRef: ke,
        isValidElement: Oe,
        lazy: Ce,
        memo: fe,
        startTransition: Ie,
        unstable_act: Ee,
        useCallback: k,
        useContext: xe,
        useDebugValue: ge,
        useDeferredValue: Ae,
        useEffect: x,
        useId: Re,
        useImperativeHandle: he,
        useInsertionEffect: Le,
        useLayoutEffect: Be,
        useMemo: Pe,
        useReducer: Me,
        useRef: L,
        useState: B,
        useSyncExternalStore: Ne,
        useTransition: Ue,
        version: De,
      } = __REACT__;
    var Fe = __STORYBOOK_API__,
      {
        ActiveTabs: Ge,
        Consumer: Ke,
        ManagerContext: Ye,
        Provider: $e,
        RequestResponseError: qe,
        addons: g,
        combineParameters: ze,
        controlOrMetaKey: je,
        controlOrMetaSymbol: Ze,
        eventMatchesShortcut: Je,
        eventToShortcut: Qe,
        experimental_MockUniversalStore: Xe,
        experimental_UniversalStore: et,
        experimental_requestResponse: tt,
        experimental_useUniversalStore: ot,
        isMacLike: rt,
        isShortcutTaken: nt,
        keyToSymbol: lt,
        merge: at,
        mockChannel: st,
        optionOrAltSymbol: it,
        shortcutMatchesShortcut: ut,
        shortcutToHumanString: ct,
        types: P,
        useAddonState: dt,
        useArgTypes: pt,
        useArgs: mt,
        useChannel: _t,
        useGlobalTypes: M,
        useGlobals: A,
        useParameter: bt,
        useSharedState: St,
        useStoryPrepared: yt,
        useStorybookApi: N,
        useStorybookState: Tt,
      } = __STORYBOOK_API__;
    var ft = __STORYBOOK_COMPONENTS__,
      {
        A: It,
        ActionBar: Et,
        AddonPanel: xt,
        Badge: gt,
        Bar: At,
        Blockquote: Rt,
        Button: ht,
        ClipboardCode: Lt,
        Code: Bt,
        DL: Pt,
        Div: Mt,
        DocumentWrapper: Nt,
        EmptyTabContent: Ut,
        ErrorFormatter: Dt,
        FlexBar: Vt,
        Form: wt,
        H1: Ht,
        H2: Wt,
        H3: Ft,
        H4: Gt,
        H5: Kt,
        H6: Yt,
        HR: $t,
        IconButton: U,
        IconButtonSkeleton: qt,
        Icons: R,
        Img: zt,
        LI: jt,
        Link: Zt,
        ListItem: Jt,
        Loader: Qt,
        Modal: Xt,
        OL: eo,
        P: to,
        Placeholder: oo,
        Pre: ro,
        ProgressSpinner: no,
        ResetWrapper: lo,
        ScrollArea: ao,
        Separator: D,
        Spaced: so,
        Span: io,
        StorybookIcon: uo,
        StorybookLogo: co,
        Symbols: po,
        SyntaxHighlighter: mo,
        TT: _o,
        TabBar: bo,
        TabButton: So,
        TabWrapper: yo,
        Table: To,
        Tabs: vo,
        TabsState: ko,
        TooltipLinkList: V,
        TooltipMessage: Oo,
        TooltipNote: Co,
        UL: fo,
        WithTooltip: w,
        WithTooltipPure: Io,
        Zoom: Eo,
        codeCommon: xo,
        components: go,
        createCopyToClipboardFunction: Ao,
        getStoryHref: Ro,
        icons: ho,
        interleaveSeparators: Lo,
        nameSpaceClassNames: Bo,
        resetComponents: Po,
        withReset: Mo,
      } = __STORYBOOK_COMPONENTS__;
    var G = { type: "item", value: "" },
      K = (o, t) => ({
        ...t,
        name: t.name || o,
        description: t.description || o,
        toolbar: {
          ...t.toolbar,
          items: t.toolbar.items.map((e) => {
            let r = typeof e == "string" ? { value: e, title: e } : e;
            return (
              r.type === "reset" &&
                t.toolbar.icon &&
                ((r.icon = t.toolbar.icon), (r.hideIcon = !0)),
              { ...G, ...r }
            );
          }),
        },
      }),
      Y = ["reset"],
      $ = (o) => o.filter((t) => !Y.includes(t.type)).map((t) => t.value),
      b = "addon-toolbars",
      q = async (o, t, e) => {
        (e &&
          e.next &&
          (await o.setAddonShortcut(b, {
            label: e.next.label,
            defaultShortcut: e.next.keys,
            actionName: `${t}:next`,
            action: e.next.action,
          })),
          e &&
            e.previous &&
            (await o.setAddonShortcut(b, {
              label: e.previous.label,
              defaultShortcut: e.previous.keys,
              actionName: `${t}:previous`,
              action: e.previous.action,
            })),
          e &&
            e.reset &&
            (await o.setAddonShortcut(b, {
              label: e.reset.label,
              defaultShortcut: e.reset.keys,
              actionName: `${t}:reset`,
              action: e.reset.action,
            })));
      },
      z = (o) => (t) => {
        let {
            id: e,
            toolbar: { items: r, shortcuts: n },
          } = t,
          c = N(),
          [S, i] = A(),
          a = L([]),
          u = S[e],
          O = k(() => {
            i({ [e]: "" });
          }, [i]),
          C = k(() => {
            let s = a.current,
              p = s.indexOf(u),
              m = p === s.length - 1 ? 0 : p + 1,
              d = a.current[m];
            i({ [e]: d });
          }, [a, u, i]),
          f = k(() => {
            let s = a.current,
              p = s.indexOf(u),
              m = p > -1 ? p : 0,
              d = m === 0 ? s.length - 1 : m - 1,
              _ = a.current[d];
            i({ [e]: _ });
          }, [a, u, i]);
        return (
          x(() => {
            n &&
              q(c, e, {
                next: { ...n.next, action: C },
                previous: { ...n.previous, action: f },
                reset: { ...n.reset, action: O },
              });
          }, [c, e, n, C, f, O]),
          x(() => {
            a.current = $(r);
          }, []),
          l.createElement(o, { cycleValues: a.current, ...t })
        );
      },
      H = ({ currentValue: o, items: t }) =>
        o != null && t.find((e) => e.value === o && e.type !== "reset"),
      j = ({ currentValue: o, items: t }) => {
        let e = H({ currentValue: o, items: t });
        if (e) return e.icon;
      },
      Z = ({ currentValue: o, items: t }) => {
        let e = H({ currentValue: o, items: t });
        if (e) return e.title;
      },
      J = ({
        active: o,
        disabled: t,
        title: e,
        icon: r,
        description: n,
        onClick: c,
      }) =>
        l.createElement(
          U,
          { active: o, title: n, disabled: t, onClick: t ? () => {} : c },
          r &&
            l.createElement(R, { icon: r, __suppressDeprecationWarning: !0 }),
          e ? `\xA0${e}` : null,
        ),
      Q = ({
        right: o,
        title: t,
        value: e,
        icon: r,
        hideIcon: n,
        onClick: c,
        disabled: S,
        currentValue: i,
      }) => {
        let a =
            r &&
            l.createElement(R, {
              style: { opacity: 1 },
              icon: r,
              __suppressDeprecationWarning: !0,
            }),
          u = {
            id: e ?? "_reset",
            active: i === e,
            right: o,
            title: t,
            disabled: S,
            onClick: c,
          };
        return (r && !n && (u.icon = a), u);
      },
      X = z(
        ({
          id: o,
          name: t,
          description: e,
          toolbar: {
            icon: r,
            items: n,
            title: c,
            preventDynamicIcon: S,
            dynamicTitle: i,
          },
        }) => {
          let [a, u, O] = A(),
            [C, f] = B(!1),
            s = a[o],
            p = !!s,
            m = o in O,
            d = r,
            _ = c;
          (S || (d = j({ currentValue: s, items: n }) || d),
            i && (_ = Z({ currentValue: s, items: n }) || _),
            !_ && !d && console.warn(`Toolbar '${t}' has no title or icon`));
          let W = k(
            (E) => {
              u({ [o]: E });
            },
            [o, u],
          );
          return l.createElement(
            w,
            {
              placement: "top",
              tooltip: ({ onHide: E }) => {
                let F = n
                  .filter(({ type: I }) => {
                    let h = !0;
                    return (I === "reset" && !s && (h = !1), h);
                  })
                  .map((I) =>
                    Q({
                      ...I,
                      currentValue: s,
                      disabled: m,
                      onClick: () => {
                        (W(I.value), E());
                      },
                    }),
                  );
                return l.createElement(V, { links: F });
              },
              closeOnOutsideClick: !0,
              onVisibleChange: f,
            },
            l.createElement(J, {
              active: C || p,
              disabled: m,
              description: e || "",
              icon: d,
              title: _ || "",
            }),
          );
        },
      ),
      ee = () => {
        let o = M(),
          t = Object.keys(o).filter((e) => !!o[e].toolbar);
        return t.length
          ? l.createElement(
              l.Fragment,
              null,
              l.createElement(D, null),
              t.map((e) => {
                let r = K(e, o[e]);
                return l.createElement(X, { key: e, id: e, ...r });
              }),
            )
          : null;
      };
    g.register(b, () =>
      g.add(b, {
        title: b,
        type: P.TOOL,
        match: ({ tabId: o }) => !o,
        render: () => l.createElement(ee, null),
      }),
    );
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
