try {
  (() => {
    var re = Object.create;
    var W = Object.defineProperty;
    var ie = Object.getOwnPropertyDescriptor;
    var ce = Object.getOwnPropertyNames;
    var ae = Object.getPrototypeOf,
      se = Object.prototype.hasOwnProperty;
    var E = ((e) =>
      typeof require < "u"
        ? require
        : typeof Proxy < "u"
          ? new Proxy(e, {
              get: (o, a) => (typeof require < "u" ? require : o)[a],
            })
          : e)(function (e) {
      if (typeof require < "u") return require.apply(this, arguments);
      throw Error('Dynamic require of "' + e + '" is not supported');
    });
    var M = (e, o) => () => (e && (o = e((e = 0))), o);
    var le = (e, o) => () => (
      o || e((o = { exports: {} }).exports, o),
      o.exports
    );
    var ue = (e, o, a, r) => {
      if ((o && typeof o == "object") || typeof o == "function")
        for (let i of ce(o))
          !se.call(e, i) &&
            i !== a &&
            W(e, i, {
              get: () => o[i],
              enumerable: !(r = ie(o, i)) || r.enumerable,
            });
      return e;
    };
    var de = (e, o, a) => (
      (a = e != null ? re(ae(e)) : {}),
      ue(
        o || !e || !e.__esModule
          ? W(a, "default", { value: e, enumerable: !0 })
          : a,
        e,
      )
    );
    var p = M(() => {});
    var h = M(() => {});
    var f = M(() => {});
    var X = le((Q, V) => {
      p();
      h();
      f();
      (function (e) {
        if (typeof Q == "object" && typeof V < "u") V.exports = e();
        else if (typeof define == "function" && define.amd) define([], e);
        else {
          var o;
          (typeof window < "u" || typeof window < "u"
            ? (o = window)
            : typeof self < "u"
              ? (o = self)
              : (o = this),
            (o.memoizerific = e()));
        }
      })(function () {
        var e, o, a;
        return (function r(i, I, s) {
          function t(c, d) {
            if (!I[c]) {
              if (!i[c]) {
                var l = typeof E == "function" && E;
                if (!d && l) return l(c, !0);
                if (n) return n(c, !0);
                var k = new Error("Cannot find module '" + c + "'");
                throw ((k.code = "MODULE_NOT_FOUND"), k);
              }
              var m = (I[c] = { exports: {} });
              i[c][0].call(
                m.exports,
                function (b) {
                  var _ = i[c][1][b];
                  return t(_ || b);
                },
                m,
                m.exports,
                r,
                i,
                I,
                s,
              );
            }
            return I[c].exports;
          }
          for (var n = typeof E == "function" && E, u = 0; u < s.length; u++)
            t(s[u]);
          return t;
        })(
          {
            1: [
              function (r, i, I) {
                i.exports = function (s) {
                  if (typeof Map != "function" || s) {
                    var t = r("./similar");
                    return new t();
                  } else return new Map();
                };
              },
              { "./similar": 2 },
            ],
            2: [
              function (r, i, I) {
                function s() {
                  return (
                    (this.list = []),
                    (this.lastItem = void 0),
                    (this.size = 0),
                    this
                  );
                }
                ((s.prototype.get = function (t) {
                  var n;
                  if (this.lastItem && this.isEqual(this.lastItem.key, t))
                    return this.lastItem.val;
                  if (((n = this.indexOf(t)), n >= 0))
                    return ((this.lastItem = this.list[n]), this.list[n].val);
                }),
                  (s.prototype.set = function (t, n) {
                    var u;
                    return this.lastItem && this.isEqual(this.lastItem.key, t)
                      ? ((this.lastItem.val = n), this)
                      : ((u = this.indexOf(t)),
                        u >= 0
                          ? ((this.lastItem = this.list[u]),
                            (this.list[u].val = n),
                            this)
                          : ((this.lastItem = { key: t, val: n }),
                            this.list.push(this.lastItem),
                            this.size++,
                            this));
                  }),
                  (s.prototype.delete = function (t) {
                    var n;
                    if (
                      (this.lastItem &&
                        this.isEqual(this.lastItem.key, t) &&
                        (this.lastItem = void 0),
                      (n = this.indexOf(t)),
                      n >= 0)
                    )
                      return (this.size--, this.list.splice(n, 1)[0]);
                  }),
                  (s.prototype.has = function (t) {
                    var n;
                    return this.lastItem && this.isEqual(this.lastItem.key, t)
                      ? !0
                      : ((n = this.indexOf(t)),
                        n >= 0 ? ((this.lastItem = this.list[n]), !0) : !1);
                  }),
                  (s.prototype.forEach = function (t, n) {
                    var u;
                    for (u = 0; u < this.size; u++)
                      t.call(
                        n || this,
                        this.list[u].val,
                        this.list[u].key,
                        this,
                      );
                  }),
                  (s.prototype.indexOf = function (t) {
                    var n;
                    for (n = 0; n < this.size; n++)
                      if (this.isEqual(this.list[n].key, t)) return n;
                    return -1;
                  }),
                  (s.prototype.isEqual = function (t, n) {
                    return t === n || (t !== t && n !== n);
                  }),
                  (i.exports = s));
              },
              {},
            ],
            3: [
              function (r, i, I) {
                var s = r("map-or-similar");
                i.exports = function (c) {
                  var d = new s(!1),
                    l = [];
                  return function (k) {
                    var m = function () {
                      var b = d,
                        _,
                        R,
                        T = arguments.length - 1,
                        x = Array(T + 1),
                        O = !0,
                        A;
                      if ((m.numArgs || m.numArgs === 0) && m.numArgs !== T + 1)
                        throw new Error(
                          "Memoizerific functions should always be called with the same number of arguments",
                        );
                      for (A = 0; A < T; A++) {
                        if (
                          ((x[A] = { cacheItem: b, arg: arguments[A] }),
                          b.has(arguments[A]))
                        ) {
                          b = b.get(arguments[A]);
                          continue;
                        }
                        ((O = !1),
                          (_ = new s(!1)),
                          b.set(arguments[A], _),
                          (b = _));
                      }
                      return (
                        O &&
                          (b.has(arguments[T])
                            ? (R = b.get(arguments[T]))
                            : (O = !1)),
                        O ||
                          ((R = k.apply(null, arguments)),
                          b.set(arguments[T], R)),
                        c > 0 &&
                          ((x[T] = { cacheItem: b, arg: arguments[T] }),
                          O ? t(l, x) : l.push(x),
                          l.length > c && n(l.shift())),
                        (m.wasMemoized = O),
                        (m.numArgs = T + 1),
                        R
                      );
                    };
                    return (
                      (m.limit = c),
                      (m.wasMemoized = !1),
                      (m.cache = d),
                      (m.lru = l),
                      m
                    );
                  };
                };
                function t(c, d) {
                  var l = c.length,
                    k = d.length,
                    m,
                    b,
                    _;
                  for (b = 0; b < l; b++) {
                    for (m = !0, _ = 0; _ < k; _++)
                      if (!u(c[b][_].arg, d[_].arg)) {
                        m = !1;
                        break;
                      }
                    if (m) break;
                  }
                  c.push(c.splice(b, 1)[0]);
                }
                function n(c) {
                  var d = c.length,
                    l = c[d - 1],
                    k,
                    m;
                  for (
                    l.cacheItem.delete(l.arg), m = d - 2;
                    m >= 0 &&
                    ((l = c[m]), (k = l.cacheItem.get(l.arg)), !k || !k.size);
                    m--
                  )
                    l.cacheItem.delete(l.arg);
                }
                function u(c, d) {
                  return c === d || (c !== c && d !== d);
                }
              },
              { "map-or-similar": 1 },
            ],
          },
          {},
          [3],
        )(3);
      });
    });
    p();
    h();
    f();
    p();
    h();
    f();
    p();
    h();
    f();
    p();
    h();
    f();
    var g = __REACT__,
      {
        Children: Ee,
        Component: Be,
        Fragment: D,
        Profiler: we,
        PureComponent: Re,
        StrictMode: xe,
        Suspense: Le,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Pe,
        cloneElement: Me,
        createContext: De,
        createElement: Ue,
        createFactory: Ge,
        createRef: Ne,
        forwardRef: Fe,
        isValidElement: He,
        lazy: qe,
        memo: B,
        startTransition: ze,
        unstable_act: Ke,
        useCallback: U,
        useContext: Ve,
        useDebugValue: Ye,
        useDeferredValue: We,
        useEffect: je,
        useId: $e,
        useImperativeHandle: Ze,
        useInsertionEffect: Je,
        useLayoutEffect: Qe,
        useMemo: j,
        useReducer: Xe,
        useRef: eo,
        useState: G,
        useSyncExternalStore: oo,
        useTransition: no,
        version: to,
      } = __REACT__;
    p();
    h();
    f();
    var so = __STORYBOOK_API__,
      {
        ActiveTabs: lo,
        Consumer: uo,
        ManagerContext: Io,
        Provider: mo,
        RequestResponseError: po,
        addons: N,
        combineParameters: ho,
        controlOrMetaKey: fo,
        controlOrMetaSymbol: go,
        eventMatchesShortcut: bo,
        eventToShortcut: ko,
        experimental_MockUniversalStore: _o,
        experimental_UniversalStore: yo,
        experimental_requestResponse: So,
        experimental_useUniversalStore: Co,
        isMacLike: vo,
        isShortcutTaken: To,
        keyToSymbol: Ao,
        merge: Oo,
        mockChannel: Eo,
        optionOrAltSymbol: Bo,
        shortcutMatchesShortcut: wo,
        shortcutToHumanString: Ro,
        types: $,
        useAddonState: xo,
        useArgTypes: Lo,
        useArgs: Po,
        useChannel: Mo,
        useGlobalTypes: Do,
        useGlobals: L,
        useParameter: P,
        useSharedState: Uo,
        useStoryPrepared: Go,
        useStorybookApi: No,
        useStorybookState: Fo,
      } = __STORYBOOK_API__;
    p();
    h();
    f();
    var Vo = __STORYBOOK_COMPONENTS__,
      {
        A: Yo,
        ActionBar: Wo,
        AddonPanel: jo,
        Badge: $o,
        Bar: Zo,
        Blockquote: Jo,
        Button: Qo,
        ClipboardCode: Xo,
        Code: en,
        DL: on,
        Div: nn,
        DocumentWrapper: tn,
        EmptyTabContent: rn,
        ErrorFormatter: cn,
        FlexBar: an,
        Form: sn,
        H1: ln,
        H2: un,
        H3: dn,
        H4: In,
        H5: mn,
        H6: pn,
        HR: hn,
        IconButton: w,
        IconButtonSkeleton: fn,
        Icons: gn,
        Img: bn,
        LI: kn,
        Link: _n,
        ListItem: yn,
        Loader: Sn,
        Modal: Cn,
        OL: vn,
        P: Tn,
        Placeholder: An,
        Pre: On,
        ProgressSpinner: En,
        ResetWrapper: Bn,
        ScrollArea: wn,
        Separator: Rn,
        Spaced: xn,
        Span: Ln,
        StorybookIcon: Pn,
        StorybookLogo: Mn,
        Symbols: Dn,
        SyntaxHighlighter: Un,
        TT: Gn,
        TabBar: Nn,
        TabButton: Fn,
        TabWrapper: Hn,
        Table: qn,
        Tabs: zn,
        TabsState: Kn,
        TooltipLinkList: F,
        TooltipMessage: Vn,
        TooltipNote: Yn,
        UL: Wn,
        WithTooltip: H,
        WithTooltipPure: jn,
        Zoom: $n,
        codeCommon: Zn,
        components: Jn,
        createCopyToClipboardFunction: Qn,
        getStoryHref: Xn,
        icons: et,
        interleaveSeparators: ot,
        nameSpaceClassNames: nt,
        resetComponents: tt,
        withReset: rt,
      } = __STORYBOOK_COMPONENTS__;
    p();
    h();
    f();
    var lt = __STORYBOOK_ICONS__,
      {
        AccessibilityAltIcon: ut,
        AccessibilityIcon: dt,
        AccessibilityIgnoredIcon: It,
        AddIcon: mt,
        AdminIcon: pt,
        AlertAltIcon: ht,
        AlertIcon: ft,
        AlignLeftIcon: gt,
        AlignRightIcon: bt,
        AppleIcon: kt,
        ArrowBottomLeftIcon: _t,
        ArrowBottomRightIcon: yt,
        ArrowDownIcon: St,
        ArrowLeftIcon: Ct,
        ArrowRightIcon: vt,
        ArrowSolidDownIcon: Tt,
        ArrowSolidLeftIcon: At,
        ArrowSolidRightIcon: Ot,
        ArrowSolidUpIcon: Et,
        ArrowTopLeftIcon: Bt,
        ArrowTopRightIcon: wt,
        ArrowUpIcon: Rt,
        AzureDevOpsIcon: xt,
        BackIcon: Lt,
        BasketIcon: Pt,
        BatchAcceptIcon: Mt,
        BatchDenyIcon: Dt,
        BeakerIcon: Ut,
        BellIcon: Gt,
        BitbucketIcon: Nt,
        BoldIcon: Ft,
        BookIcon: Ht,
        BookmarkHollowIcon: qt,
        BookmarkIcon: zt,
        BottomBarIcon: Kt,
        BottomBarToggleIcon: Vt,
        BoxIcon: Yt,
        BranchIcon: Wt,
        BrowserIcon: jt,
        ButtonIcon: $t,
        CPUIcon: Zt,
        CalendarIcon: Jt,
        CameraIcon: Qt,
        CameraStabilizeIcon: Xt,
        CategoryIcon: er,
        CertificateIcon: or,
        ChangedIcon: nr,
        ChatIcon: tr,
        CheckIcon: rr,
        ChevronDownIcon: ir,
        ChevronLeftIcon: cr,
        ChevronRightIcon: ar,
        ChevronSmallDownIcon: sr,
        ChevronSmallLeftIcon: lr,
        ChevronSmallRightIcon: ur,
        ChevronSmallUpIcon: dr,
        ChevronUpIcon: Ir,
        ChromaticIcon: mr,
        ChromeIcon: pr,
        CircleHollowIcon: hr,
        CircleIcon: Z,
        ClearIcon: fr,
        CloseAltIcon: gr,
        CloseIcon: br,
        CloudHollowIcon: kr,
        CloudIcon: _r,
        CogIcon: yr,
        CollapseIcon: Sr,
        CommandIcon: Cr,
        CommentAddIcon: vr,
        CommentIcon: Tr,
        CommentsIcon: Ar,
        CommitIcon: Or,
        CompassIcon: Er,
        ComponentDrivenIcon: Br,
        ComponentIcon: wr,
        ContrastIcon: Rr,
        ContrastIgnoredIcon: xr,
        ControlsIcon: Lr,
        CopyIcon: Pr,
        CreditIcon: Mr,
        CrossIcon: Dr,
        DashboardIcon: Ur,
        DatabaseIcon: Gr,
        DeleteIcon: Nr,
        DiamondIcon: Fr,
        DirectionIcon: Hr,
        DiscordIcon: qr,
        DocChartIcon: zr,
        DocListIcon: Kr,
        DocumentIcon: Vr,
        DownloadIcon: Yr,
        DragIcon: Wr,
        EditIcon: jr,
        EllipsisIcon: $r,
        EmailIcon: Zr,
        ExpandAltIcon: Jr,
        ExpandIcon: Qr,
        EyeCloseIcon: Xr,
        EyeIcon: ei,
        FaceHappyIcon: oi,
        FaceNeutralIcon: ni,
        FaceSadIcon: ti,
        FacebookIcon: ri,
        FailedIcon: ii,
        FastForwardIcon: ci,
        FigmaIcon: ai,
        FilterIcon: si,
        FlagIcon: li,
        FolderIcon: ui,
        FormIcon: di,
        GDriveIcon: Ii,
        GithubIcon: mi,
        GitlabIcon: pi,
        GlobeIcon: hi,
        GoogleIcon: fi,
        GraphBarIcon: gi,
        GraphLineIcon: bi,
        GraphqlIcon: ki,
        GridAltIcon: _i,
        GridIcon: q,
        GrowIcon: yi,
        HeartHollowIcon: Si,
        HeartIcon: Ci,
        HomeIcon: vi,
        HourglassIcon: Ti,
        InfoIcon: Ai,
        ItalicIcon: Oi,
        JumpToIcon: Ei,
        KeyIcon: Bi,
        LightningIcon: wi,
        LightningOffIcon: Ri,
        LinkBrokenIcon: xi,
        LinkIcon: Li,
        LinkedinIcon: Pi,
        LinuxIcon: Mi,
        ListOrderedIcon: Di,
        ListUnorderedIcon: Ui,
        LocationIcon: Gi,
        LockIcon: Ni,
        MarkdownIcon: Fi,
        MarkupIcon: Hi,
        MediumIcon: qi,
        MemoryIcon: zi,
        MenuIcon: Ki,
        MergeIcon: Vi,
        MirrorIcon: Yi,
        MobileIcon: Wi,
        MoonIcon: ji,
        NutIcon: $i,
        OutboxIcon: Zi,
        OutlineIcon: Ji,
        PaintBrushIcon: Qi,
        PaperClipIcon: Xi,
        ParagraphIcon: ec,
        PassedIcon: oc,
        PhoneIcon: nc,
        PhotoDragIcon: tc,
        PhotoIcon: z,
        PhotoStabilizeIcon: rc,
        PinAltIcon: ic,
        PinIcon: cc,
        PlayAllHollowIcon: ac,
        PlayBackIcon: sc,
        PlayHollowIcon: lc,
        PlayIcon: uc,
        PlayNextIcon: dc,
        PlusIcon: Ic,
        PointerDefaultIcon: mc,
        PointerHandIcon: pc,
        PowerIcon: hc,
        PrintIcon: fc,
        ProceedIcon: gc,
        ProfileIcon: bc,
        PullRequestIcon: kc,
        QuestionIcon: _c,
        RSSIcon: yc,
        RedirectIcon: Sc,
        ReduxIcon: Cc,
        RefreshIcon: J,
        ReplyIcon: vc,
        RepoIcon: Tc,
        RequestChangeIcon: Ac,
        RewindIcon: Oc,
        RulerIcon: Ec,
        SaveIcon: Bc,
        SearchIcon: wc,
        ShareAltIcon: Rc,
        ShareIcon: xc,
        ShieldIcon: Lc,
        SideBySideIcon: Pc,
        SidebarAltIcon: Mc,
        SidebarAltToggleIcon: Dc,
        SidebarIcon: Uc,
        SidebarToggleIcon: Gc,
        SpeakerIcon: Nc,
        StackedIcon: Fc,
        StarHollowIcon: Hc,
        StarIcon: qc,
        StatusFailIcon: zc,
        StatusIcon: Kc,
        StatusPassIcon: Vc,
        StatusWarnIcon: Yc,
        StickerIcon: Wc,
        StopAltHollowIcon: jc,
        StopAltIcon: $c,
        StopIcon: Zc,
        StorybookIcon: Jc,
        StructureIcon: Qc,
        SubtractIcon: Xc,
        SunIcon: ea,
        SupportIcon: oa,
        SweepIcon: na,
        SwitchAltIcon: ta,
        SyncIcon: ra,
        TabletIcon: ia,
        ThumbsUpIcon: ca,
        TimeIcon: aa,
        TimerIcon: sa,
        TransferIcon: la,
        TrashIcon: ua,
        TwitterIcon: da,
        TypeIcon: Ia,
        UbuntuIcon: ma,
        UndoIcon: pa,
        UnfoldIcon: ha,
        UnlockIcon: fa,
        UnpinIcon: ga,
        UploadIcon: ba,
        UserAddIcon: ka,
        UserAltIcon: _a,
        UserIcon: ya,
        UsersIcon: Sa,
        VSCodeIcon: Ca,
        VerifiedIcon: va,
        VideoIcon: Ta,
        WandIcon: Aa,
        WatchIcon: Oa,
        WindowsIcon: Ea,
        WrenchIcon: Ba,
        XIcon: wa,
        YoutubeIcon: Ra,
        ZoomIcon: xa,
        ZoomOutIcon: La,
        ZoomResetIcon: Pa,
        iconList: Ma,
      } = __STORYBOOK_ICONS__;
    p();
    h();
    f();
    var Fa = __STORYBOOK_CLIENT_LOGGER__,
      {
        deprecate: Ha,
        logger: K,
        once: qa,
        pretty: za,
      } = __STORYBOOK_CLIENT_LOGGER__;
    var Y = de(X());
    p();
    h();
    f();
    var Qa = __STORYBOOK_THEMING__,
      {
        CacheProvider: Xa,
        ClassNames: es,
        Global: os,
        ThemeProvider: ns,
        background: ts,
        color: rs,
        convert: is,
        create: cs,
        createCache: as,
        createGlobal: ss,
        createReset: ls,
        css: us,
        darken: ds,
        ensure: Is,
        ignoreSsrWarning: ms,
        isPropValid: ps,
        jsx: hs,
        keyframes: fs,
        lighten: gs,
        styled: ee,
        themes: bs,
        typography: ks,
        useTheme: _s,
        withTheme: ys,
      } = __STORYBOOK_THEMING__;
    p();
    h();
    f();
    function oe(e) {
      for (var o = [], a = 1; a < arguments.length; a++)
        o[a - 1] = arguments[a];
      var r = Array.from(typeof e == "string" ? [e] : e);
      r[r.length - 1] = r[r.length - 1].replace(/\r?\n([\t ]*)$/, "");
      var i = r.reduce(function (t, n) {
        var u = n.match(/\n([\t ]+|(?!\s).)/g);
        return u
          ? t.concat(
              u.map(function (c) {
                var d, l;
                return (l =
                  (d = c.match(/[\t ]/g)) === null || d === void 0
                    ? void 0
                    : d.length) !== null && l !== void 0
                  ? l
                  : 0;
              }),
            )
          : t;
      }, []);
      if (i.length) {
        var I = new RegExp(
          `
[	 ]{` +
            Math.min.apply(Math, i) +
            "}",
          "g",
        );
        r = r.map(function (t) {
          return t.replace(
            I,
            `
`,
          );
        });
      }
      r[0] = r[0].replace(/^\r?\n/, "");
      var s = r[0];
      return (
        o.forEach(function (t, n) {
          var u = s.match(/(?:^|\n)( *)$/),
            c = u ? u[1] : "",
            d = t;
          (typeof t == "string" &&
            t.includes(`
`) &&
            (d = String(t)
              .split(
                `
`,
              )
              .map(function (l, k) {
                return k === 0 ? l : "" + c + l;
              }).join(`
`)),
            (s += d + r[n + 1]));
        }),
        s
      );
    }
    var ne = "storybook/background",
      y = "backgrounds",
      Ie = {
        light: { name: "light", value: "#F8F8F8" },
        dark: { name: "dark", value: "#333" },
      },
      me = B(function () {
        let e = P(y),
          [o, a, r] = L(),
          [i, I] = G(!1),
          { options: s = Ie, disable: t = !0 } = e || {};
        if (t) return null;
        let n = o[y] || {},
          u = n.value,
          c = n.grid || !1,
          d = s[u],
          l = !!r?.[y],
          k = Object.keys(s).length;
        return g.createElement(pe, {
          length: k,
          backgroundMap: s,
          item: d,
          updateGlobals: a,
          backgroundName: u,
          setIsTooltipVisible: I,
          isLocked: l,
          isGridActive: c,
          isTooltipVisible: i,
        });
      }),
      pe = B(function (e) {
        let {
            item: o,
            length: a,
            updateGlobals: r,
            setIsTooltipVisible: i,
            backgroundMap: I,
            backgroundName: s,
            isLocked: t,
            isGridActive: n,
            isTooltipVisible: u,
          } = e,
          c = U(
            (d) => {
              r({ [y]: d });
            },
            [r],
          );
        return g.createElement(
          D,
          null,
          g.createElement(
            w,
            {
              key: "grid",
              active: n,
              disabled: t,
              title: "Apply a grid to the preview",
              onClick: () => c({ value: s, grid: !n }),
            },
            g.createElement(q, null),
          ),
          a > 0
            ? g.createElement(
                H,
                {
                  key: "background",
                  placement: "top",
                  closeOnOutsideClick: !0,
                  tooltip: ({ onHide: d }) =>
                    g.createElement(F, {
                      links: [
                        ...(o
                          ? [
                              {
                                id: "reset",
                                title: "Reset background",
                                icon: g.createElement(J, null),
                                onClick: () => {
                                  (c({ value: void 0, grid: n }), d());
                                },
                              },
                            ]
                          : []),
                        ...Object.entries(I).map(([l, k]) => ({
                          id: l,
                          title: k.name,
                          icon: g.createElement(Z, {
                            color: k?.value || "grey",
                          }),
                          active: l === s,
                          onClick: () => {
                            (c({ value: l, grid: n }), d());
                          },
                        })),
                      ].flat(),
                    }),
                  onVisibleChange: i,
                },
                g.createElement(
                  w,
                  {
                    disabled: t,
                    key: "background",
                    title: "Change the background of the preview",
                    active: !!o || u,
                  },
                  g.createElement(z, null),
                ),
              )
            : null,
        );
      }),
      he = ee.span(
        ({ background: e }) => ({
          borderRadius: "1rem",
          display: "block",
          height: "1rem",
          width: "1rem",
          background: e,
        }),
        ({ theme: e }) => ({
          boxShadow: `${e.appBorderColor} 0 0 0 1px inset`,
        }),
      ),
      fe = (e, o = [], a) => {
        if (e === "transparent") return "transparent";
        if (o.find((i) => i.value === e) || e) return e;
        let r = o.find((i) => i.name === a);
        if (r) return r.value;
        if (a) {
          let i = o.map((I) => I.name).join(", ");
          K.warn(oe`
        Backgrounds Addon: could not find the default color "${a}".
        These are the available colors for your story based on your configuration:
        ${i}.
      `);
        }
        return "transparent";
      },
      te = (0, Y.default)(1e3)((e, o, a, r, i, I) => ({
        id: e || o,
        title: o,
        onClick: () => {
          i({ selected: a, name: o });
        },
        value: a,
        right: r ? g.createElement(he, { background: a }) : void 0,
        active: I,
      })),
      ge = (0, Y.default)(10)((e, o, a) => {
        let r = e.map(({ name: i, value: I }) =>
          te(null, i, I, !0, a, I === o),
        );
        return o !== "transparent"
          ? [te("reset", "Clear background", "transparent", null, a, !1), ...r]
          : r;
      }),
      be = { default: null, disable: !0, values: [] },
      ke = B(function () {
        let e = P(y, be),
          [o, a] = G(!1),
          [r, i] = L(),
          I = r[y]?.value,
          s = j(() => fe(I, e.values, e.default), [e, I]);
        Array.isArray(e) &&
          K.warn(
            "Addon Backgrounds api has changed in Storybook 6.0. Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md",
          );
        let t = U(
          (n) => {
            i({ [y]: { ...r[y], value: n } });
          },
          [e, r, i],
        );
        return e.disable
          ? null
          : g.createElement(
              H,
              {
                placement: "top",
                closeOnOutsideClick: !0,
                tooltip: ({ onHide: n }) =>
                  g.createElement(F, {
                    links: ge(e.values, s, ({ selected: u }) => {
                      (s !== u && t(u), n());
                    }),
                  }),
                onVisibleChange: a,
              },
              g.createElement(
                w,
                {
                  key: "background",
                  title: "Change the background of the preview",
                  active: s !== "transparent" || o,
                },
                g.createElement(z, null),
              ),
            );
      }),
      _e = B(function () {
        let [e, o] = L(),
          { grid: a } = P(y, { grid: { disable: !1 } });
        if (a?.disable) return null;
        let r = e[y]?.grid || !1;
        return g.createElement(
          w,
          {
            key: "background",
            active: r,
            title: "Apply a grid to the preview",
            onClick: () => o({ [y]: { ...e[y], grid: !r } }),
          },
          g.createElement(q, null),
        );
      });
    N.register(ne, () => {
      N.add(ne, {
        title: "Backgrounds",
        type: $.TOOL,
        match: ({ viewMode: e, tabId: o }) =>
          !!(e && e.match(/^(story|docs)$/)) && !o,
        render: () =>
          FEATURES?.backgroundsStoryGlobals
            ? g.createElement(me, null)
            : g.createElement(
                D,
                null,
                g.createElement(ke, null),
                g.createElement(_e, null),
              ),
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
