try {
  (() => {
    var me = Object.create;
    var J = Object.defineProperty;
    var he = Object.getOwnPropertyDescriptor;
    var fe = Object.getOwnPropertyNames;
    var ge = Object.getPrototypeOf,
      be = Object.prototype.hasOwnProperty;
    var x = ((e) =>
      typeof require < "u"
        ? require
        : typeof Proxy < "u"
          ? new Proxy(e, {
              get: (t, c) => (typeof require < "u" ? require : t)[c],
            })
          : e)(function (e) {
      if (typeof require < "u") return require.apply(this, arguments);
      throw Error('Dynamic require of "' + e + '" is not supported');
    });
    var U = (e, t) => () => (e && (t = e((e = 0))), t);
    var ye = (e, t) => () => (
      t || e((t = { exports: {} }).exports, t),
      t.exports
    );
    var we = (e, t, c, s) => {
      if ((t && typeof t == "object") || typeof t == "function")
        for (let a of fe(t))
          !be.call(e, a) &&
            a !== c &&
            J(e, a, {
              get: () => t[a],
              enumerable: !(s = he(t, a)) || s.enumerable,
            });
      return e;
    };
    var Se = (e, t, c) => (
      (c = e != null ? me(ge(e)) : {}),
      we(
        t || !e || !e.__esModule
          ? J(c, "default", { value: e, enumerable: !0 })
          : c,
        e,
      )
    );
    var f = U(() => {});
    var g = U(() => {});
    var b = U(() => {});
    var le = ye((ae, Z) => {
      f();
      g();
      b();
      (function (e) {
        if (typeof ae == "object" && typeof Z < "u") Z.exports = e();
        else if (typeof define == "function" && define.amd) define([], e);
        else {
          var t;
          (typeof window < "u" || typeof window < "u"
            ? (t = window)
            : typeof self < "u"
              ? (t = self)
              : (t = this),
            (t.memoizerific = e()));
        }
      })(function () {
        var e, t, c;
        return (function s(a, y, I) {
          function o(n, p) {
            if (!y[n]) {
              if (!a[n]) {
                var r = typeof x == "function" && x;
                if (!p && r) return r(n, !0);
                if (i) return i(n, !0);
                var u = new Error("Cannot find module '" + n + "'");
                throw ((u.code = "MODULE_NOT_FOUND"), u);
              }
              var d = (y[n] = { exports: {} });
              a[n][0].call(
                d.exports,
                function (h) {
                  var w = a[n][1][h];
                  return o(w || h);
                },
                d,
                d.exports,
                s,
                a,
                y,
                I,
              );
            }
            return y[n].exports;
          }
          for (var i = typeof x == "function" && x, m = 0; m < I.length; m++)
            o(I[m]);
          return o;
        })(
          {
            1: [
              function (s, a, y) {
                a.exports = function (I) {
                  if (typeof Map != "function" || I) {
                    var o = s("./similar");
                    return new o();
                  } else return new Map();
                };
              },
              { "./similar": 2 },
            ],
            2: [
              function (s, a, y) {
                function I() {
                  return (
                    (this.list = []),
                    (this.lastItem = void 0),
                    (this.size = 0),
                    this
                  );
                }
                ((I.prototype.get = function (o) {
                  var i;
                  if (this.lastItem && this.isEqual(this.lastItem.key, o))
                    return this.lastItem.val;
                  if (((i = this.indexOf(o)), i >= 0))
                    return ((this.lastItem = this.list[i]), this.list[i].val);
                }),
                  (I.prototype.set = function (o, i) {
                    var m;
                    return this.lastItem && this.isEqual(this.lastItem.key, o)
                      ? ((this.lastItem.val = i), this)
                      : ((m = this.indexOf(o)),
                        m >= 0
                          ? ((this.lastItem = this.list[m]),
                            (this.list[m].val = i),
                            this)
                          : ((this.lastItem = { key: o, val: i }),
                            this.list.push(this.lastItem),
                            this.size++,
                            this));
                  }),
                  (I.prototype.delete = function (o) {
                    var i;
                    if (
                      (this.lastItem &&
                        this.isEqual(this.lastItem.key, o) &&
                        (this.lastItem = void 0),
                      (i = this.indexOf(o)),
                      i >= 0)
                    )
                      return (this.size--, this.list.splice(i, 1)[0]);
                  }),
                  (I.prototype.has = function (o) {
                    var i;
                    return this.lastItem && this.isEqual(this.lastItem.key, o)
                      ? !0
                      : ((i = this.indexOf(o)),
                        i >= 0 ? ((this.lastItem = this.list[i]), !0) : !1);
                  }),
                  (I.prototype.forEach = function (o, i) {
                    var m;
                    for (m = 0; m < this.size; m++)
                      o.call(
                        i || this,
                        this.list[m].val,
                        this.list[m].key,
                        this,
                      );
                  }),
                  (I.prototype.indexOf = function (o) {
                    var i;
                    for (i = 0; i < this.size; i++)
                      if (this.isEqual(this.list[i].key, o)) return i;
                    return -1;
                  }),
                  (I.prototype.isEqual = function (o, i) {
                    return o === i || (o !== o && i !== i);
                  }),
                  (a.exports = I));
              },
              {},
            ],
            3: [
              function (s, a, y) {
                var I = s("map-or-similar");
                a.exports = function (n) {
                  var p = new I(!1),
                    r = [];
                  return function (u) {
                    var d = function () {
                      var h = p,
                        w,
                        T,
                        S = arguments.length - 1,
                        M = Array(S + 1),
                        R = !0,
                        _;
                      if ((d.numArgs || d.numArgs === 0) && d.numArgs !== S + 1)
                        throw new Error(
                          "Memoizerific functions should always be called with the same number of arguments",
                        );
                      for (_ = 0; _ < S; _++) {
                        if (
                          ((M[_] = { cacheItem: h, arg: arguments[_] }),
                          h.has(arguments[_]))
                        ) {
                          h = h.get(arguments[_]);
                          continue;
                        }
                        ((R = !1),
                          (w = new I(!1)),
                          h.set(arguments[_], w),
                          (h = w));
                      }
                      return (
                        R &&
                          (h.has(arguments[S])
                            ? (T = h.get(arguments[S]))
                            : (R = !1)),
                        R ||
                          ((T = u.apply(null, arguments)),
                          h.set(arguments[S], T)),
                        n > 0 &&
                          ((M[S] = { cacheItem: h, arg: arguments[S] }),
                          R ? o(r, M) : r.push(M),
                          r.length > n && i(r.shift())),
                        (d.wasMemoized = R),
                        (d.numArgs = S + 1),
                        T
                      );
                    };
                    return (
                      (d.limit = n),
                      (d.wasMemoized = !1),
                      (d.cache = p),
                      (d.lru = r),
                      d
                    );
                  };
                };
                function o(n, p) {
                  var r = n.length,
                    u = p.length,
                    d,
                    h,
                    w;
                  for (h = 0; h < r; h++) {
                    for (d = !0, w = 0; w < u; w++)
                      if (!m(n[h][w].arg, p[w].arg)) {
                        d = !1;
                        break;
                      }
                    if (d) break;
                  }
                  n.push(n.splice(h, 1)[0]);
                }
                function i(n) {
                  var p = n.length,
                    r = n[p - 1],
                    u,
                    d;
                  for (
                    r.cacheItem.delete(r.arg), d = p - 2;
                    d >= 0 &&
                    ((r = n[d]), (u = r.cacheItem.get(r.arg)), !u || !u.size);
                    d--
                  )
                    r.cacheItem.delete(r.arg);
                }
                function m(n, p) {
                  return n === p || (n !== n && p !== p);
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
    f();
    g();
    b();
    f();
    g();
    b();
    f();
    g();
    b();
    f();
    g();
    b();
    var l = __REACT__,
      {
        Children: $e,
        Component: Je,
        Fragment: V,
        Profiler: Qe,
        PureComponent: Xe,
        StrictMode: et,
        Suspense: tt,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ot,
        cloneElement: nt,
        createContext: rt,
        createElement: N,
        createFactory: it,
        createRef: ct,
        forwardRef: at,
        isValidElement: lt,
        lazy: st,
        memo: Q,
        startTransition: ut,
        unstable_act: dt,
        useCallback: X,
        useContext: It,
        useDebugValue: pt,
        useDeferredValue: mt,
        useEffect: O,
        useId: ht,
        useImperativeHandle: ft,
        useInsertionEffect: gt,
        useLayoutEffect: bt,
        useMemo: yt,
        useReducer: wt,
        useRef: ee,
        useState: z,
        useSyncExternalStore: St,
        useTransition: vt,
        version: _t,
      } = __REACT__;
    f();
    g();
    b();
    var Tt = __STORYBOOK_API__,
      {
        ActiveTabs: Rt,
        Consumer: At,
        ManagerContext: xt,
        Provider: Ot,
        RequestResponseError: Lt,
        addons: H,
        combineParameters: Bt,
        controlOrMetaKey: Pt,
        controlOrMetaSymbol: Mt,
        eventMatchesShortcut: Vt,
        eventToShortcut: Dt,
        experimental_MockUniversalStore: Ut,
        experimental_UniversalStore: Nt,
        experimental_requestResponse: zt,
        experimental_useUniversalStore: Ht,
        isMacLike: Gt,
        isShortcutTaken: Ft,
        keyToSymbol: qt,
        merge: Wt,
        mockChannel: Yt,
        optionOrAltSymbol: jt,
        shortcutMatchesShortcut: Kt,
        shortcutToHumanString: Zt,
        types: te,
        useAddonState: $t,
        useArgTypes: Jt,
        useArgs: Qt,
        useChannel: Xt,
        useGlobalTypes: eo,
        useGlobals: G,
        useParameter: F,
        useSharedState: to,
        useStoryPrepared: oo,
        useStorybookApi: oe,
        useStorybookState: no,
      } = __STORYBOOK_API__;
    f();
    g();
    b();
    var lo = __STORYBOOK_COMPONENTS__,
      {
        A: so,
        ActionBar: uo,
        AddonPanel: Io,
        Badge: po,
        Bar: mo,
        Blockquote: ho,
        Button: fo,
        ClipboardCode: go,
        Code: bo,
        DL: yo,
        Div: wo,
        DocumentWrapper: So,
        EmptyTabContent: vo,
        ErrorFormatter: _o,
        FlexBar: ko,
        Form: Co,
        H1: Eo,
        H2: To,
        H3: Ro,
        H4: Ao,
        H5: xo,
        H6: Oo,
        HR: Lo,
        IconButton: L,
        IconButtonSkeleton: Bo,
        Icons: Po,
        Img: Mo,
        LI: Vo,
        Link: Do,
        ListItem: Uo,
        Loader: No,
        Modal: zo,
        OL: Ho,
        P: Go,
        Placeholder: Fo,
        Pre: qo,
        ProgressSpinner: Wo,
        ResetWrapper: Yo,
        ScrollArea: jo,
        Separator: Ko,
        Spaced: Zo,
        Span: $o,
        StorybookIcon: Jo,
        StorybookLogo: Qo,
        Symbols: Xo,
        SyntaxHighlighter: en,
        TT: tn,
        TabBar: on,
        TabButton: nn,
        TabWrapper: rn,
        Table: cn,
        Tabs: an,
        TabsState: ln,
        TooltipLinkList: q,
        TooltipMessage: sn,
        TooltipNote: un,
        UL: dn,
        WithTooltip: W,
        WithTooltipPure: In,
        Zoom: pn,
        codeCommon: mn,
        components: hn,
        createCopyToClipboardFunction: fn,
        getStoryHref: gn,
        icons: bn,
        interleaveSeparators: yn,
        nameSpaceClassNames: wn,
        resetComponents: Sn,
        withReset: vn,
      } = __STORYBOOK_COMPONENTS__;
    f();
    g();
    b();
    var Tn = __STORYBOOK_THEMING__,
      {
        CacheProvider: Rn,
        ClassNames: An,
        Global: Y,
        ThemeProvider: xn,
        background: On,
        color: Ln,
        convert: Bn,
        create: Pn,
        createCache: Mn,
        createGlobal: Vn,
        createReset: Dn,
        css: Un,
        darken: Nn,
        ensure: zn,
        ignoreSsrWarning: Hn,
        isPropValid: Gn,
        jsx: Fn,
        keyframes: qn,
        lighten: Wn,
        styled: v,
        themes: Yn,
        typography: jn,
        useTheme: Kn,
        withTheme: Zn,
      } = __STORYBOOK_THEMING__;
    f();
    g();
    b();
    var er = __STORYBOOK_ICONS__,
      {
        AccessibilityAltIcon: tr,
        AccessibilityIcon: or,
        AccessibilityIgnoredIcon: nr,
        AddIcon: rr,
        AdminIcon: ir,
        AlertAltIcon: cr,
        AlertIcon: ar,
        AlignLeftIcon: lr,
        AlignRightIcon: sr,
        AppleIcon: ur,
        ArrowBottomLeftIcon: dr,
        ArrowBottomRightIcon: Ir,
        ArrowDownIcon: pr,
        ArrowLeftIcon: mr,
        ArrowRightIcon: hr,
        ArrowSolidDownIcon: fr,
        ArrowSolidLeftIcon: gr,
        ArrowSolidRightIcon: br,
        ArrowSolidUpIcon: yr,
        ArrowTopLeftIcon: wr,
        ArrowTopRightIcon: Sr,
        ArrowUpIcon: vr,
        AzureDevOpsIcon: _r,
        BackIcon: kr,
        BasketIcon: Cr,
        BatchAcceptIcon: Er,
        BatchDenyIcon: Tr,
        BeakerIcon: Rr,
        BellIcon: Ar,
        BitbucketIcon: xr,
        BoldIcon: Or,
        BookIcon: Lr,
        BookmarkHollowIcon: Br,
        BookmarkIcon: Pr,
        BottomBarIcon: Mr,
        BottomBarToggleIcon: Vr,
        BoxIcon: Dr,
        BranchIcon: Ur,
        BrowserIcon: ne,
        ButtonIcon: Nr,
        CPUIcon: zr,
        CalendarIcon: Hr,
        CameraIcon: Gr,
        CameraStabilizeIcon: Fr,
        CategoryIcon: qr,
        CertificateIcon: Wr,
        ChangedIcon: Yr,
        ChatIcon: jr,
        CheckIcon: Kr,
        ChevronDownIcon: Zr,
        ChevronLeftIcon: $r,
        ChevronRightIcon: Jr,
        ChevronSmallDownIcon: Qr,
        ChevronSmallLeftIcon: Xr,
        ChevronSmallRightIcon: ei,
        ChevronSmallUpIcon: ti,
        ChevronUpIcon: oi,
        ChromaticIcon: ni,
        ChromeIcon: ri,
        CircleHollowIcon: ii,
        CircleIcon: ci,
        ClearIcon: ai,
        CloseAltIcon: li,
        CloseIcon: si,
        CloudHollowIcon: ui,
        CloudIcon: di,
        CogIcon: Ii,
        CollapseIcon: pi,
        CommandIcon: mi,
        CommentAddIcon: hi,
        CommentIcon: fi,
        CommentsIcon: gi,
        CommitIcon: bi,
        CompassIcon: yi,
        ComponentDrivenIcon: wi,
        ComponentIcon: Si,
        ContrastIcon: vi,
        ContrastIgnoredIcon: _i,
        ControlsIcon: ki,
        CopyIcon: Ci,
        CreditIcon: Ei,
        CrossIcon: Ti,
        DashboardIcon: Ri,
        DatabaseIcon: Ai,
        DeleteIcon: xi,
        DiamondIcon: Oi,
        DirectionIcon: Li,
        DiscordIcon: Bi,
        DocChartIcon: Pi,
        DocListIcon: Mi,
        DocumentIcon: Vi,
        DownloadIcon: Di,
        DragIcon: Ui,
        EditIcon: Ni,
        EllipsisIcon: zi,
        EmailIcon: Hi,
        ExpandAltIcon: Gi,
        ExpandIcon: Fi,
        EyeCloseIcon: qi,
        EyeIcon: Wi,
        FaceHappyIcon: Yi,
        FaceNeutralIcon: ji,
        FaceSadIcon: Ki,
        FacebookIcon: Zi,
        FailedIcon: $i,
        FastForwardIcon: Ji,
        FigmaIcon: Qi,
        FilterIcon: Xi,
        FlagIcon: ec,
        FolderIcon: tc,
        FormIcon: oc,
        GDriveIcon: nc,
        GithubIcon: rc,
        GitlabIcon: ic,
        GlobeIcon: cc,
        GoogleIcon: ac,
        GraphBarIcon: lc,
        GraphLineIcon: sc,
        GraphqlIcon: uc,
        GridAltIcon: dc,
        GridIcon: Ic,
        GrowIcon: j,
        HeartHollowIcon: pc,
        HeartIcon: mc,
        HomeIcon: hc,
        HourglassIcon: fc,
        InfoIcon: gc,
        ItalicIcon: bc,
        JumpToIcon: yc,
        KeyIcon: wc,
        LightningIcon: Sc,
        LightningOffIcon: vc,
        LinkBrokenIcon: _c,
        LinkIcon: kc,
        LinkedinIcon: Cc,
        LinuxIcon: Ec,
        ListOrderedIcon: Tc,
        ListUnorderedIcon: Rc,
        LocationIcon: Ac,
        LockIcon: xc,
        MarkdownIcon: Oc,
        MarkupIcon: Lc,
        MediumIcon: Bc,
        MemoryIcon: Pc,
        MenuIcon: Mc,
        MergeIcon: Vc,
        MirrorIcon: Dc,
        MobileIcon: re,
        MoonIcon: Uc,
        NutIcon: Nc,
        OutboxIcon: zc,
        OutlineIcon: Hc,
        PaintBrushIcon: Gc,
        PaperClipIcon: Fc,
        ParagraphIcon: qc,
        PassedIcon: Wc,
        PhoneIcon: Yc,
        PhotoDragIcon: jc,
        PhotoIcon: Kc,
        PhotoStabilizeIcon: Zc,
        PinAltIcon: $c,
        PinIcon: Jc,
        PlayAllHollowIcon: Qc,
        PlayBackIcon: Xc,
        PlayHollowIcon: ea,
        PlayIcon: ta,
        PlayNextIcon: oa,
        PlusIcon: na,
        PointerDefaultIcon: ra,
        PointerHandIcon: ia,
        PowerIcon: ca,
        PrintIcon: aa,
        ProceedIcon: la,
        ProfileIcon: sa,
        PullRequestIcon: ua,
        QuestionIcon: da,
        RSSIcon: Ia,
        RedirectIcon: pa,
        ReduxIcon: ma,
        RefreshIcon: ie,
        ReplyIcon: ha,
        RepoIcon: fa,
        RequestChangeIcon: ga,
        RewindIcon: ba,
        RulerIcon: ya,
        SaveIcon: wa,
        SearchIcon: Sa,
        ShareAltIcon: va,
        ShareIcon: _a,
        ShieldIcon: ka,
        SideBySideIcon: Ca,
        SidebarAltIcon: Ea,
        SidebarAltToggleIcon: Ta,
        SidebarIcon: Ra,
        SidebarToggleIcon: Aa,
        SpeakerIcon: xa,
        StackedIcon: Oa,
        StarHollowIcon: La,
        StarIcon: Ba,
        StatusFailIcon: Pa,
        StatusIcon: Ma,
        StatusPassIcon: Va,
        StatusWarnIcon: Da,
        StickerIcon: Ua,
        StopAltHollowIcon: Na,
        StopAltIcon: za,
        StopIcon: Ha,
        StorybookIcon: Ga,
        StructureIcon: Fa,
        SubtractIcon: qa,
        SunIcon: Wa,
        SupportIcon: Ya,
        SweepIcon: ja,
        SwitchAltIcon: Ka,
        SyncIcon: Za,
        TabletIcon: ce,
        ThumbsUpIcon: $a,
        TimeIcon: Ja,
        TimerIcon: Qa,
        TransferIcon: K,
        TrashIcon: Xa,
        TwitterIcon: el,
        TypeIcon: tl,
        UbuntuIcon: ol,
        UndoIcon: nl,
        UnfoldIcon: rl,
        UnlockIcon: il,
        UnpinIcon: cl,
        UploadIcon: al,
        UserAddIcon: ll,
        UserAltIcon: sl,
        UserIcon: ul,
        UsersIcon: dl,
        VSCodeIcon: Il,
        VerifiedIcon: pl,
        VideoIcon: ml,
        WandIcon: hl,
        WatchIcon: fl,
        WindowsIcon: gl,
        WrenchIcon: bl,
        XIcon: yl,
        YoutubeIcon: wl,
        ZoomIcon: Sl,
        ZoomOutIcon: vl,
        ZoomResetIcon: _l,
        iconList: kl,
      } = __STORYBOOK_ICONS__;
    var $ = Se(le()),
      B = "storybook/viewport",
      A = "viewport",
      de = {
        mobile1: {
          name: "Small mobile",
          styles: { height: "568px", width: "320px" },
          type: "mobile",
        },
        mobile2: {
          name: "Large mobile",
          styles: { height: "896px", width: "414px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet",
          styles: { height: "1112px", width: "834px" },
          type: "tablet",
        },
      },
      P = {
        name: "Reset viewport",
        styles: { height: "100%", width: "100%" },
        type: "desktop",
      },
      _e = { [A]: { value: void 0, isRotated: !1 } },
      ke = { viewport: "reset", viewportRotated: !1 },
      Ce = globalThis.FEATURES?.viewportStoryGlobals ? _e : ke,
      Ie = (e, t) => e.indexOf(t),
      Ee = (e, t) => {
        let c = Ie(e, t);
        return c === e.length - 1 ? e[0] : e[c + 1];
      },
      Te = (e, t) => {
        let c = Ie(e, t);
        return c < 1 ? e[e.length - 1] : e[c - 1];
      },
      pe = async (e, t, c, s) => {
        (await e.setAddonShortcut(B, {
          label: "Previous viewport",
          defaultShortcut: ["alt", "shift", "V"],
          actionName: "previous",
          action: () => {
            c({ viewport: Te(s, t) });
          },
        }),
          await e.setAddonShortcut(B, {
            label: "Next viewport",
            defaultShortcut: ["alt", "V"],
            actionName: "next",
            action: () => {
              c({ viewport: Ee(s, t) });
            },
          }),
          await e.setAddonShortcut(B, {
            label: "Reset viewport",
            defaultShortcut: ["alt", "control", "V"],
            actionName: "reset",
            action: () => {
              c(Ce);
            },
          }));
      },
      Re = v.div({ display: "inline-flex", alignItems: "center" }),
      se = v.div(({ theme: e }) => ({
        display: "inline-block",
        textDecoration: "none",
        padding: 10,
        fontWeight: e.typography.weight.bold,
        fontSize: e.typography.size.s2 - 1,
        lineHeight: "1",
        height: 40,
        border: "none",
        borderTop: "3px solid transparent",
        borderBottom: "3px solid transparent",
        background: "transparent",
      })),
      Ae = v(L)(() => ({ display: "inline-flex", alignItems: "center" })),
      xe = v.div(({ theme: e }) => ({
        fontSize: e.typography.size.s2 - 1,
        marginLeft: 10,
      })),
      Oe = {
        desktop: l.createElement(ne, null),
        mobile: l.createElement(re, null),
        tablet: l.createElement(ce, null),
        other: l.createElement(V, null),
      },
      Le = ({ api: e }) => {
        let t = F(A),
          [c, s, a] = G(),
          [y, I] = z(!1),
          { options: o = de, disable: i } = t || {},
          m = c?.[A] || {},
          n = m.value,
          p = m.isRotated,
          r = o[n] || P,
          u = y || r !== P,
          d = A in a,
          h = Object.keys(o).length;
        if (
          (O(() => {
            pe(e, n, s, Object.keys(o));
          }, [o, n, s, e]),
          r.styles === null || !o || h < 1)
        )
          return null;
        if (typeof r.styles == "function")
          return (
            console.warn(
              "Addon Viewport no longer supports dynamic styles using a function, use css calc() instead",
            ),
            null
          );
        let w = p ? r.styles.height : r.styles.width,
          T = p ? r.styles.width : r.styles.height;
        return i
          ? null
          : l.createElement(Be, {
              item: r,
              updateGlobals: s,
              viewportMap: o,
              viewportName: n,
              isRotated: p,
              setIsTooltipVisible: I,
              isLocked: d,
              isActive: u,
              width: w,
              height: T,
            });
      },
      Be = l.memo(function (e) {
        let {
            item: t,
            viewportMap: c,
            viewportName: s,
            isRotated: a,
            updateGlobals: y,
            setIsTooltipVisible: I,
            isLocked: o,
            isActive: i,
            width: m,
            height: n,
          } = e,
          p = X((r) => y({ [A]: r }), [y]);
        return l.createElement(
          V,
          null,
          l.createElement(
            W,
            {
              placement: "bottom",
              tooltip: ({ onHide: r }) =>
                l.createElement(q, {
                  links: [
                    ...(length > 0 && t !== P
                      ? [
                          {
                            id: "reset",
                            title: "Reset viewport",
                            icon: l.createElement(ie, null),
                            onClick: () => {
                              (p({ value: void 0, isRotated: !1 }), r());
                            },
                          },
                        ]
                      : []),
                    ...Object.entries(c).map(([u, d]) => ({
                      id: u,
                      title: d.name,
                      icon: Oe[d.type],
                      active: u === s,
                      onClick: () => {
                        (p({ value: u, isRotated: !1 }), r());
                      },
                    })),
                  ].flat(),
                }),
              closeOnOutsideClick: !0,
              onVisibleChange: I,
            },
            l.createElement(
              Ae,
              {
                disabled: o,
                key: "viewport",
                title: "Change the size of the preview",
                active: i,
                onDoubleClick: () => {
                  p({ value: void 0, isRotated: !1 });
                },
              },
              l.createElement(j, null),
              t !== P
                ? l.createElement(xe, null, t.name, " ", a ? "(L)" : "(P)")
                : null,
            ),
          ),
          l.createElement(Y, {
            styles: {
              'iframe[data-is-storybook="true"]': { width: m, height: n },
            },
          }),
          t !== P
            ? l.createElement(
                Re,
                null,
                l.createElement(
                  se,
                  { title: "Viewport width" },
                  m.replace("px", ""),
                ),
                o
                  ? "/"
                  : l.createElement(
                      L,
                      {
                        key: "viewport-rotate",
                        title: "Rotate viewport",
                        onClick: () => {
                          p({ value: s, isRotated: !a });
                        },
                      },
                      l.createElement(K, null),
                    ),
                l.createElement(
                  se,
                  { title: "Viewport height" },
                  n.replace("px", ""),
                ),
              )
            : null,
        );
      }),
      Pe = (0, $.default)(50)((e) => [
        ...Me,
        ...Object.entries(e).map(([t, { name: c, ...s }]) => ({
          ...s,
          id: t,
          title: c,
        })),
      ]),
      D = { id: "reset", title: "Reset viewport", styles: null, type: "other" },
      Me = [D],
      Ve = (0, $.default)(50)((e, t, c, s) =>
        e
          .filter((a) => a.id !== D.id || t.id !== a.id)
          .map((a) => ({
            ...a,
            onClick: () => {
              (c({ viewport: a.id }), s());
            },
          })),
      ),
      De = ({ width: e, height: t, ...c }) => ({ ...c, height: e, width: t }),
      Ue = v.div({ display: "inline-flex", alignItems: "center" }),
      ue = v.div(({ theme: e }) => ({
        display: "inline-block",
        textDecoration: "none",
        padding: 10,
        fontWeight: e.typography.weight.bold,
        fontSize: e.typography.size.s2 - 1,
        lineHeight: "1",
        height: 40,
        border: "none",
        borderTop: "3px solid transparent",
        borderBottom: "3px solid transparent",
        background: "transparent",
      })),
      Ne = v(L)(() => ({ display: "inline-flex", alignItems: "center" })),
      ze = v.div(({ theme: e }) => ({
        fontSize: e.typography.size.s2 - 1,
        marginLeft: 10,
      })),
      He = (e, t, c) => {
        if (t === null) return;
        let s = typeof t == "function" ? t(e) : t;
        return c ? De(s) : s;
      },
      Ge = Q(function () {
        let [e, t] = G(),
          {
            viewports: c = de,
            defaultOrientation: s,
            defaultViewport: a,
            disable: y,
          } = F(A, {}),
          I = Pe(c),
          o = oe(),
          [i, m] = z(!1);
        (a &&
          !I.find((u) => u.id === a) &&
          console.warn(
            `Cannot find "defaultViewport" of "${a}" in addon-viewport configs, please check the "viewports" setting in the configuration.`,
          ),
          O(() => {
            pe(o, e, t, Object.keys(c));
          }, [c, e, e.viewport, t, o]),
          O(() => {
            let u = s === "landscape";
            ((a && e.viewport !== a) || (s && e.viewportRotated !== u)) &&
              t({ viewport: a, viewportRotated: u });
          }, [s, a, t]));
        let n =
            I.find((u) => u.id === e.viewport) ||
            I.find((u) => u.id === a) ||
            I.find((u) => u.default) ||
            D,
          p = ee(),
          r = He(p.current, n.styles, e.viewportRotated);
        return (
          O(() => {
            p.current = r;
          }, [n]),
          y || Object.entries(c).length === 0
            ? null
            : l.createElement(
                V,
                null,
                l.createElement(
                  W,
                  {
                    placement: "top",
                    tooltip: ({ onHide: u }) =>
                      l.createElement(q, { links: Ve(I, n, t, u) }),
                    closeOnOutsideClick: !0,
                    onVisibleChange: m,
                  },
                  l.createElement(
                    Ne,
                    {
                      key: "viewport",
                      title: "Change the size of the preview",
                      active: i || !!r,
                      onDoubleClick: () => {
                        t({ viewport: D.id });
                      },
                    },
                    l.createElement(j, null),
                    r
                      ? l.createElement(
                          ze,
                          null,
                          e.viewportRotated
                            ? `${n.title} (L)`
                            : `${n.title} (P)`,
                        )
                      : null,
                  ),
                ),
                r
                  ? l.createElement(
                      Ue,
                      null,
                      l.createElement(Y, {
                        styles: {
                          'iframe[data-is-storybook="true"]': {
                            ...(r || { width: "100%", height: "100%" }),
                          },
                        },
                      }),
                      l.createElement(
                        ue,
                        { title: "Viewport width" },
                        r.width.replace("px", ""),
                      ),
                      l.createElement(
                        L,
                        {
                          key: "viewport-rotate",
                          title: "Rotate viewport",
                          onClick: () => {
                            t({ viewportRotated: !e.viewportRotated });
                          },
                        },
                        l.createElement(K, null),
                      ),
                      l.createElement(
                        ue,
                        { title: "Viewport height" },
                        r.height.replace("px", ""),
                      ),
                    )
                  : null,
              )
        );
      });
    H.register(B, (e) => {
      H.add(B, {
        title: "viewport / media-queries",
        type: te.TOOL,
        match: ({ viewMode: t, tabId: c }) => t === "story" && !c,
        render: () =>
          FEATURES?.viewportStoryGlobals ? N(Le, { api: e }) : N(Ge, null),
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
