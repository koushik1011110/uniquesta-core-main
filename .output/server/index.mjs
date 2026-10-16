globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs").then((n) => n.n)) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"bb58-4MaoPytB3Dz6wiUhXvsyypZAqFo\"",
		"mtime": "2026-09-30T19:31:05.618Z",
		"size": 47960,
		"path": "../public/apple-touch-icon.png"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"2116f-l+OblTm9H6YDywXdOzxT9rRfs+0\"",
		"mtime": "2026-09-30T19:31:05.539Z",
		"size": 135535,
		"path": "../public/favicon.ico"
	},
	"/assets/arrow-right-CUAu8E-t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-TsA8jnM1ia11JKHX7hYZ1VjAq8o\"",
		"mtime": "2026-10-10T18:23:25.653Z",
		"size": 155,
		"path": "../public/assets/arrow-right-CUAu8E-t.js"
	},
	"/794529169b8e4b6297951bf3951df399-removebg-preview.png": {
		"type": "image/png",
		"etag": "\"27df3-z+p/2lSKqN1ljWhTYty4pUoKfhU\"",
		"mtime": "2026-06-11T19:26:27.156Z",
		"size": 163315,
		"path": "../public/794529169b8e4b6297951bf3951df399-removebg-preview.png"
	},
	"/assets/bell-Y1RXg2hD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-vMCU/vp9cowuzQl9xp6nAK2wI0k\"",
		"mtime": "2026-10-10T18:23:25.653Z",
		"size": 280,
		"path": "../public/assets/bell-Y1RXg2hD.js"
	},
	"/assets/briefcase-DlOHG1nf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d2-K0FpXXWXeW59L+Klj/yOpY87elg\"",
		"mtime": "2026-10-10T18:23:25.654Z",
		"size": 210,
		"path": "../public/assets/briefcase-DlOHG1nf.js"
	},
	"/assets/bus-D0pAp1FN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ba-AKXxBrJI0kDxevrUzAmt2DQg2Ds\"",
		"mtime": "2026-10-10T18:23:25.654Z",
		"size": 442,
		"path": "../public/assets/bus-D0pAp1FN.js"
	},
	"/assets/button-1HA6Ct0l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"81e8-tjiVAoX9MQugFRlNvJdXRDPRbbg\"",
		"mtime": "2026-10-10T18:23:25.655Z",
		"size": 33256,
		"path": "../public/assets/button-1HA6Ct0l.js"
	},
	"/assets/calendar-DgGahvLJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-WMz+gsKnQ6YC/Y+R4UhZKsBDV10\"",
		"mtime": "2026-10-10T18:23:25.655Z",
		"size": 247,
		"path": "../public/assets/calendar-DgGahvLJ.js"
	},
	"/assets/car-KtJR4jl7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18d-w9ILeFU58C2a9gcLs5hHMOoxZtY\"",
		"mtime": "2026-10-10T18:23:25.655Z",
		"size": 397,
		"path": "../public/assets/car-KtJR4jl7.js"
	},
	"/assets/AreaChart-DeJKcb3G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b704-8qHsMgRJx+/8j5wFd5avBu52qbg\"",
		"mtime": "2026-10-10T18:23:25.643Z",
		"size": 374532,
		"path": "../public/assets/AreaChart-DeJKcb3G.js"
	},
	"/assets/chevron-right-8bcKGsBl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78-dh/jys3jw0bTarKcozWMyM18ass\"",
		"mtime": "2026-10-10T18:23:25.656Z",
		"size": 120,
		"path": "../public/assets/chevron-right-8bcKGsBl.js"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"abe-j4bll3nkpNQNw7aSzg7GuevejlE\"",
		"mtime": "2026-09-30T19:31:05.574Z",
		"size": 2750,
		"path": "../public/favicon.png"
	},
	"/assets/compass-CC8V92jc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-8Pgz7uyrt2TEqq5bQAQX4UqmQ/w\"",
		"mtime": "2026-10-10T18:23:25.656Z",
		"size": 241,
		"path": "../public/assets/compass-CC8V92jc.js"
	},
	"/assets/crown-CcZ1u822.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"160-zoSM+IZD0IC4WV2IoR3z+yj5H0c\"",
		"mtime": "2026-10-10T18:23:25.657Z",
		"size": 352,
		"path": "../public/assets/crown-CcZ1u822.js"
	},
	"/assets/dist-C4wjnams.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11de-fg7AnSUiOAxpEELXMUC8jcSMaec\"",
		"mtime": "2026-10-10T18:23:25.657Z",
		"size": 4574,
		"path": "../public/assets/dist-C4wjnams.js"
	},
	"/assets/dist-Dpkx9-IG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"105d-+p90f3ZdZOP1tyZ/4bLxVPfMZJg\"",
		"mtime": "2026-10-10T18:23:25.660Z",
		"size": 4189,
		"path": "../public/assets/dist-Dpkx9-IG.js"
	},
	"/assets/dist-DghC5QsU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb95-l9I9X5pEYFgzZ+fYTYQnULJ9TDI\"",
		"mtime": "2026-10-10T18:23:25.660Z",
		"size": 64405,
		"path": "../public/assets/dist-DghC5QsU.js"
	},
	"/assets/driver-login-BB93I5Ww.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26cc-kpvRAsrkAC27UoSbO9zBgqijqRY\"",
		"mtime": "2026-10-10T18:23:25.662Z",
		"size": 9932,
		"path": "../public/assets/driver-login-BB93I5Ww.js"
	},
	"/assets/dollar-sign-CgGp7rAj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d1-dYeC45uDVxhj43LRkZePz2ULwog\"",
		"mtime": "2026-10-10T18:23:25.661Z",
		"size": 209,
		"path": "../public/assets/dollar-sign-CgGp7rAj.js"
	},
	"/assets/earth-DYHaLCIR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17f-OlOLiSu1KgM1gnjVYIybMJEL/gg\"",
		"mtime": "2026-10-10T18:23:25.662Z",
		"size": 383,
		"path": "../public/assets/earth-DYHaLCIR.js"
	},
	"/assets/driver-portal-DotEx9nI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5288-7DXI4c4JbcY30bUwEnCL/ANhUZY\"",
		"mtime": "2026-10-10T18:23:25.662Z",
		"size": 21128,
		"path": "../public/assets/driver-portal-DotEx9nI.js"
	},
	"/assets/external-link-I19t2kkv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-jDdQPMwCyGnjcKUZFtY8OyKDbek\"",
		"mtime": "2026-10-10T18:23:25.662Z",
		"size": 241,
		"path": "../public/assets/external-link-I19t2kkv.js"
	},
	"/assets/eye-off-17B9s2fU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a4-OxRbLmn0QJ51SyS1zxfd7o66lIY\"",
		"mtime": "2026-10-10T18:23:25.662Z",
		"size": 420,
		"path": "../public/assets/eye-off-17B9s2fU.js"
	},
	"/assets/file-check-Bnkh2-FO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-J5wjDuYqv7ytLl0j3/RcfQOOc2Q\"",
		"mtime": "2026-10-10T18:23:25.664Z",
		"size": 308,
		"path": "../public/assets/file-check-Bnkh2-FO.js"
	},
	"/assets/globe-Bfn99LTu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-cs9f0Xxx4t2/Fz25s3ssvkD/kp8\"",
		"mtime": "2026-10-10T18:23:25.664Z",
		"size": 232,
		"path": "../public/assets/globe-Bfn99LTu.js"
	},
	"/assets/funnel-B3CtMCuV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-k7rJWsv8+uxHRd4u64k22YnaYzs\"",
		"mtime": "2026-10-10T18:23:25.664Z",
		"size": 246,
		"path": "../public/assets/funnel-B3CtMCuV.js"
	},
	"/assets/graduation-cap-DKQ8s3lp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-f1jHOK6+bM6dBWPgeDAWuyAslRo\"",
		"mtime": "2026-10-10T18:23:25.665Z",
		"size": 322,
		"path": "../public/assets/graduation-cap-DKQ8s3lp.js"
	},
	"/assets/input-CxuIkqSV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"546-qhg0I8negH3ZQooUHZ5uAvHIGso\"",
		"mtime": "2026-10-10T18:23:25.665Z",
		"size": 1350,
		"path": "../public/assets/input-CxuIkqSV.js"
	},
	"/assets/handshake-DU0NLvvd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b4-RW1CKzRxwYtUASTlIbzlSiTnae0\"",
		"mtime": "2026-10-10T18:23:25.665Z",
		"size": 436,
		"path": "../public/assets/handshake-DU0NLvvd.js"
	},
	"/assets/jsx-dev-runtime-kfSKQyiO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21d6-DSL4gk/8N3o6NnWdQtYR8ek++Cc\"",
		"mtime": "2026-10-10T18:23:25.666Z",
		"size": 8662,
		"path": "../public/assets/jsx-dev-runtime-kfSKQyiO.js"
	},
	"/assets/link-B6zWhamL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"558d-nKBHLDKcKREDTXoJ3LDNEl4NmxY\"",
		"mtime": "2026-10-10T18:23:25.666Z",
		"size": 21901,
		"path": "../public/assets/link-B6zWhamL.js"
	},
	"/assets/log-out-CmLPFs5j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-3/HhuRHDs81/8bqfN0td6z3tnnc\"",
		"mtime": "2026-10-10T18:23:25.672Z",
		"size": 220,
		"path": "../public/assets/log-out-CmLPFs5j.js"
	},
	"/assets/login-BI8gaDcx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b418-DrpzFaCzvD92TNW560m5padNK0Y\"",
		"mtime": "2026-10-10T18:23:25.673Z",
		"size": 46104,
		"path": "../public/assets/login-BI8gaDcx.js"
	},
	"/assets/mail-BFXiyaEP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb-Z3N8TmO0DjT25Wm6pwhzQiECFiw\"",
		"mtime": "2026-10-10T18:23:25.674Z",
		"size": 203,
		"path": "../public/assets/mail-BFXiyaEP.js"
	},
	"/assets/map-pin-FxVl8-gN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f9-IZ5OU9L/45D7LNvAwwJ3oAcYGNQ\"",
		"mtime": "2026-10-10T18:23:25.674Z",
		"size": 249,
		"path": "../public/assets/map-pin-FxVl8-gN.js"
	},
	"/assets/matchContext-cn09Nsmw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92-2xGYXhcJi+3msWkcq6gGnvibB7w\"",
		"mtime": "2026-10-10T18:23:25.674Z",
		"size": 146,
		"path": "../public/assets/matchContext-cn09Nsmw.js"
	},
	"/assets/office-login-4-TIMS0Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3cf3-3AG6DjQZVF74fX90MRHMJEoytfE\"",
		"mtime": "2026-10-10T18:23:25.675Z",
		"size": 15603,
		"path": "../public/assets/office-login-4-TIMS0Z.js"
	},
	"/assets/navigation-DXT7vp1s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-9mhFf7Wq6rzJNXHV6i+iov4SYds\"",
		"mtime": "2026-10-10T18:23:25.675Z",
		"size": 138,
		"path": "../public/assets/navigation-DXT7vp1s.js"
	},
	"/assets/pen-CqEV796_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e1-QuR4Q+iyEDsU5MC+yZZwPJm6AT8\"",
		"mtime": "2026-10-10T18:23:25.675Z",
		"size": 225,
		"path": "../public/assets/pen-CqEV796_.js"
	},
	"/assets/preload-helper-C9eXVxFp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1611-dwiepl7cIeXUjWe9yJNEJ4Ce6SU\"",
		"mtime": "2026-10-10T18:23:25.690Z",
		"size": 5649,
		"path": "../public/assets/preload-helper-C9eXVxFp.js"
	},
	"/assets/progress-CpSEWFhe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9c3-9c4QAaMf9KfdB9unFAk2JqHBQKw\"",
		"mtime": "2026-10-10T18:23:25.691Z",
		"size": 2499,
		"path": "../public/assets/progress-CpSEWFhe.js"
	},
	"/assets/react-dom-CVxnu76u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de2-Yy+Uc/zP5O8EPqO4SNCCPRnC9Sc\"",
		"mtime": "2026-10-10T18:23:25.692Z",
		"size": 3554,
		"path": "../public/assets/react-dom-CVxnu76u.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-10-10T18:23:25.692Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/rotate-ccw-i5x3k1AJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be-H6UQ3aDe6zPpaEcZ5YVf5V/xIWE\"",
		"mtime": "2026-10-10T18:23:25.692Z",
		"size": 190,
		"path": "../public/assets/rotate-ccw-i5x3k1AJ.js"
	},
	"/assets/index-B6OgTbrC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83abb-locHJHb0jx1N2shhOzQT7haKlM0\"",
		"mtime": "2026-10-10T18:23:25.643Z",
		"size": 539323,
		"path": "../public/assets/index-B6OgTbrC.js"
	},
	"/assets/separator-8BC5SQaV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"436-oM76OOgFKB0e+lYv/La3M+j5hJo\"",
		"mtime": "2026-10-10T18:23:25.770Z",
		"size": 1078,
		"path": "../public/assets/separator-8BC5SQaV.js"
	},
	"/Gemini_Generated_Image_39ayty39ayty39ay.png": {
		"type": "image/png",
		"etag": "\"2084f3-lbrHneGMnT3u26UWV+NHwiFveI8\"",
		"mtime": "2026-08-03T09:17:07.962Z",
		"size": 2131187,
		"path": "../public/Gemini_Generated_Image_39ayty39ayty39ay.png"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"2084f3-lbrHneGMnT3u26UWV+NHwiFveI8\"",
		"mtime": "2026-08-03T09:17:07.962Z",
		"size": 2131187,
		"path": "../public/logo.png"
	},
	"/assets/sliders-vertical-DfXconH2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cd-S26/ZtxD4vbx2lv202XKc7DbBoE\"",
		"mtime": "2026-10-10T18:23:25.771Z",
		"size": 717,
		"path": "../public/assets/sliders-vertical-DfXconH2.js"
	},
	"/assets/staff-login-BCuK_VSZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4007-F8Qt8mqx1MykKVZkcar2UAzlnwc\"",
		"mtime": "2026-10-10T18:23:25.771Z",
		"size": 16391,
		"path": "../public/assets/staff-login-BCuK_VSZ.js"
	},
	"/assets/star-D5ogJa3e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ce-sKU4AT2SRG9y62Y78IEz+eMMbnE\"",
		"mtime": "2026-10-10T18:23:25.775Z",
		"size": 462,
		"path": "../public/assets/star-D5ogJa3e.js"
	},
	"/assets/super-admin-login-D2NibMaJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3816-dvigT1EWqdTkACTxUg917nq3AJ0\"",
		"mtime": "2026-10-10T18:23:25.776Z",
		"size": 14358,
		"path": "../public/assets/super-admin-login-D2NibMaJ.js"
	},
	"/assets/ticket-37gQlibq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137-+a/xTapDZibB6OSm5aV1H/FYVJA\"",
		"mtime": "2026-10-10T18:23:25.776Z",
		"size": 311,
		"path": "../public/assets/ticket-37gQlibq.js"
	},
	"/assets/styles-BIYxbcDX.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"2b6d8-LdbtLnp+9Y9a3/x1dNp2CGI8GFM\"",
		"mtime": "2026-10-10T18:23:25.833Z",
		"size": 177880,
		"path": "../public/assets/styles-BIYxbcDX.css"
	},
	"/assets/traveler-login-Bk5-TWVJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bdc-HXSQbEDDp2DM0ttVcFZhx9Dehhw\"",
		"mtime": "2026-10-10T18:23:25.777Z",
		"size": 11228,
		"path": "../public/assets/traveler-login-Bk5-TWVJ.js"
	},
	"/assets/traveler-portal-zuNxkpZy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e34-d0FTkZ3jGbs6+K0mW5jnzzROo8w\"",
		"mtime": "2026-10-10T18:23:25.777Z",
		"size": 20020,
		"path": "../public/assets/traveler-portal-zuNxkpZy.js"
	},
	"/assets/upload-BvT9QhmK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-9xJj1pWFRFGR3pCeYigezhREvI8\"",
		"mtime": "2026-10-10T18:23:25.778Z",
		"size": 220,
		"path": "../public/assets/upload-BvT9QhmK.js"
	},
	"/assets/trending-up-CyMtvt4U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-DYfZIZVevjeOfXaiJiD053S8sCA\"",
		"mtime": "2026-10-10T18:23:25.777Z",
		"size": 165,
		"path": "../public/assets/trending-up-CyMtvt4U.js"
	},
	"/assets/useMatch-C2eQNat2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-MDiJtZZMUqJX98jxAOLCDK/AYoA\"",
		"mtime": "2026-10-10T18:23:25.803Z",
		"size": 716,
		"path": "../public/assets/useMatch-C2eQNat2.js"
	},
	"/assets/useNavigate-wHkA_65k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-wQpKcJG6hs9SCkNZ5S4R6KRqTTg\"",
		"mtime": "2026-10-10T18:23:25.805Z",
		"size": 232,
		"path": "../public/assets/useNavigate-wHkA_65k.js"
	},
	"/assets/useQuery-CH1ISURJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58cb-PSs9VCCc0wZaj3EEJ6Bav31+jjY\"",
		"mtime": "2026-10-10T18:23:25.806Z",
		"size": 22731,
		"path": "../public/assets/useQuery-CH1ISURJ.js"
	},
	"/assets/user-plus-Ba9dCJdM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12c-DYurwThbZ3Gzb6oGlaBmyx/POCE\"",
		"mtime": "2026-10-10T18:23:25.833Z",
		"size": 300,
		"path": "../public/assets/user-plus-Ba9dCJdM.js"
	},
	"/assets/useStore-CHuo-_Fe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"829-Ojswwk7tUbH12wVUCOefIAllOOU\"",
		"mtime": "2026-10-10T18:23:25.833Z",
		"size": 2089,
		"path": "../public/assets/useStore-CHuo-_Fe.js"
	},
	"/assets/useRouter-BCE04MAu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-RlFxInpu/UvBSMdqclrG3kZg7R0\"",
		"mtime": "2026-10-10T18:23:25.806Z",
		"size": 155,
		"path": "../public/assets/useRouter-BCE04MAu.js"
	},
	"/assets/_app-mRLeVBnA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"179a5-sbaMm0V+4ovaXeNqANHCS03w8lU\"",
		"mtime": "2026-10-10T18:23:25.643Z",
		"size": 96677,
		"path": "../public/assets/_app-mRLeVBnA.js"
	},
	"/assets/_app.applications-DpBgmciE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ccf-o/0R7MmMyeQSuCha7takUVzAz8Y\"",
		"mtime": "2026-10-10T18:23:25.643Z",
		"size": 11471,
		"path": "../public/assets/_app.applications-DpBgmciE.js"
	},
	"/assets/_app.hr-C6jH_D7w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1283d-vNSgXZX2wa1DF7KaLquAYLMKxuQ\"",
		"mtime": "2026-10-10T18:23:25.645Z",
		"size": 75837,
		"path": "../public/assets/_app.hr-C6jH_D7w.js"
	},
	"/assets/_app.india-admissions-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-10-10T18:23:25.645Z",
		"size": 38,
		"path": "../public/assets/_app.india-admissions-DJ7LAi8J.js"
	},
	"/assets/_app.index-B_wjJvts.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7b70-W+HPs5PzNyruraFj+kB58W+RDN0\"",
		"mtime": "2026-10-10T18:23:25.645Z",
		"size": 31600,
		"path": "../public/assets/_app.index-B_wjJvts.js"
	},
	"/assets/_app.leads-C8P4D3u3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"881e-tEyGw2ZH3httPvB+UWNHA35swlg\"",
		"mtime": "2026-10-10T18:23:25.645Z",
		"size": 34846,
		"path": "../public/assets/_app.leads-C8P4D3u3.js"
	},
	"/assets/_app.partners-SHPqv2Va.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"178cd-m449OdZ8HqNAh4vPwCS794a8yfA\"",
		"mtime": "2026-10-10T18:23:25.647Z",
		"size": 96461,
		"path": "../public/assets/_app.partners-SHPqv2Va.js"
	},
	"/assets/_app.portal-DMM3eg6e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"113aa-jX2oS0JsQBiPalgQBnSuImh0uHs\"",
		"mtime": "2026-10-10T18:23:25.648Z",
		"size": 70570,
		"path": "../public/assets/_app.portal-DMM3eg6e.js"
	},
	"/assets/_app.reports-syXnpKkn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ec62-pUD28IK3epYKCfFMOMZfO94s94g\"",
		"mtime": "2026-10-10T18:23:25.648Z",
		"size": 126050,
		"path": "../public/assets/_app.reports-syXnpKkn.js"
	},
	"/assets/_app.settings-VTs9Ajdq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ff06-umtxTBrg8qnOnP2qPnai/nW9NH4\"",
		"mtime": "2026-10-10T18:23:25.648Z",
		"size": 65286,
		"path": "../public/assets/_app.settings-VTs9Ajdq.js"
	},
	"/assets/_app.students-BHqsGX8i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"131-M4gInNRpupXuYSVi/dM1pJ69ZWg\"",
		"mtime": "2026-10-10T18:23:25.650Z",
		"size": 305,
		"path": "../public/assets/_app.students-BHqsGX8i.js"
	},
	"/assets/_app.students.index-8lmQMV7I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5aa1-0pCGNeby9hkhJD0HlWBJLubtnJE\"",
		"mtime": "2026-10-10T18:23:25.651Z",
		"size": 23201,
		"path": "../public/assets/_app.students.index-8lmQMV7I.js"
	},
	"/assets/_app.students._studentId-BKpLb9X0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb8c-niDf3XiuSJtEBClWH+E2nc24vtQ\"",
		"mtime": "2026-10-10T18:23:25.650Z",
		"size": 64396,
		"path": "../public/assets/_app.students._studentId-BKpLb9X0.js"
	},
	"/assets/_app.travel-Bb_As5ek.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1559e-ngivOTCRmyl9kdsQVo+Jfz2Oanc\"",
		"mtime": "2026-10-10T18:23:25.651Z",
		"size": 87454,
		"path": "../public/assets/_app.travel-Bb_As5ek.js"
	},
	"/assets/_app.travel-destinations-7GaZxesu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38f2-ZUUq0lJSRmPahrH6bKoOgxsCmAU\"",
		"mtime": "2026-10-10T18:23:25.652Z",
		"size": 14578,
		"path": "../public/assets/_app.travel-destinations-7GaZxesu.js"
	},
	"/assets/_app.universities-BXEpEWei.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d3ca-QFG1i0E/3xbz4Lz9I+ZoHG8cI5w\"",
		"mtime": "2026-10-10T18:23:25.652Z",
		"size": 54218,
		"path": "../public/assets/_app.universities-BXEpEWei.js"
	},
	"/assets/_app.travel-services-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-10-10T18:23:25.652Z",
		"size": 38,
		"path": "../public/assets/_app.travel-services-DJ7LAi8J.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_CQ1pDl = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_CQ1pDl
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
