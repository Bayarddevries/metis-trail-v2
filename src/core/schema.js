/**
 * Source citation attached to narrative content.
 * @typedef {Object} Source
 * @property {string} quote
 * @property {string} author
 * @property {string} [work]
 * @property {number} [year]
 * @property {string} [url]
 */

/**
 * @typedef {Object} EventChoice
 * @property {string} text
 * @property {number|null} dc
 * @property {string} [need]
 * @property {string} ok
 * @property {string} bad
 * @property {string} [always]
 * @property {number} [alwaysWear]
 * @property {number} [time]
 * @property {number} [food]
 * @property {string} [crew]
 * @property {{name:string, amt:number}[]} [give]
 * @property {number} [extraProgress]
 */

/**
 * @typedef {Object} GameEvent
 * @property {string} id
 * @property {string} terrain
 * @property {string} text
 * @property {Source} [source]
 * @property {EventChoice[]} choices
 */

/**
 * @typedef {Object} Item
 * @property {string} name
 * @property {number} wt
 * @property {number} count
 * @property {'food'|'repair'|'shelter'|'fuel'|'tool'|'medical'|'trade'|'ammo'} type
 * @property {string} desc
 * @property {string} [icon]
 * @property {Source} [source]
 */

/**
 * @typedef {Object} Node
 * @property {string} id
 * @property {string} name
 * @property {number} lat
 * @property {number} lon
 * @property {'hbc'|'mission'|'metis'|'trading'|'nwmp'|'river'} type
 * @property {string} terrain
 * @property {number} dist
 * @property {string} desc
 * @property {Source} [source]
 */

/** @typedef {'trade'|'repair'|'rest'|'heal'|'grease'|'forage'|'recruit'|'rumours'|'continue'} SettlementAction */
