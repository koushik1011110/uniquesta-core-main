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
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"abe-j4bll3nkpNQNw7aSzg7GuevejlE\"",
		"mtime": "2026-09-30T19:31:05.574Z",
		"size": 2750,
		"path": "../public/favicon.png"
	},
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"bb58-4MaoPytB3Dz6wiUhXvsyypZAqFo\"",
		"mtime": "2026-09-30T19:31:05.618Z",
		"size": 47960,
		"path": "../public/apple-touch-icon.png"
	},
	"/assets/api-Bh4vHJT9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d7-I7YEjcQmMGtm19aM/jIX1u8C/0Y\"",
		"mtime": "2026-09-30T19:32:41.151Z",
		"size": 983,
		"path": "../public/assets/api-Bh4vHJT9.js"
	},
	"/assets/arrow-right-CllhpNNe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-7s9h1zBcumC2oJ79No0sG4ZhEcU\"",
		"mtime": "2026-09-30T19:32:41.200Z",
		"size": 165,
		"path": "../public/assets/arrow-right-CllhpNNe.js"
	},
	"/assets/arrow-up-right-Bdly-DVN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7-kbAIASwdW2S06nPmpVplI/DjwAs\"",
		"mtime": "2026-09-30T19:32:41.200Z",
		"size": 167,
		"path": "../public/assets/arrow-up-right-Bdly-DVN.js"
	},
	"/794529169b8e4b6297951bf3951df399-removebg-preview.png": {
		"type": "image/png",
		"etag": "\"27df3-z+p/2lSKqN1ljWhTYty4pUoKfhU\"",
		"mtime": "2026-06-11T19:26:27.156Z",
		"size": 163315,
		"path": "../public/794529169b8e4b6297951bf3951df399-removebg-preview.png"
	},
	"/assets/avatar-B6h_WkCN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c70-RiPjFhFlKy+6QCaLd31IvYRoCCY\"",
		"mtime": "2026-09-30T19:32:41.206Z",
		"size": 3184,
		"path": "../public/assets/avatar-B6h_WkCN.js"
	},
	"/assets/badge-BD0sfIps.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37d-QtQNC2YNO2IyMPPsZLU3YcXAmKo\"",
		"mtime": "2026-09-30T19:32:41.207Z",
		"size": 893,
		"path": "../public/assets/badge-BD0sfIps.js"
	},
	"/assets/auth-DXqDL0Pf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"361-2rZNkrF9gdKRXE8iDnmsHrIzqbg\"",
		"mtime": "2026-09-30T19:32:41.206Z",
		"size": 865,
		"path": "../public/assets/auth-DXqDL0Pf.js"
	},
	"/assets/briefcase-NjFpk80M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-5HGz0R+9Er+XTan0ErV3B8C5Vls\"",
		"mtime": "2026-09-30T19:32:41.222Z",
		"size": 220,
		"path": "../public/assets/briefcase-NjFpk80M.js"
	},
	"/assets/bell-w8GaIg65.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"122-f/kfE0X1T98C8t/RW4XHyFr7NFA\"",
		"mtime": "2026-09-30T19:32:41.207Z",
		"size": 290,
		"path": "../public/assets/bell-w8GaIg65.js"
	},
	"/assets/bus-BoXh2oi6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c4-u/0RGdX8n55HtSHXCRJ0u2O1J7U\"",
		"mtime": "2026-09-30T19:32:41.223Z",
		"size": 452,
		"path": "../public/assets/bus-BoXh2oi6.js"
	},
	"/assets/building-2-CK5oGJ4E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17f-4faTWXfoB2B4W6sZZr9koRyexns\"",
		"mtime": "2026-09-30T19:32:41.222Z",
		"size": 383,
		"path": "../public/assets/building-2-CK5oGJ4E.js"
	},
	"/assets/calendar-QgPzAV-x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-4gWSSfjDa0QIeXQYlvnp68JEvso\"",
		"mtime": "2026-09-30T19:32:41.231Z",
		"size": 257,
		"path": "../public/assets/calendar-QgPzAV-x.js"
	},
	"/assets/button-D152fyTB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d72-ArUEo66UC44iq3VDpu5t3MroNFw\"",
		"mtime": "2026-09-30T19:32:41.231Z",
		"size": 32114,
		"path": "../public/assets/button-D152fyTB.js"
	},
	"/assets/car-CuGZsuD8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"197-PbqtVSxW1LcdBEuM0GLvWCo5uNg\"",
		"mtime": "2026-09-30T19:32:41.232Z",
		"size": 407,
		"path": "../public/assets/car-CuGZsuD8.js"
	},
	"/assets/card-D3gsDvIS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5db-pOjxITyrg+2LXV+AsiMj38dcuJ8\"",
		"mtime": "2026-09-30T19:32:41.233Z",
		"size": 1499,
		"path": "../public/assets/card-D3gsDvIS.js"
	},
	"/assets/chart-column-CxsYpfpa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-J1Al89Ya7TqNIw/UtVV8q4AzbeA\"",
		"mtime": "2026-09-30T19:32:41.239Z",
		"size": 251,
		"path": "../public/assets/chart-column-CxsYpfpa.js"
	},
	"/assets/check-check-CSUWkzDJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b3-uMn6Jnk89DskdoM3lITTNMd/yU8\"",
		"mtime": "2026-09-30T19:32:41.240Z",
		"size": 179,
		"path": "../public/assets/check-check-CSUWkzDJ.js"
	},
	"/assets/chevron-right-DEXM19mm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-vNk27POhFSto5SAsQojyrMi85z0\"",
		"mtime": "2026-09-30T19:32:41.240Z",
		"size": 130,
		"path": "../public/assets/chevron-right-DEXM19mm.js"
	},
	"/assets/check-CzUhDTBi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-eQb3rhqFKw2f2r7+QWzww8ZSofU\"",
		"mtime": "2026-09-30T19:32:41.240Z",
		"size": 124,
		"path": "../public/assets/check-CzUhDTBi.js"
	},
	"/assets/circle-alert-0mNUTGyP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-ejOjlXhlGK6STIufwJABwDfW29Y\"",
		"mtime": "2026-09-30T19:32:41.242Z",
		"size": 250,
		"path": "../public/assets/circle-alert-0mNUTGyP.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"2116f-l+OblTm9H6YDywXdOzxT9rRfs+0\"",
		"mtime": "2026-09-30T19:31:05.539Z",
		"size": 135535,
		"path": "../public/favicon.ico"
	},
	"/assets/circle-check-BgcshY-i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-p1/XZmzaB1kMw2lyK2YB6gQhtDk\"",
		"mtime": "2026-09-30T19:32:41.242Z",
		"size": 178,
		"path": "../public/assets/circle-check-BgcshY-i.js"
	},
	"/assets/compass-Dmyj-276.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-E9VuOBUvCEyrhXolMsMqS2UVpS0\"",
		"mtime": "2026-09-30T19:32:41.243Z",
		"size": 251,
		"path": "../public/assets/compass-Dmyj-276.js"
	},
	"/assets/circle-question-mark-BQeivHQX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f8-vUYNU4L6UabQj9PBhVlbznTWTuU\"",
		"mtime": "2026-09-30T19:32:41.243Z",
		"size": 248,
		"path": "../public/assets/circle-question-mark-BQeivHQX.js"
	},
	"/assets/createLucideIcon-BbVlV1oH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4af-j3IDKCKIjXUV8cj/qFkE5TeG17k\"",
		"mtime": "2026-09-30T19:32:41.249Z",
		"size": 1199,
		"path": "../public/assets/createLucideIcon-BbVlV1oH.js"
	},
	"/assets/credit-card-Dv85rHib.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cf-Hh6/R507z4kJF81M6qJohMk3kw4\"",
		"mtime": "2026-09-30T19:32:41.249Z",
		"size": 207,
		"path": "../public/assets/credit-card-Dv85rHib.js"
	},
	"/assets/dialog-BYS0wFtM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b16-0/jmVTz3bYNTLw/tJvcGgQ7l5Lk\"",
		"mtime": "2026-09-30T19:32:41.251Z",
		"size": 2838,
		"path": "../public/assets/dialog-BYS0wFtM.js"
	},
	"/assets/dist-BdPE5f6w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27e-aMIKT0dNy7kY4ynvpDcjyAECXsc\"",
		"mtime": "2026-09-30T19:32:41.263Z",
		"size": 638,
		"path": "../public/assets/dist-BdPE5f6w.js"
	},
	"/assets/dist-BnaNrwI6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e7-6KaUP79l714x08i7uF+KeUFTiQU\"",
		"mtime": "2026-09-30T19:32:41.264Z",
		"size": 5095,
		"path": "../public/assets/dist-BnaNrwI6.js"
	},
	"/assets/dist-BsKciGRP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"81d9-gW2/bdD8/EIRTPivDoAl8zGqGrE\"",
		"mtime": "2026-09-30T19:32:41.265Z",
		"size": 33241,
		"path": "../public/assets/dist-BsKciGRP.js"
	},
	"/assets/dist-CDV_NBgI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109d-AevxKBLtuAx8cqBA33PWRy8zmOE\"",
		"mtime": "2026-09-30T19:32:41.266Z",
		"size": 4253,
		"path": "../public/assets/dist-CDV_NBgI.js"
	},
	"/assets/dist-DGcd9T5d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75dc-OSyRQlfGfaDKEJYir++ErcGd54Q\"",
		"mtime": "2026-09-30T19:32:41.266Z",
		"size": 30172,
		"path": "../public/assets/dist-DGcd9T5d.js"
	},
	"/assets/dist-DiVK9HMO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4cb8-J2aZ98quRLk0UPN09wMiYsyi6lE\"",
		"mtime": "2026-09-30T19:32:41.282Z",
		"size": 19640,
		"path": "../public/assets/dist-DiVK9HMO.js"
	},
	"/assets/dollar-sign-JvzSkZMH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db-jf10RRSExT76gSqFLI/lkBA4/JI\"",
		"mtime": "2026-09-30T19:32:41.283Z",
		"size": 219,
		"path": "../public/assets/dollar-sign-JvzSkZMH.js"
	},
	"/assets/download-ZT83-vCP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-Y26HggtxgQPhC6IdZ6ZVpbh4Pc4\"",
		"mtime": "2026-09-30T19:32:41.284Z",
		"size": 232,
		"path": "../public/assets/download-ZT83-vCP.js"
	},
	"/assets/driver-login-Cs7A_9ra.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2393-7UnfFYYaEqHxHr8sHYXs4DgHm2s\"",
		"mtime": "2026-09-30T19:32:41.285Z",
		"size": 9107,
		"path": "../public/assets/driver-login-Cs7A_9ra.js"
	},
	"/assets/driver-portal-mrK3rUSb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"53ac-NMOxiuRc537mYvmz66oPBdsA6+k\"",
		"mtime": "2026-09-30T19:32:41.294Z",
		"size": 21420,
		"path": "../public/assets/driver-portal-mrK3rUSb.js"
	},
	"/assets/earth-C2uopZYM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"189-ft/44ETqWN7S09ujXCGTpzAs9/A\"",
		"mtime": "2026-09-30T19:32:41.295Z",
		"size": 393,
		"path": "../public/assets/earth-C2uopZYM.js"
	},
	"/assets/external-link-BuTL9QSp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-lBgHbnnml68Hoxbe948yuBiI1Vo\"",
		"mtime": "2026-09-30T19:32:41.295Z",
		"size": 251,
		"path": "../public/assets/external-link-BuTL9QSp.js"
	},
	"/assets/eye-Bi1ipk96.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-rIYlLyR/saSyELf8P9q79Knz8MM\"",
		"mtime": "2026-09-30T19:32:41.296Z",
		"size": 256,
		"path": "../public/assets/eye-Bi1ipk96.js"
	},
	"/assets/funnel-BB1y6Kmv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-lYx6Lx1ig1o3MR45mh1HKLaJloM\"",
		"mtime": "2026-09-30T19:32:41.297Z",
		"size": 256,
		"path": "../public/assets/funnel-BB1y6Kmv.js"
	},
	"/assets/file-text-BlF8BLF-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"181-R/daL+ONKbarAr74Gx+SqkaabXY\"",
		"mtime": "2026-09-30T19:32:41.296Z",
		"size": 385,
		"path": "../public/assets/file-text-BlF8BLF-.js"
	},
	"/assets/globe-CwthSaAo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2-5OCyezWIuVmcxy8gs1I7g/4CFFc\"",
		"mtime": "2026-09-30T19:32:41.307Z",
		"size": 242,
		"path": "../public/assets/globe-CwthSaAo.js"
	},
	"/assets/handshake-ChKxRR42.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1be-mWD9xrfV5egFmAG7P7cXdLyZwjw\"",
		"mtime": "2026-09-30T19:32:41.309Z",
		"size": 446,
		"path": "../public/assets/handshake-ChKxRR42.js"
	},
	"/assets/input-ChrYrGB2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"542-6aZClNl148RXu52lCMjHmgc6xdM\"",
		"mtime": "2026-09-30T19:32:41.311Z",
		"size": 1346,
		"path": "../public/assets/input-ChrYrGB2.js"
	},
	"/assets/jsx-dev-runtime-kfSKQyiO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21d6-DSL4gk/8N3o6NnWdQtYR8ek++Cc\"",
		"mtime": "2026-09-30T19:32:41.346Z",
		"size": 8662,
		"path": "../public/assets/jsx-dev-runtime-kfSKQyiO.js"
	},
	"/assets/label-DfquAlC8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33f-VBRWA8AbktJYb5lfsOMM+cx/S5E\"",
		"mtime": "2026-09-30T19:32:41.349Z",
		"size": 831,
		"path": "../public/assets/label-DfquAlC8.js"
	},
	"/assets/link-B6zWhamL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"558d-nKBHLDKcKREDTXoJ3LDNEl4NmxY\"",
		"mtime": "2026-09-30T19:32:41.350Z",
		"size": 21901,
		"path": "../public/assets/link-B6zWhamL.js"
	},
	"/assets/loader-circle-mdeV3lk1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-rDUEewwKR3wBUXw3TzaMUbJhfJA\"",
		"mtime": "2026-09-30T19:32:41.351Z",
		"size": 144,
		"path": "../public/assets/loader-circle-mdeV3lk1.js"
	},
	"/assets/lock-BbaJUpyW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce-S6cMAAQVrhjWyO4CsfxcUQAWKGM\"",
		"mtime": "2026-09-30T19:32:41.351Z",
		"size": 206,
		"path": "../public/assets/lock-BbaJUpyW.js"
	},
	"/assets/index-JgC6YLnk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f52e-tXL7seo1Wwp1yBXgX2iZ6SXj+fA\"",
		"mtime": "2026-09-30T19:32:41.131Z",
		"size": 324910,
		"path": "../public/assets/index-JgC6YLnk.js"
	},
	"/assets/log-out-Bb7CN_er.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-TBAmH7SsvQXGVUrSg4MX3BLl0dw\"",
		"mtime": "2026-09-30T19:32:41.352Z",
		"size": 230,
		"path": "../public/assets/log-out-Bb7CN_er.js"
	},
	"/assets/login-Bt4fqei-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"43a6-9qpaixXVoThGRbvH4x4+ZjP25+g\"",
		"mtime": "2026-09-30T19:32:41.353Z",
		"size": 17318,
		"path": "../public/assets/login-Bt4fqei-.js"
	},
	"/assets/mail-BI5DlWgP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-xOZJAEspzxum6l+7vP9R+8ivKd4\"",
		"mtime": "2026-09-30T19:32:41.354Z",
		"size": 213,
		"path": "../public/assets/mail-BI5DlWgP.js"
	},
	"/assets/map-pin-gkyZ84jh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103-3dflY5WdJMachm6yIJdFIKFcG04\"",
		"mtime": "2026-09-30T19:32:41.370Z",
		"size": 259,
		"path": "../public/assets/map-pin-gkyZ84jh.js"
	},
	"/assets/matchContext-s0D-FT46.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a6-BJpM+cZDvvVqGfi+PB4A3nmkrFk\"",
		"mtime": "2026-09-30T19:32:41.373Z",
		"size": 166,
		"path": "../public/assets/matchContext-s0D-FT46.js"
	},
	"/assets/message-square-C4ULR36t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9-5CHiMjkICGz5OngMogDwlmgtUyg\"",
		"mtime": "2026-09-30T19:32:41.373Z",
		"size": 233,
		"path": "../public/assets/message-square-C4ULR36t.js"
	},
	"/assets/navigation-CGi-vCcC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"94-SeAC8buTyOclxCUh7cpZuI3wjBQ\"",
		"mtime": "2026-09-30T19:32:41.374Z",
		"size": 148,
		"path": "../public/assets/navigation-CGi-vCcC.js"
	},
	"/assets/page-header-DuWicMpU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3ba-xoRC+6gZwn9lQe20jXSNONBD1IE\"",
		"mtime": "2026-09-30T19:32:41.382Z",
		"size": 954,
		"path": "../public/assets/page-header-DuWicMpU.js"
	},
	"/assets/pen-DnTAPPN_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eb-u5teJaM8Y5YAaSoxdfPhRE4HGv4\"",
		"mtime": "2026-09-30T19:32:41.383Z",
		"size": 235,
		"path": "../public/assets/pen-DnTAPPN_.js"
	},
	"/assets/preload-helper-CdxlCoaD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1614-l1nR8P7hxs6/cTsMqmKYDMkLT6Q\"",
		"mtime": "2026-09-30T19:32:41.385Z",
		"size": 5652,
		"path": "../public/assets/preload-helper-CdxlCoaD.js"
	},
	"/assets/progress-CgSFrJU-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9c3-nHkd7v9+0pXi0yXwLhiw+YAewOM\"",
		"mtime": "2026-09-30T19:32:41.385Z",
		"size": 2499,
		"path": "../public/assets/progress-CgSFrJU-.js"
	},
	"/assets/query-DtR07I5c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a32-fZIYCUt1ObpdriCpePczBsQr36k\"",
		"mtime": "2026-09-30T19:32:41.388Z",
		"size": 14898,
		"path": "../public/assets/query-DtR07I5c.js"
	},
	"/assets/refresh-cw-gIJPGGeW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-92QG7hRvrl2GapR4Vb/k9K7o7H4\"",
		"mtime": "2026-09-30T19:32:41.389Z",
		"size": 321,
		"path": "../public/assets/refresh-cw-gIJPGGeW.js"
	},
	"/assets/search-DBBQq9zM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-5HOlz+rDiFrKFct/rzDojyrmxK0\"",
		"mtime": "2026-09-30T19:32:41.389Z",
		"size": 174,
		"path": "../public/assets/search-DBBQq9zM.js"
	},
	"/assets/select-70oQ0xrk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5c73-ibIRzEUbmwdkBxcPQQHPflmcLVc\"",
		"mtime": "2026-09-30T19:32:41.389Z",
		"size": 23667,
		"path": "../public/assets/select-70oQ0xrk.js"
	},
	"/assets/send-BrO56sCd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"196-3Zbzz52Wr/uLE+24L8OHkNjyUVs\"",
		"mtime": "2026-09-30T19:32:41.391Z",
		"size": 406,
		"path": "../public/assets/send-BrO56sCd.js"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"2084f3-lbrHneGMnT3u26UWV+NHwiFveI8\"",
		"mtime": "2026-08-03T09:17:07.962Z",
		"size": 2131187,
		"path": "../public/logo.png"
	},
	"/Gemini_Generated_Image_39ayty39ayty39ay.png": {
		"type": "image/png",
		"etag": "\"2084f3-lbrHneGMnT3u26UWV+NHwiFveI8\"",
		"mtime": "2026-08-03T09:17:07.962Z",
		"size": 2131187,
		"path": "../public/Gemini_Generated_Image_39ayty39ayty39ay.png"
	},
	"/assets/separator-DemYynFj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"462-uMqirFGX7kJLCa2PuBLbhSoKgs8\"",
		"mtime": "2026-09-30T19:32:41.391Z",
		"size": 1122,
		"path": "../public/assets/separator-DemYynFj.js"
	},
	"/assets/sparkles-Bjo8roh5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-j7cyIi2HYyl9dZf8fwquK6oLL6g\"",
		"mtime": "2026-09-30T19:32:41.392Z",
		"size": 494,
		"path": "../public/assets/sparkles-Bjo8roh5.js"
	},
	"/assets/star-CGhQ1w81.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8-3645RDObOZb0x29MyVbqNr2he4I\"",
		"mtime": "2026-09-30T19:32:41.392Z",
		"size": 472,
		"path": "../public/assets/star-CGhQ1w81.js"
	},
	"/assets/tabs-C04OCeIr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2d-cX/TR6tHA1dUuqmMKicn2FXd8GA\"",
		"mtime": "2026-09-30T19:32:41.398Z",
		"size": 3885,
		"path": "../public/assets/tabs-C04OCeIr.js"
	},
	"/assets/ticket-D3jQqIdJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-ARr8G+F7KcHAx9D1/jJ2+WrQyfU\"",
		"mtime": "2026-09-30T19:32:41.399Z",
		"size": 321,
		"path": "../public/assets/ticket-D3jQqIdJ.js"
	},
	"/assets/textarea-nVj9S4LV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28d-Qv4s+uUuiAmZSR/i5d9oSGCFK5Y\"",
		"mtime": "2026-09-30T19:32:41.398Z",
		"size": 653,
		"path": "../public/assets/textarea-nVj9S4LV.js"
	},
	"/assets/trash-2-CrWnPpWm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-NmxNEnvEr2ASJ4bJeXtHTDJviIM\"",
		"mtime": "2026-09-30T19:32:41.414Z",
		"size": 328,
		"path": "../public/assets/trash-2-CrWnPpWm.js"
	},
	"/assets/styles-DEz7VAxz.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"240f4-fxWvaJdI+61qnmGIcv5dpzIwyrE\"",
		"mtime": "2026-09-30T19:32:41.462Z",
		"size": 147700,
		"path": "../public/assets/styles-DEz7VAxz.css"
	},
	"/assets/traveler-login-BJqyGezr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2883-zv+Yq+S2PvuhUk7yOwHoT/5QXhQ\"",
		"mtime": "2026-09-30T19:32:41.414Z",
		"size": 10371,
		"path": "../public/assets/traveler-login-BJqyGezr.js"
	},
	"/assets/traveler-portal-gHvF-hUL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4fed-6SL5qVcidghAnnp8DfR+reQgxFo\"",
		"mtime": "2026-09-30T19:32:41.415Z",
		"size": 20461,
		"path": "../public/assets/traveler-portal-gHvF-hUL.js"
	},
	"/assets/trending-up-CCdYIEJh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-8iLyWi/BNZkHa5drANQnyHiFSr8\"",
		"mtime": "2026-09-30T19:32:41.433Z",
		"size": 175,
		"path": "../public/assets/trending-up-CCdYIEJh.js"
	},
	"/assets/upload-2EItoPq8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-jKQSZdYf9iJvLcHl2cNQNo0IgfM\"",
		"mtime": "2026-09-30T19:32:41.435Z",
		"size": 230,
		"path": "../public/assets/upload-2EItoPq8.js"
	},
	"/assets/useMatch-DjcHUlIr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c7-LFhL/Q7XPxN17eoyWEaeG5b0Qo4\"",
		"mtime": "2026-09-30T19:32:41.440Z",
		"size": 711,
		"path": "../public/assets/useMatch-DjcHUlIr.js"
	},
	"/assets/useMutation-BeyB1m6U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"94c-GLLtykTdoYphbe6VD+YApIfvSnE\"",
		"mtime": "2026-09-30T19:32:41.449Z",
		"size": 2380,
		"path": "../public/assets/useMutation-BeyB1m6U.js"
	},
	"/assets/useQuery-C08sYIBK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f7c-SPmGF67Tgp0TPk3GridWic5UHp8\"",
		"mtime": "2026-09-30T19:32:41.451Z",
		"size": 8060,
		"path": "../public/assets/useQuery-C08sYIBK.js"
	},
	"/assets/useNavigate-wHkA_65k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-wQpKcJG6hs9SCkNZ5S4R6KRqTTg\"",
		"mtime": "2026-09-30T19:32:41.450Z",
		"size": 232,
		"path": "../public/assets/useNavigate-wHkA_65k.js"
	},
	"/assets/user-plus-BFImMChF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-/VJHE5d7ScL0NtAhBQcaHbM0QYE\"",
		"mtime": "2026-09-30T19:32:41.461Z",
		"size": 310,
		"path": "../public/assets/user-plus-BFImMChF.js"
	},
	"/assets/useRouter-BCE04MAu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-RlFxInpu/UvBSMdqclrG3kZg7R0\"",
		"mtime": "2026-09-30T19:32:41.451Z",
		"size": 155,
		"path": "../public/assets/useRouter-BCE04MAu.js"
	},
	"/assets/useStore-CHuo-_Fe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"829-Ojswwk7tUbH12wVUCOefIAllOOU\"",
		"mtime": "2026-09-30T19:32:41.452Z",
		"size": 2089,
		"path": "../public/assets/useStore-CHuo-_Fe.js"
	},
	"/assets/_app.applications-D0naMiEl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e6e-LigDu0cqY+Sba4NAY2gA+wra0Dg\"",
		"mtime": "2026-09-30T19:32:41.132Z",
		"size": 11886,
		"path": "../public/assets/_app.applications-D0naMiEl.js"
	},
	"/assets/_app-BsDxL0Ij.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12862-yPwzi84qwTMPiHPqXomisUXp/jM\"",
		"mtime": "2026-09-30T19:32:41.131Z",
		"size": 75874,
		"path": "../public/assets/_app-BsDxL0Ij.js"
	},
	"/assets/_app.finance-C3WTArtm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31eb-F9/K/flzH6fhMnE6VDL4jAEwy1s\"",
		"mtime": "2026-09-30T19:32:41.133Z",
		"size": 12779,
		"path": "../public/assets/_app.finance-C3WTArtm.js"
	},
	"/assets/_app.approvals-BmWctjXh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b84d-V8eKYIQ0wQB6sy5ID+Ls3P7rBFU\"",
		"mtime": "2026-09-30T19:32:41.132Z",
		"size": 47181,
		"path": "../public/assets/_app.approvals-BmWctjXh.js"
	},
	"/assets/_app.hr-C3Jhe46z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12a81-bKNwevcl+4vBcHtBIigwxI03244\"",
		"mtime": "2026-09-30T19:32:41.134Z",
		"size": 76417,
		"path": "../public/assets/_app.hr-C3Jhe46z.js"
	},
	"/assets/_app.index-9gfD_KMb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"62817-h+LNPOtWisHx7tZbRm5M8EHr4ZM\"",
		"mtime": "2026-09-30T19:32:41.135Z",
		"size": 403479,
		"path": "../public/assets/_app.index-9gfD_KMb.js"
	},
	"/assets/_app.india-admissions-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-09-30T19:32:41.135Z",
		"size": 38,
		"path": "../public/assets/_app.india-admissions-DJ7LAi8J.js"
	},
	"/assets/_app.partners-UshLPqn9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e841-u741uFQo/OoiGaUI4WRTSGsle/U\"",
		"mtime": "2026-09-30T19:32:41.137Z",
		"size": 59457,
		"path": "../public/assets/_app.partners-UshLPqn9.js"
	},
	"/assets/_app.leads-BTkyo7C0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a01-OsacThno784gC/80icjhMvKx9vs\"",
		"mtime": "2026-09-30T19:32:41.137Z",
		"size": 35329,
		"path": "../public/assets/_app.leads-BTkyo7C0.js"
	},
	"/assets/_app.reports-DqGVxgq4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1379-L8bAjK8RQjg2EbO4WFH5vQinzfg\"",
		"mtime": "2026-09-30T19:32:41.139Z",
		"size": 4985,
		"path": "../public/assets/_app.reports-DqGVxgq4.js"
	},
	"/assets/_app.portal-BzXewKUc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"115e5-664sonUAcim8aN2qOexvYb48Vy0\"",
		"mtime": "2026-09-30T19:32:41.139Z",
		"size": 71141,
		"path": "../public/assets/_app.portal-BzXewKUc.js"
	},
	"/assets/_app.settings-zczaROSE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3149-Otp7X1Pe1BYIrQXakj0dApOR/kI\"",
		"mtime": "2026-09-30T19:32:41.139Z",
		"size": 12617,
		"path": "../public/assets/_app.settings-zczaROSE.js"
	},
	"/assets/_app.students-0kDiZupI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"130-566LIVnW28nZ0FEclg9FoYqAEyE\"",
		"mtime": "2026-09-30T19:32:41.144Z",
		"size": 304,
		"path": "../public/assets/_app.students-0kDiZupI.js"
	},
	"/assets/_app.students.index-pO_z9LRC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d0e-YnrqQ3kyUk5sqcWa0ridZtsQH/8\"",
		"mtime": "2026-09-30T19:32:41.145Z",
		"size": 23822,
		"path": "../public/assets/_app.students.index-pO_z9LRC.js"
	},
	"/assets/_app.students._studentId-BJi7CLOF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fe89-HAljtRSbVli6qWvtB3x8sKeW9VE\"",
		"mtime": "2026-09-30T19:32:41.145Z",
		"size": 65161,
		"path": "../public/assets/_app.students._studentId-BJi7CLOF.js"
	},
	"/assets/_app.travel-destinations-DJOjH4pC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a6c-C0Ll8uCf+Zut37jA6eI4iEWX1gE\"",
		"mtime": "2026-09-30T19:32:41.149Z",
		"size": 14956,
		"path": "../public/assets/_app.travel-destinations-DJOjH4pC.js"
	},
	"/assets/_app.travel-CzkZGDwo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"157a0-RVO3vxPCbtdQMwXmVJRQ3cHhxpc\"",
		"mtime": "2026-09-30T19:32:41.145Z",
		"size": 87968,
		"path": "../public/assets/_app.travel-CzkZGDwo.js"
	},
	"/assets/_app.travel-services-C_6ynz90.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a89-ZAhYMq2fYL1pHNcgvxTw7PdfBm8\"",
		"mtime": "2026-09-30T19:32:41.149Z",
		"size": 14985,
		"path": "../public/assets/_app.travel-services-C_6ynz90.js"
	},
	"/assets/_app.universities-VMqBDT5y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2718-8mBjDqJbbV5MExwbF8JVrg2hHFk\"",
		"mtime": "2026-09-30T19:32:41.150Z",
		"size": 10008,
		"path": "../public/assets/_app.universities-VMqBDT5y.js"
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
