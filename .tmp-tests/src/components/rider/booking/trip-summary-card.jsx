"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripSummaryCard = TripSummaryCard;
const lucide_react_1 = require("lucide-react");
const section_card_1 = require("../section-card");
function TripSummaryCard({ pickup, destination }) { return <section_card_1.SectionCard><div className="space-y-3"><div className="flex gap-3"><lucide_react_1.Navigation className="h-5 w-5 text-primary"/><div><p className="text-xs font-bold text-muted-foreground">Pickup</p><p className="font-semibold">{pickup}</p></div></div><div className="ml-2 h-5 border-l border-dashed"/><div className="flex gap-3"><lucide_react_1.MapPin className="h-5 w-5 text-red-500"/><div><p className="text-xs font-bold text-muted-foreground">Drop-off</p><p className="font-semibold">{destination}</p></div></div></div></section_card_1.SectionCard>; }
