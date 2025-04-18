export const CATEGORY_OPTIONS = [
  {
    key: "wine",
    label: "Wine",
    emoji: "🍷",
    promptDetails: "Only return actual wines. Always include include the varietal (e.g. Pinot Noir, Chenin Blanc), the winery (only real wineries), the vintage year (e.g. 2016, or NV for non-vintages like some champagnes), and a brief, fun description of the wine.",
    isEnabled: true
  },
  {
    key: "album",
    label: "Album",
    emoji: "🎶",
    promptDetails: "Only use actual albums from actual artists. Always include the artist name and album title, and a brief description of the album (like the notes you would find in a well-curated record store).",
    isEnabled: true
  },
  {
    key: "book",
    label: "Book",
    emoji: "📚",
    promptDetails: "Only use actual books. Always include the title and author, and a brief description of the book.",
    isEnabled: true
  },
  {
    key: "activities",
    label: "Activities",
    emoji: "🔥",
    promptDetails: "Be creative - think of activities that will be both fun and engaging for pairs and small groups. Focus as much on emotional connection as physicality.",
    isEnabled: true
  },
  {
    key: "board_game",
    label: "Board Game",
    emoji: "🎲",
    promptDetails: "Only use actual board games. Always describe the theme and game mechanic briefly.",
    isEnabled: true
  },
  {
    key: "whisky",
    label: "Whisky",
    emoji: "🥃",
    promptDetails: "Only use actual whisky or whiskey brands. Always include the brand and name of the product, age statement if any, and a brief description of the product.",
    isEnabled: true
  },
  {
    key: "sgs_whisky",
    label: "Suntory Global Spirits Product",
    emoji: "🥃",
    promptDetails: "Only use actual Suntory Global Spirits brands, including Jim Beam, Maker's Mark, Knob Creek, Basil Hayden, Booker's, and the Suntory Japanese whiskies.",
    isEnabled: false
  }
];