"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionCard = SectionCard;
const utils_1 = require("@/lib/utils");
function SectionCard({ children, className }) {
    return (<section className={(0, utils_1.cn)('rounded-[2rem] border border-slate-200/80 bg-white px-5 py-4 shadow-lg', className)}>
      {children}
    </section>);
}
