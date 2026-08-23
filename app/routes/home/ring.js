// The carousel ring, shared by the carousel itself and the flight layer.
//
// Four of these slots are filled by cards that fly down out of the achievements
// grid — `from` names the flight card that lands there — and the rest fill on
// their own. Angles are explicit rather than index * step so the four arriving
// cards can be kept in the front hemisphere: a slot near 90deg is edge-on, and
// a card can't land on a zero-width box.
export const RING = [
  { id: 'crazy-mountaineers', shape: 'web', angle: 0, from: 'a' },
  { id: 'ladderbrief', shape: 'web', angle: 30, from: 'b' },
  { id: 'dr-sachins-dental', shape: 'web', angle: 330, from: 'c' },
  { id: 'admissiondesk', shape: 'web', angle: 60, from: 'd' },
  { id: 'yumy', shape: 'web', angle: 300 },
  { id: 'flexipaisa', shape: 'app', angle: 90 },
  { id: 'sra-hotels', shape: 'web', angle: 270 },
  { id: 'llm-controls', shape: 'web', angle: 120 },
  { id: 'anymart', shape: 'web', angle: 240 },
  { id: 'preplix', shape: 'web', angle: 150 },
  { id: 'hotel-classic-inn', shape: 'web', angle: 210 },
  { id: 'objs', shape: 'web', angle: 180 },
];

// Slots fill one after another, and only once the last one is in does the ring
// start to turn. The flight layer uses the same windows so an arriving card
// reaches its slot exactly as that slot begins to fill.
export const FILL_START = 0.04;
export const FILL_STAGGER = 0.018;
export const FILL_DURATION = 0.07;
export const SPIN_START = FILL_START + FILL_STAGGER * RING.length + FILL_DURATION;

export const fillWindow = index => {
  const start = FILL_START + index * FILL_STAGGER;

  return { start, end: start + FILL_DURATION };
};

// Keyed by the flight card that lands in each slot. `order` staggers the four
// departures so they don't leave the grid in lockstep.
export const ARRIVALS = Object.fromEntries(
  RING.map((item, index) => [item.from, { ...fillWindow(index), index }])
    .filter(([key]) => key)
    .map(([key, value], order) => [key, { ...value, order }])
);
