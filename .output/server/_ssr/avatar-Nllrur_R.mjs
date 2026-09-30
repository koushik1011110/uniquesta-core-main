import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { n as cn } from "./button-Th46ikol.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/avatar-Nllrur_R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/components/ui/avatar.tsx";
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 12,
	columnNumber: 3
}, void 0));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 24,
	columnNumber: 3
}, void 0));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 36,
	columnNumber: 3
}, void 0));
AvatarFallback.displayName = AvatarFallback$1.displayName;
//#endregion
export { AvatarFallback as n, AvatarImage as r, Avatar as t };
